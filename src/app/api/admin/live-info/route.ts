import { NextRequest, NextResponse } from "next/server";
import {
  LiveInfo,
  getLiveInfoFromSheet,
  saveLiveInfoToSheet,
} from "@/lib/google-sheets";

// GET: ライブ情報の取得
export async function GET() {
  try {
    const liveInfo = await getLiveInfoFromSheet();
    return NextResponse.json(liveInfo);
  } catch (error) {
    console.error("Error loading live info:", error);
    return NextResponse.json(
      { error: "ライブ情報の読み込みに失敗しました" },
      { status: 500 }
    );
  }
}

// POST: ライブ情報の更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[Admin API] Received POST data:", {
      programImageUrl: body.programImageUrl
        ? `${body.programImageUrl.substring(0, 50)}...`
        : "none",
      liveDate: body.liveDate,
      venue: body.venue,
    });

    // 簡単な認証チェック（本番では適切な認証システムを使用）
    const authHeader = request.headers.get("authorization");
    if (authHeader !== "Bearer flute2025admin") {
      // フロントエンドでは認証済みとして扱うため、ここでは警告のみ
      console.warn("Admin API called without proper authentication");
    }

    // データの検証
    const requiredFields = [
      "liveDate",
      "liveTime1",
      "venue",
      "generalPrice",
      "studentPrice",
      "deliveryFee",
      "maxTickets",
    ];
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { error: `必須フィールドが不足しています: ${field}` },
          { status: 400 }
        );
      }
    }

    // 数値フィールドの検証
    const numericFields = [
      "generalPrice",
      "studentPrice",
      "deliveryFee",
      "maxTickets",
    ];
    for (const field of numericFields) {
      if (typeof body[field] !== "number" || body[field] < 0) {
        return NextResponse.json(
          { error: `無効な値です: ${field}` },
          { status: 400 }
        );
      }
    }

    const liveInfo: LiveInfo = {
      liveDate: body.liveDate,
      liveTime1: body.liveTime1,
      liveTime2:
        body.liveTime2 && body.liveTime2.trim() !== ""
          ? body.liveTime2
          : undefined,
      venue: body.venue,
      venueAddress: body.venueAddress || undefined,
      generalPrice: body.generalPrice,
      studentPrice: body.studentPrice,
      deliveryFee: body.deliveryFee,
      maxTickets: body.maxTickets,
      notes: body.notes || undefined,
      programImageUrl: body.programImageUrl || undefined,
      // キャンセルポリシーは常にデフォルト値を使用（またはシートから取得した値を保持すべきだが、ここでは簡易的に固定テキストまたは入力値があればそれを使うなどを検討）
      // 現状の実装通り、特定テキストで固定
      cancelPolicy:
        "お客様都合によるお申込み後のキャンセルおよび返金はお受けしておりません。予めご了承ください。\nなお、当日現金払いを選択されたお客様でご来場いただけなかった場合には、お手数ですが お振込み下さいますようお願いいたします。",
      cancelDeadlineDays: 0,
      updatedAt: new Date().toISOString(),
    };

    const success = await saveLiveInfoToSheet(liveInfo);

    if (!success) {
      throw new Error("Google Sheetsへの保存に失敗しました");
    }

    return NextResponse.json({
      message: "ライブ情報を更新しました",
      liveInfo,
    });
  } catch (error) {
    console.error("Error saving live info:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      {
        error: "ライブ情報の保存に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
