import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    // 環境変数の確認
    const envCheck = {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
      clientEmailValue: process.env.GOOGLE_CLIENT_EMAIL
        ? process.env.GOOGLE_CLIENT_EMAIL.substring(0, 20) + "..."
        : "missing",
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID || "missing",
    };

    // Google Sheets API の接続テスト
    if (
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SPREADSHEET_ID
    ) {
      return NextResponse.json({
        success: false,
        error: "Missing Google Sheets credentials",
        envCheck,
      });
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // スプレッドシートの情報を取得
    const spreadsheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
    });

    return NextResponse.json({
      success: true,
      envCheck,
      spreadsheetTitle: spreadsheetInfo.data.properties?.title,
      sheetNames: spreadsheetInfo.data.sheets?.map(
        (sheet) => sheet.properties?.title
      ),
    });
  } catch (error) {
    console.error("Google Sheets debug error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      envCheck: {
        hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
        hasSpreadsheetId: !!process.env.GOOGLE_SPREADSHEET_ID,
      },
    });
  }
}
