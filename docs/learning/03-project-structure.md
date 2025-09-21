# プロジェクト構成とコード解説

このプロジェクトの全体構成と各ファイルの役割について、初学者向けに詳しく解説します。

## 📚 目次

1. [プロジェクト全体構成](#プロジェクト全体構成)
2. [ディレクトリ構造の詳細](#ディレクトリ構造の詳細)
3. [コンポーネント設計](#コンポーネント設計)
4. [API 設計](#api設計)
5. [データフロー](#データフロー)

---

## プロジェクト全体構成

### 🏗️ アーキテクチャ概要

```
フロントエンド (Next.js + React)
         ↓
    API Router (Next.js API)
         ↓
外部サービス (Google Sheets + Resend)
```

### 📁 プロジェクト構造

```
flute-contact/
├── README.md                    # プロジェクト概要
├── package.json                 # 依存関係とスクリプト
├── next.config.js              # Next.js設定
├── tailwind.config.js          # Tailwind CSS設定
├── tsconfig.json               # TypeScript設定
├── .env.local                  # 環境変数（機密情報）
├── .gitignore                  # Git除外ファイル
│
├── src/                        # ソースコード
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # ルートレイアウト
│   │   ├── page.tsx            # トップページ
│   │   ├── globals.css         # グローバルCSS
│   │   ├── admin/              # 管理者ページ
│   │   │   └── page.tsx
│   │   └── api/                # API エンドポイント
│   │       ├── reservation/
│   │       │   └── route.ts    # 予約API
│   │       ├── admin/
│   │       │   └── live-info/
│   │       │       └── route.ts # 管理API
│   │       └── live-info/
│   │           └── route.ts    # 公開ライブ情報API
│   └── components/             # Reactコンポーネント
│       ├── Hero.tsx            # ヒーローセクション
│       ├── About.tsx           # プロフィールセクション
│       ├── LiveInfo.tsx        # ライブ情報セクション
│       ├── ReservationForm.tsx # 予約フォーム
│       └── Footer.tsx          # フッター
│
├── docs/                       # ドキュメント
│   ├── google-sheets-setup.md  # Google Sheets設定手順
│   ├── deployment-guide.md     # デプロイガイド
│   └── learning/               # 学習用ドキュメント
│       ├── 01-frontend-technologies.md
│       ├── 02-external-apis.md
│       └── 03-project-structure.md
│
└── data/                       # データファイル（実行時生成）
    └── live-info.json          # ライブ情報
```

---

## ディレクトリ構造の詳細

### 📄 設定ファイル

#### `package.json`

```json
{
  "name": "flute-contact",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --turbopack", // 開発サーバー起動
    "build": "next build", // 本番ビルド
    "start": "next start", // 本番サーバー起動
    "lint": "next lint" // コード品質チェック
  },
  "dependencies": {
    "next": "15.5.3", // Next.jsフレームワーク
    "react": "19.0.0", // React本体
    "react-dom": "19.0.0", // React DOM操作
    "typescript": "5.7.2", // TypeScript
    "@hookform/resolvers": "^3.9.1", // フォームバリデーション統合
    "react-hook-form": "^7.54.0", // フォーム管理
    "zod": "^3.24.1", // スキーマバリデーション
    "googleapis": "^144.0.0", // Google APIs
    "resend": "^4.0.1", // メール送信
    "lucide-react": "^0.468.0" // アイコンライブラリ
  }
}
```

#### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境での最適化設定
  experimental: {
    // 最新機能の有効化
  },
  // 画像最適化設定
  images: {
    domains: ["example.com"], // 外部画像のドメイン許可
  },
  // 環境変数の設定
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;
```

#### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // カスタム色の定義
      colors: {
        "brand-amber": "#f59e0b",
      },
      // カスタムフォントの定義
      fontFamily: {
        "noto-sans": ["Noto Sans JP", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

### 🎨 アプリケーション構造

#### `src/app/layout.tsx` - ルートレイアウト

```tsx
import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

// フォントの最適化読み込み
const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["300", "400", "500", "700"],
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["300", "400", "500", "700"],
});

// SEO メタデータ
export const metadata: Metadata = {
  title: "フルートライブ 吉原りえ | チケット予約",
  description:
    "フルートとピアノによる心温まるライブ。クラシックから現代曲まで幅広いレパートリーをお楽しみください。",
  keywords: "フルート,ライブ,コンサート,クラシック,音楽,予約",
};

// 全ページ共通レイアウト
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${notoSans.variable} ${notoSerif.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
```

**解説:**

- **フォント最適化**: Google Fonts を事前読み込みで高速化
- **SEO メタデータ**: 検索エンジン最適化のための情報設定
- **CSS 変数**: Tailwind でフォントファミリーを使用可能に

#### `src/app/page.tsx` - メインページ

```tsx
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { LiveInfo } from "@/components/LiveInfo";
import { ReservationForm } from "@/components/ReservationForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero /> {/* ヒーローセクション */}
      <About /> {/* プロフィールセクション */}
      <LiveInfo /> {/* ライブ情報セクション */}
      <ReservationForm /> {/* 予約フォームセクション */}
      <Footer /> {/* フッターセクション */}
    </main>
  );
}
```

**解説:**

- **コンポーネント分割**: 各セクションを独立したコンポーネントに
- **シンプルな構造**: 読みやすく保守しやすい構成
- **再利用性**: 各コンポーネントは他のページでも使用可能

---

## コンポーネント設計

### 🧩 コンポーネントの種類

#### 1. プレゼンテーションコンポーネント（表示のみ）

**`src/components/Hero.tsx`**

```tsx
export function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6">
          フルートライブ
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">吉原りえ</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          フルートとピアノによる心温まるライブをお楽しみください
        </p>
      </div>
    </section>
  );
}
```

**特徴:**

- **状態なし**: useState や副作用を持たない
- **純粋関数**: 同じ props に対して常に同じ結果
- **再利用可能**: どこでも同じように表示される

#### 2. コンテナコンポーネント（状態管理）

**`src/components/ReservationForm.tsx`**

```tsx
"use client"; // クライアントコンポーネント

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function ReservationForm() {
  // 状態管理
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // フォーム管理
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(reservationSchema),
  });

  // イベントハンドラ
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit(onSubmit)}>{/* フォーム要素 */}</form>;
}
```

**特徴:**

- **状態管理**: useState でローカル状態を管理
- **副作用**: API 呼び出しなどの外部とのやり取り
- **イベント処理**: ユーザーの操作に対する反応

### 🔄 コンポーネント間のデータ流れ

```
parent Component
      ↓ (props)
