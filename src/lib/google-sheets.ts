import { google } from "googleapis";

// LiveInfo型定義
export interface LiveInfo {
  liveDate: string;
  liveTime1: string;
  liveTime2?: string;
  venue: string;
  venueAddress?: string;
  generalPrice: number;
  studentPrice: number;
  deliveryFee: number;
  maxTickets: number;
  notes?: string;
  programImageUrl?: string;
  cancelPolicy?: string;
  cancelDeadlineDays?: number;
  updatedAt: string;
}

// デフォルトのライブ情報
export const defaultLiveInfo: LiveInfo = {
  liveDate: "2025年10月4日（土）",
  liveTime1: "14:00",
  liveTime2: "",
  venue: "詳細は予約後にご案内いたします",
  venueAddress: "",
  generalPrice: 4000,
  studentPrice: 3000,
  deliveryFee: 200,
  maxTickets: 10,
  notes: "",
  programImageUrl: "/images/concert-program.png",
  cancelPolicy:
    "お客様都合によるお申込み後のキャンセルおよび返金はお受けしておりません。予めご了承ください。\nなお、当日現金払いを選択されたお客様でご来場いただけなかった場合には、お手数ですが お振込み下さいますようお願いいたします。",
  cancelDeadlineDays: 0,
  updatedAt: new Date().toISOString(),
};

// Google Sheetsクライアント取得
export async function getGoogleSheetsClient() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error("Google Sheets credentials not configured");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

// LiveInfoシート名
const LIVE_INFO_SHEET_NAME = "LiveInfo";

// シートの存在確認と作成
async function ensureSheetExists(sheets: any, spreadsheetId: string, sheetTitle: string) {
  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet: any) => sheet.properties?.title === sheetTitle
    );

    if (!sheetExists) {
      console.log(`Sheet "${sheetTitle}" not found. Creating it...`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
      console.log(`Sheet "${sheetTitle}" created successfully.`);
      
      // デフォルト値の書き込み
      const defaultRows = Object.entries(defaultLiveInfo).map(([key, value]) => [
        key,
        value === undefined ? "" : String(value),
      ]);
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTitle}!A:B`,
        valueInputOption: "RAW",
        requestBody: {
          values: defaultRows,
        },
      });
      console.log("Default values written to new sheet.");
    }
  } catch (error) {
    console.error("Error ensuring sheet exists:", error);
    // エラーがあっても続行（権限エラーなどの場合があるため）
  }
}

// シートからライブ情報を取得
export async function getLiveInfoFromSheet(): Promise<LiveInfo> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      console.warn("GOOGLE_SPREADSHEET_ID not set, using default live info");
      return defaultLiveInfo;
    }

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${LIVE_INFO_SHEET_NAME}!A:B`,
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        console.log("No data found in LiveInfo sheet, using default");
        return defaultLiveInfo;
      }

      // Key-Valueペアをオブジェクトに変換
      const dataMap: Record<string, string> = {};
      rows.forEach((row: any[]) => { // 型定義を修正
        if (row[0]) {
          dataMap[row[0]] = row[1] || "";
        }
      });

      // 文字列から型変換してLiveInfoオブジェクトを構築
      const liveInfo: LiveInfo = {
        ...defaultLiveInfo,
        liveDate: dataMap["liveDate"] || defaultLiveInfo.liveDate,
        liveTime1: dataMap["liveTime1"] || defaultLiveInfo.liveTime1,
        liveTime2: dataMap["liveTime2"],
        venue: dataMap["venue"] || defaultLiveInfo.venue,
        venueAddress: dataMap["venueAddress"],
        generalPrice: Number(dataMap["generalPrice"]) || defaultLiveInfo.generalPrice,
        studentPrice: Number(dataMap["studentPrice"]) || defaultLiveInfo.studentPrice,
        deliveryFee: Number(dataMap["deliveryFee"]) || defaultLiveInfo.deliveryFee,
        maxTickets: Number(dataMap["maxTickets"]) || defaultLiveInfo.maxTickets,
        notes: dataMap["notes"],
        programImageUrl: dataMap["programImageUrl"],
        cancelPolicy: dataMap["cancelPolicy"] || defaultLiveInfo.cancelPolicy,
        cancelDeadlineDays: Number(dataMap["cancelDeadlineDays"]) || defaultLiveInfo.cancelDeadlineDays,
        updatedAt: dataMap["updatedAt"] || new Date().toISOString(),
      };

      return liveInfo;

    } catch (error: any) {
      // シートが見つからないエラー（400 Unable to parse range）の場合
      if (error.code === 400 && (error.message.includes("Unable to parse range") || error.message.includes("Range"))) {
        console.log("LiveInfo sheet possibly missing. Attempting to create...");
        await ensureSheetExists(sheets, spreadsheetId, LIVE_INFO_SHEET_NAME);
        // 作成後に再度取得せずにデフォルトを返すが、次回から取得可能になる
        return defaultLiveInfo;
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching live info from sheets:", error);
    return defaultLiveInfo;
  }
}

// シートにライブ情報を保存
export async function saveLiveInfoToSheet(liveInfo: LiveInfo): Promise<boolean> {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SPREADSHEET_ID not set");
    }

    // 保存前にシート存在確認
    await ensureSheetExists(sheets, spreadsheetId, LIVE_INFO_SHEET_NAME);

    // オブジェクトを[Key, Value]の配列に変換
    const rows = Object.entries(liveInfo).map(([key, value]) => [
      key,
      value === undefined ? "" : String(value),
    ]);

    // シートをクリアして書き込む
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${LIVE_INFO_SHEET_NAME}!A:B`,
      valueInputOption: "RAW",
      requestBody: {
        values: rows,
      },
    });

    return true;
  } catch (error) {
    console.error("Error saving live info to sheets:", error);
    return false;
  }
}
