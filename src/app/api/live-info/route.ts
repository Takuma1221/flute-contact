import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// 演奏会情報を保存するJSONファイルのパス
const LIVE_INFO_FILE = path.join(process.cwd(), "data", "live-info.json");

// 演奏会情報の型定義
interface LiveInfo {
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
  updatedAt: string;
}

// デフォルトの演奏会情報
const defaultLiveInfo: LiveInfo = {
  liveDate: "2025年10月4日（土）",
  liveTime1: "14:00",
  liveTime2: "18:00",
  venue: "詳細は予約後にご案内いたします",
  venueAddress: "",
  generalPrice: 4000,
  studentPrice: 3000,
  deliveryFee: 200,
  maxTickets: 10,
  notes: "",
  programImageUrl: "/images/concert-program.png",
  updatedAt: new Date().toISOString(),
};

// 演奏会情報の読み込み
async function loadLiveInfo(): Promise<LiveInfo> {
  try {
    const data = await fs.readFile(LIVE_INFO_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // ファイルが存在しない場合はデフォルト値を返す
    return defaultLiveInfo;
  }
}

// GET: 公開用演奏会情報の取得
export async function GET() {
  try {
    const liveInfo = await loadLiveInfo();

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
      { error: "演奏会情報の読み込みに失敗しました" },
      { status: 500 }
    );
  }
}