child Component
      ↓ (callback)
parent Component
```

**例: 料金計算の流れ**

```tsx
// 親コンポーネント（ReservationForm）
const [generalTickets, studentTickets] = watch([
  "generalTickets",
  "studentTickets",
]);
const totalAmount = calculateTotal(generalTickets, studentTickets);

// 子コンポーネント（PriceDisplay）
<PriceDisplay
  generalTickets={generalTickets}
  studentTickets={studentTickets}
  totalAmount={totalAmount}
/>;
```

---

## API 設計

### 🛣️ RESTful API エンドポイント

#### `src/app/api/reservation/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

// POST /api/reservation - 予約作成
export async function POST(request: NextRequest) {
  try {
    // 1. リクエストデータの取得
    const data = await request.json();

    // 2. バリデーション
    const validatedData = reservationSchema.parse(data);

    // 3. 外部サービスとの連携
    const [sheetsResult, emailResult] = await Promise.all([
      saveToGoogleSheets(validatedData),
      sendConfirmationEmail(validatedData),
    ]);

    // 4. レスポンス
    if (sheetsResult && emailResult) {
      return NextResponse.json(
        { message: "予約が完了しました" },
        { status: 200 }
      );
    } else {
      throw new Error("External service error");
    }
  } catch (error) {
    console.error("Reservation error:", error);
    return NextResponse.json(
      { error: "予約処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
```

**API 設計のポイント:**

1. **RESTful**: HTTP メソッドに応じた処理
2. **エラーハンドリング**: 適切な HTTP ステータスコード
3. **非同期処理**: Promise.all で並列実行
4. **バリデーション**: 入力データの検証

#### 管理者 API `src/app/api/admin/live-info/route.ts`

```typescript
// GET /api/admin/live-info - 設定取得
export async function GET() {
  try {
    const liveInfo = await loadLiveInfo();
    return NextResponse.json(liveInfo);
  } catch (error) {
    return NextResponse.json(
      { error: "設定の読み込みに失敗しました" },
      { status: 500 }
    );
  }
}

// POST /api/admin/live-info - 設定更新
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // 認証チェック（簡易版）
    const authHeader = request.headers.get("authorization");
    if (authHeader !== "Bearer admin-token") {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    await saveLiveInfo(data);
    return NextResponse.json({ message: "設定を更新しました" });
  } catch (error) {
    return NextResponse.json(
      { error: "設定の更新に失敗しました" },
      { status: 500 }
    );
  }
}
```

### 🔐 セキュリティ考慮事項

1. **入力検証**: Zod によるスキーマバリデーション
2. **認証**: 管理者 API での簡易認証
3. **CORS 設定**: 必要に応じてオリジン制限
4. **レート制限**: API の過度な呼び出し防止

---

## データフロー

### 📊 予約処理のフロー

```
1. フォーム入力
   ↓
2. クライアントサイドバリデーション (Zod + React Hook Form)
   ↓
3. API送信 (/api/reservation)
   ↓
4. サーバーサイドバリデーション (Zod)
   ↓
5. 並列処理:
   ├── Google Sheets への保存
   └── 確認メール送信 (Resend)
   ↓
6. レスポンス返却
   ↓
7. UI更新（成功・エラー表示）
```

### 🔄 状態管理パターン

#### 1. ローカル状態（useState）

```tsx
// コンポーネント内でのみ使用する状態
const [isLoading, setIsLoading] = useState(false);
const [message, setMessage] = useState("");
```

#### 2. フォーム状態（React Hook Form）

```tsx
// フォーム専用の状態管理
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm();
```

#### 3. 派生状態（useMemo/計算）

```tsx
// 他の状態から計算される値
const totalAmount = useMemo(() => {
  return (generalTickets || 0) * 4000 + (studentTickets || 0) * 3000;
}, [generalTickets, studentTickets]);
```

### 🚀 パフォーマンス最適化

#### 1. コンポーネントの最適化

```tsx
// React.memo でレンダリング最適化
export const PriceDisplay = React.memo(({ totalAmount }) => {
  return <div>合計: ¥{totalAmount.toLocaleString()}</div>;
});

// useCallback でコールバック最適化
const handleSubmit = useCallback(
  (data) => {
    // 処理
  },
  [dependency]
);
```

#### 2. 非同期処理の最適化

```tsx
// Promise.all で並列実行
const [sheetsResult, emailResult] = await Promise.all([
  saveToGoogleSheets(data),
  sendConfirmationEmail(data),
]);

// エラー時の fallback
try {
  await saveToGoogleSheets(data);
} catch (error) {
  // ログ記録後、メール通知で代替
  await sendErrorNotification(data, error);
}
```

---

## 🏗️ 設計思想

### 📐 SOLID 原則の適用

1. **単一責任原則 (SRP)**

   - 各コンポーネントは 1 つの責任のみ
   - Hero, About, LiveInfo などの明確な分離

2. **開放閉鎖原則 (OCP)**

   - 新機能追加時は拡張で対応
   - 既存コードの修正を最小限に

3. **依存性逆転原則 (DIP)**
   - 具体的な実装ではなく抽象に依存
   - API インターフェースの活用

### 🧪 テスタビリティ

```tsx
// テストしやすい純粋関数
export function calculateTotal(
  generalTickets: number,
  studentTickets: number,
  deliveryMethod: string
): number {
  const ticketTotal = generalTickets * 4000 + studentTickets * 3000;
  const deliveryFee = deliveryMethod === "postal" ? 200 : 0;
  return ticketTotal + deliveryFee;
}

// テスト例
describe("calculateTotal", () => {
  test("一般チケット2枚の場合", () => {
    expect(calculateTotal(2, 0, "pickup")).toBe(8000);
  });

  test("学生チケット1枚 + 郵送の場合", () => {
    expect(calculateTotal(0, 1, "postal")).toBe(3200);
  });
});
```

### 🔄 保守性の向上

1. **型安全性**: TypeScript による静的型チェック
2. **一貫性**: ESLint/Prettier による コードフォーマット統一
3. **ドキュメント**: README と詳細ドキュメント
4. **エラーハンドリング**: 予期しない状況への対処

---

## 🎯 まとめ

このプロジェクトの設計は以下の原則に基づいています：

### ✅ 良い設計の特徴

1. **シンプル**: 複雑さを避け、理解しやすい構造
2. **モジュラー**: 各部分が独立し、再利用可能
3. **拡張可能**: 新機能の追加が容易
4. **保守しやすい**: バグ修正や変更が安全
5. **テスタブル**: 自動テストが書きやすい

### 🚀 スケーラビリティ

- **コンポーネント**: 機能ごとに分割し、責任を明確化
- **API**: RESTful 設計で直感的
- **データ管理**: 外部サービスを活用してシンプルに
- **デプロイ**: Vercel で簡単かつ高性能

### 📚 学習価値

このプロジェクトを通じて学べること：

1. **モダン React**: Hooks、TypeScript、パフォーマンス最適化
2. **Next.js**: App Router、API Routes、SSG/SSR
3. **外部 API 統合**: 認証、エラーハンドリング、非同期処理
4. **UI/UX 設計**: レスポンシブデザイン、ユーザビリティ
5. **プロジェクト管理**: 設計、実装、デプロイまでの全工程

この構成を理解することで、同様の Web アプリケーションを自分で設計・実装できるようになります！
