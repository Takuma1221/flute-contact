import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Admin auth API called");

  try {
    // リクエストボディの解析
    const body = await request.json();
    console.log("Request body received:", {
      passwordProvided: !!body.password,
    });

    const { password } = body;

    if (!password) {
      console.log("No password provided");
      return NextResponse.json(
        { error: "パスワードが入力されていません" },
        { status: 400 }
      );
    }

    // 環境変数からパスワードを取得
    const adminPassword = process.env.ADMIN_PASSWORD;
    console.log("Environment check:", {
      adminPasswordSet: !!adminPassword,
      nodeEnv: process.env.NODE_ENV,
    });

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return NextResponse.json(
        { error: "管理機能が設定されていません" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      console.log("Authentication successful");
      return NextResponse.json({ success: true });
    } else {
      console.log("Authentication failed - password mismatch");
      return NextResponse.json(
        { error: "パスワードが間違っています" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "認証エラーが発生しました" },
      { status: 500 }
    );
  }
}
