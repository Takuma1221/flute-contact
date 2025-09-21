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

// Resendクライアント初期化（環境変数チェック付き）
console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Google Sheets認証
async function getGoogleSheetsClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets credentials not configured");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// ライブ情報を取得する関数
async function loadLiveInfo() {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const liveInfoFile = path.join(process.cwd(), "data", "live-info.json");
    const data = await fs.readFile(liveInfoFile, "utf-8");
    return JSON.parse(data);
  } catch {
    // デフォルト値を返す
    return {
      liveDate: "2025年10月4日（土）",
      liveTime1: "14:00",
      liveTime2: "18:00",
      venue: "詳細は予約後にご案内いたします",
      venueAddress: "",
      generalPrice: 4000,
      studentPrice: 3000,
      deliveryFee: 200,
      maxTickets: 10,
    };
  }
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
async function saveToGoogleSheets(data: ReservationData): Promise<boolean> {
  try {
    console.log("Starting Google Sheets save process...");
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID!;
    console.log("Spreadsheet ID:", spreadsheetId);

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

    // スプレッドシートのシート情報を取得
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // 最初のシートの名前を取得（日本語名に対応）
    const firstSheetName =
      spreadsheetInfo.data.sheets?.[0]?.properties?.title || "Sheet1";
    console.log("Using sheet name:", firstSheetName);

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${firstSheetName}!A:L`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log("Successfully saved to Google Sheets:", result.data);

    return true;
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // 環境変数をチェック
    console.error("Environment check:");
    console.error("GOOGLE_CLIENT_EMAIL exists:", !!process.env.GOOGLE_CLIENT_EMAIL);
    console.error("GOOGLE_PRIVATE_KEY exists:", !!process.env.GOOGLE_PRIVATE_KEY);
    console.error("GOOGLE_SPREADSHEET_ID exists:", !!process.env.GOOGLE_SPREADSHEET_ID);
    return false;
  }
}

// 確認メール送信
async function sendConfirmationEmail(data: ReservationData) {
  try {
    console.log("Starting email send process...");
    console.log("Email recipient:", data.email);

    if (!resend) {
      console.error("Resend client not initialized - API key missing");
      return false;
    }

    // 管理画面のライブ情報を取得
    const liveInfo = await loadLiveInfo();
    console.log("Loaded live info for email:", liveInfo);

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
⚫︎ 三井住友銀行
【支店名】池袋支店
【口座番号】普通 2207443
【口座名義】 吉原理恵

⚫︎ 郵便局
【記号】10170
【番号】82596591
【口座名義】ヨシハラリエ

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

    // 日程表示の整理
    const liveDateDisplay = data.liveDate.includes("14:00")
      ? `${liveInfo.liveDate} ${liveInfo.liveTime1}開演`
      : `${liveInfo.liveDate} ${liveInfo.liveTime2}開演`;

    const emailContent = `${data.name}様

この度は、吉原りえフルートライブにお申し込みいただき、誠にありがとうございます。
以下の内容でご予約を承りました。

■ご予約内容
・お名前: ${data.name}
・ライブ日程: ${liveDateDisplay}
・チケット詳細: 一般 ${data.generalTickets}枚、学生 ${data.studentTickets}枚
・受取方法: ${deliveryMethodName}
・合計金額: ¥${total.toLocaleString()}
・支払い方法: ${paymentMethodName}

■お支払いについて${paymentInstructions}

■会場情報
会場: ${liveInfo.venue}${
      liveInfo.venueAddress
        ? `
住所: ${liveInfo.venueAddress}`
        : ""
    }
開場: 開演の30分前

■注意事項
・チケット受取: ${deliveryMethodName}
・お客様都合によるお申込み後のキャンセルおよび返金はお受けしておりません
・当日現金払いを選択されたお客様でご来場いただけなかった場合には、10/10(金)までにお振込み下さいますようお願いいたします
・録音・録画はご遠慮ください

■お問い合わせ
吉原りえ
メール: takumakawauso4649@gmail.com
Instagram: @fueneko_rie

素敵な音楽の時間をお楽しみに！
心よりお待ちしております。`;

    console.log("Sending email to:", data.email);

    const emailResult = await resend.emails.send({
      from: "onboarding@resend.dev", // Resendのテスト用ドメイン
      to: data.email,
      subject:
        "【フルートライブ】チケットご予約ありがとうございます - 吉原りえ",
      text: emailContent,
    });

    console.log("Email sent successfully:", emailResult);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの確認
    const body = await request.text();
    console.log("Received request body:", body);

    if (!body) {
      return NextResponse.json(
        { error: "リクエストボディが空です" },
        { status: 400 }
      );
    }

    const data: ReservationData = JSON.parse(body);
    console.log("Parsed data:", data);

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
    console.log("Attempting to send confirmation email...");
    const emailSent = await sendConfirmationEmail(data);
    console.log("Email send result:", emailSent);
    if (!emailSent) {
      console.error("Failed to send confirmation email");
    } else {
      console.log("Confirmation email sent successfully");
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
