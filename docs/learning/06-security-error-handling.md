# 6. セキュリティとエラーハンドリング

このドキュメントでは、フルート演奏会予約システムで実装したセキュリティ対策とエラーハンドリングについて解説します。

## 📋 目次

1. [セキュリティ対策](#セキュリティ対策)
2. [エラーハンドリング](#エラーハンドリング)
3. [バリデーション](#バリデーション)
4. [環境変数の管理](#環境変数の管理)
5. [実装例と学習ポイント](#実装例と学習ポイント)

## セキュリティ対策

### 🔐 環境変数による機密情報の保護

```typescript
// ❌ 悪い例：ハードコーディング
const apiKey = "re_PkGDoT2p_4LFJVMw1hh1RaRKy5SDGnFRs"; // 危険！

// ✅ 良い例：環境変数の使用
const apiKey = process.env.RESEND_API_KEY;
```

### 🛡️ 管理画面の認証

```typescript
// admin/page.tsx
const [isAuthenticated, setIsAuthenticated] = useState(false);

const handleLogin = (password: string) => {
  if (password === process.env.ADMIN_PASSWORD) {
    setIsAuthenticated(true);
  } else {
    setMessage("パスワードが正しくありません");
  }
};
```

**学習ポイント:**

- シンプルなパスワード認証の実装
- セッション管理はなし（簡易実装）
- 本格的なアプリでは JWT や NextAuth.js を推奨

### 🔍 入力値のサニタイゼーション

```typescript
// React Hook Form + Zod による自動サニタイゼーション
const reservationSchema = z.object({
  name: z.string().min(1, "お名前を入力してください").max(50),
  email: z.string().email("正しいメールアドレスを入力してください"),
  phone: z
    .string()
    .regex(/^[\d\-\+\(\)\s]+$/, "正しい電話番号を入力してください"),
});
```

**学習ポイント:**

- Zodによる型安全なバリデーション
- フロントエンドでの事前チェック
- サーバーサイドでの再バリデーション

## エラーハンドリング

### 🚨 API エラーハンドリングパターン

```typescript
// API Route でのエラーハンドリング
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // データ検証
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // 外部API呼び出し
    const result = await saveToGoogleSheets(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
```

### 🔧 フロントエンドでのエラーハンドリング

```typescript
// フォーム送信時のエラーハンドリング
const onSubmit = async (data: ReservationData) => {
  setIsSubmitting(true);
  setMessage("");

  try {
    const response = await fetch("/api/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "送信に失敗しました");
    }

    setMessage("予約を受け付けました！");
    reset(); // フォームリセット
  } catch (error) {
    setMessage(error instanceof Error ? error.message : "エラーが発生しました");
  } finally {
    setIsSubmitting(false);
  }
};
```

### 🌐 外部API接続エラーの対処

```typescript
// Google Sheets API エラーハンドリング
async function saveToGoogleSheets(data: ReservationData) {
  try {
    const sheets = await getGoogleSheetsClient();
    // ... API呼び出し
    return true;
  } catch (error) {
    console.error("Google Sheets Error:", error);

    if (error.code === 403) {
      console.error("権限エラー: サービスアカウントの設定を確認してください");
    } else if (error.code === 404) {
      console.error("スプレッドシートが見つかりません");
    }

    return false;
  }
}

// Resend API エラーハンドリング
async function sendConfirmationEmail(data: ReservationData) {
  try {
    if (!resend) {
      console.warn("Resend API key not configured");
      return false;
    }

    await resend.emails.send({
      from: "noreply@yourdomain.com",
      to: data.email,
      subject: "予約確認メール",
      text: emailContent,
    });

    return true;
  } catch (error) {
    console.error("Email Error:", error);
    return false;
  }
}
```

## バリデーション

### 📝 多層バリデーション戦略

#### 1. フロントエンド（クライアントサイド）

```typescript
// React Hook Form + Zod
const reservationForm = useForm<ReservationData>({
  resolver: zodResolver(reservationSchema),
  defaultValues: {
    generalTickets: 0,
    studentTickets: 0,
    // ...
  },
});

// リアルタイムバリデーション
const generalTickets = reservationForm.watch("generalTickets");
const studentTickets = reservationForm.watch("studentTickets");
const totalTickets = generalTickets + studentTickets;

// 条件付きバリデーション
useEffect(() => {
  if (totalTickets === 0) {
    reservationForm.setError("generalTickets", {
      message: "最低1枚のチケットを選択してください",
    });
  } else {
    reservationForm.clearErrors("generalTickets");
  }
}, [totalTickets]);
```

#### 2. サーバーサイド（API Route）

```typescript
// サーバーサイドでの再バリデーション
export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json();

    // 基本項目のチェック
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "正しいメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // チケット数のチェック
    if (data.generalTickets + data.studentTickets === 0) {
      return NextResponse.json(
        { error: "最低1枚のチケットを選択してください" },
        { status: 400 }
      );
    }

    // ... 処理続行
  } catch (error) {
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  }
}
```

### 🎯 カスタムバリデーション

```typescript
// 電話番号の日本語対応バリデーション
const phoneSchema = z
  .string()
  .regex(/^[\d\-\+\(\)\s]+$/, "数字、ハイフン、括弧のみ使用できます")
  .refine(
    (val) => val.replace(/[\-\+\(\)\s]/g, "").length >= 10,
    "電話番号は10桁以上で入力してください"
  );

// 日付の妥当性チェック
const dateSchema = z
  .string()
  .refine((val) => new Date(val) > new Date(), "過去の日付は選択できません");
```

## 環境変数の管理

### 🔐 環境別設定

```bash
# .env.local（開発環境）
RESEND_API_KEY=re_dev_xxx...
GOOGLE_SPREADSHEET_ID=dev_sheet_id
ADMIN_PASSWORD=dev_password

# Vercel（本番環境）
RESEND_API_KEY=re_prod_xxx...
GOOGLE_SPREADSHEET_ID=prod_sheet_id
ADMIN_PASSWORD=secure_prod_password
```

### ⚡ 環境変数の動的チェック

```typescript
// 環境変数の存在チェック
function validateEnvironment() {
  const required = [
    "RESEND_API_KEY",
    "GOOGLE_CLIENT_EMAIL",
    "GOOGLE_PRIVATE_KEY",
    "GOOGLE_SPREADSHEET_ID",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(", ")}`);
    return false;
  }

  return true;
}

// アプリケーション起動時のチェック
if (process.env.NODE_ENV === "production") {
  validateEnvironment();
}
```

### 🌍 型安全な環境変数

```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      RESEND_API_KEY?: string;
      GOOGLE_CLIENT_EMAIL?: string;
      GOOGLE_PRIVATE_KEY?: string;
      GOOGLE_SPREADSHEET_ID?: string;
      ADMIN_PASSWORD?: string;
      NEXT_PUBLIC_SITE_URL?: string;
    }
  }
}

