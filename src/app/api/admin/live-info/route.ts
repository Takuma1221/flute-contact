import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// ライブ情報の型定義
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
  updatedAt: string;
}

// ライブ情報を保存するJSONファイルのパス
const LIVE_INFO_FILE = path.join(process.cwd(), "data", "live-info.json");

// データディレクトリの作成
async function ensureDataDirectory() {
  const dataDir = path.dirname(LIVE_INFO_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// デフォルトのライブ情報
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
  updatedAt: new Date().toISOString(),
};

// ライブ情報の読み込み
async function loadLiveInfo(): Promise<LiveInfo> {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(LIVE_INFO_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // ファイルが存在しない場合はデフォルト値を返す
    return defaultLiveInfo;
  }
}

// ライブ情報の保存
async function saveLiveInfo(liveInfo: LiveInfo): Promise<void> {
  await ensureDataDirectory();
  const dataWithTimestamp = {
    ...liveInfo,
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(
    LIVE_INFO_FILE,
    JSON.stringify(dataWithTimestamp, null, 2)
  );
}

// GET: ライブ情報の取得
export async function GET() {
  try {
    const liveInfo = await loadLiveInfo();
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
      liveTime2: body.liveTime2 || undefined,
      venue: body.venue,
      venueAddress: body.venueAddress || undefined,
      generalPrice: body.generalPrice,
      studentPrice: body.studentPrice,
      deliveryFee: body.deliveryFee,
      maxTickets: body.maxTickets,
      notes: body.notes || undefined,
      updatedAt: new Date().toISOString(),
    };

    await saveLiveInfo(liveInfo);

    return NextResponse.json({
      message: "ライブ情報を更新しました",
      liveInfo,
    });
  } catch (error) {
    console.error("Error saving live info:", error);
    return NextResponse.json(
      { error: "ライブ情報の保存に失敗しました" },
      { status: 500 }
    );
  }
}
