import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: {
      nodeEnv: process.env.NODE_ENV,
      adminPasswordSet: !!process.env.ADMIN_PASSWORD,
      resendApiKeySet: !!process.env.RESEND_API_KEY,
      googleClientEmailSet: !!process.env.GOOGLE_CLIENT_EMAIL,
      googlePrivateKeySet: !!process.env.GOOGLE_PRIVATE_KEY,
      googleSpreadsheetIdSet: !!process.env.GOOGLE_SPREADSHEET_ID,
    }
  });
}