import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";

// 型定義
interface ReservationData {
  name: string;
  nameKana: string;
  email: string;
  phone: string;
  liveDate: string;
  generalTickets: number;
  studentTickets: number;
  deliveryMethod: string;
  paymentMethod: string;
  requests?: string;
  howDidYouKnow: string;
  agreeCancel: boolean;
  agreePrivacy: boolean;
}

// Resendクライアント初期化
const resend = new Resend(process.env.RESEND_API_KEY);

// Google Sheets認証
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// チケット価格
const TICKET_PRICES = {
  general: 4000,
  student: 3000,
  delivery: 200,
};

// 受取方法のマッピング
const deliveryMethods = {
  pickup: "当日受取（無料）",
  postal: "郵送（¥200）",
};

// 支払い方法のマッピング
const paymentMethods = {
  bank: "銀行振込（三井住友銀行）",
  paypay: "PayPay（fueneko5656）",
  cash: "現金（当日受付）",
};

// 合計金額計算
function calculateTotal(
  generalTickets: number,
  studentTickets: number,
  deliveryMethod: string
): number {
  const ticketTotal =
    generalTickets * TICKET_PRICES.general +
    studentTickets * TICKET_PRICES.student;
  const deliveryFee = deliveryMethod === "postal" ? TICKET_PRICES.delivery : 0;
  return ticketTotal + deliveryFee;
}

// Google Sheetsにデータ保存
async function saveToGoogleSheets(data: ReservationData) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID is not configured");
    }

    const total = calculateTotal(
      data.generalTickets,
      data.studentTickets,
      data.deliveryMethod
    );
    const deliveryMethodName =
      deliveryMethods[data.deliveryMethod as keyof typeof deliveryMethods] ||
      data.deliveryMethod;
    const paymentMethodName =
      paymentMethods[data.paymentMethod as keyof typeof paymentMethods] ||
      data.paymentMethod;

    const values = [
      [
        new Date().toISOString(),
        data.name,
        data.nameKana,
        data.email,
        data.phone,
        data.liveDate,
        `一般 ${data.generalTickets}枚, 学生 ${data.studentTickets}枚`,
        deliveryMethodName,
        total,
        paymentMethodName,
        data.requests || "",
        data.howDidYouKnow,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L",
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });

    return true;
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    return false;
  }
}

// 確認メール送信
async function sendConfirmationEmail(data: ReservationData) {
  try {
    const total = calculateTotal(
      data.generalTickets,
      data.studentTickets,
      data.deliveryMethod
    );
    const deliveryMethodName =
      deliveryMethods[data.deliveryMethod as keyof typeof deliveryMethods] ||
      data.deliveryMethod;
    const paymentMethodName =
      paymentMethods[data.paymentMethod as keyof typeof paymentMethods] ||
      data.paymentMethod;

    // 支払い方法別の案内
    let paymentInstructions = "";
    switch (data.paymentMethod) {
      case "bank":
        paymentInstructions = `
【銀行振込の場合】
振込先: 三井住友銀行 池袋支店 普通 xxxxxxx
口座名義: ヨシハラ リエ
振込期限: お申し込みから1週間以内
※振込手数料はお客様負担となります`;
        break;
      case "paypay":
        paymentInstructions = `
【PayPayの場合】
PayPay ID: fueneko5656
支払い期限: お申し込みから1週間以内`;
        break;
      case "cash":
        paymentInstructions = `
【現金の場合】
ライブ当日に受付でお支払いください
※お釣りのないようご準備をお願いします`;
        break;
    }

    const emailContent = `${data.name}様

この度は、フルートライブにお申し込みいただき、ありがとうございます。
以下の内容でご予約を承りました。

■ご予約内容
・お名前: ${data.name}
・ライブ日程: ${data.liveDate}
・チケット詳細: 一般 ${data.generalTickets}枚、学生 ${data.studentTickets}枚
・受取方法: ${deliveryMethodName}
・合計金額: ¥${total.toLocaleString()}
・支払い方法: ${paymentMethodName}

■お支払いについて${paymentInstructions}

■会場アクセス
Lieto Posto（リエト・ポスト）
住所: 〇〇県〇〇市〇〇町〇-〇-〇
アクセス: https://lietoposto.com/studio
開場: 開演の30分前
駐車場: 〇台（要事前連絡）

■注意事項
・チケット受取: ${deliveryMethodName}
・キャンセルの場合は、3日前までにご連絡ください
・座席は当日先着順でのご案内となります
・録音・録画はご遠慮ください

■お問い合わせ
吉原りえ
メール: contact@lietoposto.com
電話: xxx-xxxx-xxxx

素敵な音楽の時間をお楽しみに！
心よりお待ちしております。`;

    await resend.emails.send({
      from: "noreply@yourdomain.com", // 実際のドメインに変更してください
      to: data.email,
      subject:
        "【フルートライブ】チケットご予約ありがとうございます - 吉原りえ",
      text: emailContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json();

    // データ検証
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // Google Sheetsに保存
    const sheetsSaved = await saveToGoogleSheets(data);
    if (!sheetsSaved) {
      console.error("Failed to save to Google Sheets");
    }

    // 確認メール送信
    const emailSent = await sendConfirmationEmail(data);
    if (!emailSent) {
      console.error("Failed to send confirmation email");
    }

    return NextResponse.json(
      {
        success: true,
        message: "ご予約ありがとうございます。確認メールをお送りしました。",
        sheetsSaved,
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing reservation:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
