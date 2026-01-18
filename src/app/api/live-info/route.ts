import { NextRequest, NextResponse } from "next/server";
import { getLiveInfoFromSheet } from "@/lib/google-sheets";

// GET: 公開用ライブ情報の取得
export async function GET(request: NextRequest) {
  try {
    const liveInfo = await getLiveInfoFromSheet();

    // 公開用のデータを返す（管理者専用情報は除く）
    return NextResponse.json({
      liveDate: liveInfo.liveDate,
      liveTime1: liveInfo.liveTime1,
      liveTime2: liveInfo.liveTime2,
      venue: liveInfo.venue,
      venueAddress: liveInfo.venueAddress,
      generalPrice: liveInfo.generalPrice,
      studentPrice: liveInfo.studentPrice,
      deliveryFee: liveInfo.deliveryFee,
      maxTickets: liveInfo.maxTickets,
      notes: liveInfo.notes,
      programImageUrl: liveInfo.programImageUrl, // パンフレット画像URLを追加
    });
  } catch (error) {
    console.error("Error loading public live info:", error);
    return NextResponse.json(
      { error: "ライブ情報の読み込みに失敗しました" },
      { status: 500 }
    );
  }
}