export {};
```

## 実装例と学習ポイント

### 🔄 Graceful Degradation（段階的劣化）

```typescript
// 一部機能が失敗しても全体は動作を継続
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Google Sheetsへの保存を試行
    const sheetsSaved = await saveToGoogleSheets(data);
    if (!sheetsSaved) {
      console.error("Failed to save to Google Sheets");
      // エラーだが処理は継続
    }

    // メール送信を試行
    const emailSent = await sendConfirmationEmail(data);
    if (!emailSent) {
      console.error("Failed to send confirmation email");
      // エラーだが処理は継続
    }

    // 少なくとも一方が成功していれば成功とみなす
    return NextResponse.json({
      success: true,
      message: "ご予約を承りました",
      details: {
        sheetsSaved,
        emailSent,
      },
    });
  } catch (error) {
    // 致命的エラーのみここで処理
    return NextResponse.json(
      { error: "システムエラーが発生しました" },
      { status: 500 }
    );
  }
}
```

### 🎯 ユーザーフレンドリーなエラーメッセージ

```typescript
// エラーメッセージの国際化対応
const ERROR_MESSAGES = {
  VALIDATION_ERROR: "入力内容を確認してください",
  NETWORK_ERROR: "通信エラーが発生しました。しばらく後にお試しください",
  SERVER_ERROR: "システムエラーが発生しました。管理者にお問い合わせください",
  TIMEOUT_ERROR: "処理がタイムアウトしました",
} as const;

// エラータイプの判定
function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  } else if (error instanceof NetworkError) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  } else {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
}
```

### 🐛 デバッグとログ出力

```typescript
// 開発環境での詳細ログ
function debugLog(message: string, data?: any) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[DEBUG] ${message}`, data);
  }
}

// 本番環境でのエラートラッキング
function trackError(error: Error, context?: Record<string, any>) {
  console.error("Error tracked:", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // 本番環境では外部サービス（Sentry等）に送信
  if (process.env.NODE_ENV === "production") {
    // Sentry.captureException(error, { extra: context });
  }
}
```

---

## 💡 まとめ

### ✅ セキュリティのベストプラクティス

1. **機密情報の保護**: 環境変数による管理
2. **入力値検証**: 多層バリデーション
3. **エラー情報の制限**: ユーザーに詳細なエラーを見せない
4. **アクセス制御**: 管理画面の認証

### ⚡ エラーハンドリングの原則

1. **予期しないエラーへの対応**: try-catch の適切な使用
2. **ユーザビリティ**: わかりやすいエラーメッセージ
3. **サービス継続性**: 一部機能の失敗で全体を止めない
4. **ログ記録**: デバッグ可能な情報の保存

### 🎯 学習の応用先

- **認証システム**: JWT、OAuth、NextAuth.js
- **データベース**: Prisma、Drizzle での型安全なクエリ
- **監視システム**: Sentry、LogRocket でのエラートラッキング
- **テスト**: Jest、Playwright での自動テスト

この基礎を理解することで、より堅牢で安全なWebアプリケーションを構築できるようになります！
