# 外部 API・サービス解説

このプロジェクトで使用している外部 API とクラウドサービスについて、初学者向けに解説します。

## 📚 目次

1. [Google Sheets API](#google-sheets-api)
2. [Resend API](#resend-api)
3. [Vercel](#vercel)
4. [料金体系と無料枠](#料金体系と無料枠)

---

## Google Sheets API

### 🤔 Google Sheets API とは？

Google Sheets API は、Google スプレッドシートを**プログラムから操作**できる API です。

### 🎯 なぜ Google Sheets API を使うのか？

1. **簡単なデータベース代替**

   - SQL の知識不要
   - 視覚的にデータを確認可能
   - 非技術者でもデータを編集可能

2. **無料で高機能**

   - 月間 100 万リクエストまで無料
   - リアルタイムでのデータ共有
   - 豊富な関数とフィルタリング機能

3. **セットアップが簡単**
   - データベースサーバーの準備不要
   - バックアップは自動
   - 権限管理も簡単

### 🔧 実装方法

#### 1. Google Cloud Project のセットアップ

```bash
# 必要な手順:
1. Google Cloud Console でプロジェクト作成
2. Google Sheets API を有効化
3. サービスアカウント作成
4. 認証情報（JSON）をダウンロード
5. スプレッドシートをサービスアカウントと共有
```

#### 2. 認証設定

```typescript
// src/app/api/reservation/route.ts
import { google } from "googleapis";

// Google Sheets認証
async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}
```

#### 3. データの書き込み

```typescript
// Google Sheetsにデータ保存
async function saveToGoogleSheets(data: ReservationData) {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const values = [
      [
        new Date().toISOString(), // 申込日時
        data.name, // お名前
        data.nameKana, // ふりがな
        data.email, // メールアドレス
        data.phone, // 電話番号
        data.liveDate, // ライブ日程
        `一般 ${data.generalTickets}枚, 学生 ${data.studentTickets}枚`,
        deliveryMethodName, // 受取方法
        total, // 合計金額
        paymentMethodName, // 支払い方法
        data.requests || "", // ご要望・ご質問
        data.howDidYouKnow, // 申込経路
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L", // A列からL列まで
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return true;
  } catch (error) {
    console.error("Error saving to Google Sheets:", error);
    return false;
  }
}
```

#### 4. データの読み取り

```typescript
// データの読み取り例
async function readFromGoogleSheets() {
  try {
    const sheets = await getGoogleSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A2:L", // ヘッダー行を除く
    });

    const rows = response.data.values || [];

    return rows.map((row) => ({
      申込日時: row[0],
      お名前: row[1],
      ふりがな: row[2],
      メールアドレス: row[3],
      // ... 他のフィールド
    }));
  } catch (error) {
    console.error("Error reading from Google Sheets:", error);
    return [];
  }
}
```

### 💡 活用のコツ

1. **列の構造を設計**

   ```
   A列: 申込日時（自動）
   B列: お名前
   C列: ふりがな
   D列: メールアドレス
   E列: 電話番号
   F列: ライブ日程
   G列: チケット詳細
   H列: 受取方法
   I列: 合計金額
   J列: 支払い方法
   K列: ご要望・ご質問
   L列: 申込経路
   ```

2. **データの検証と整形**

   ```typescript
   // 空の値や不正な値のチェック
   const sanitizeData = (data: any) => {
     return {
       name: data.name || "未入力",
       email: data.email || "未入力",
       phone: data.phone?.replace(/[^\d-]/g, "") || "未入力",
       // ...
     };
   };
   ```

3. **エラーハンドリング**
   ```typescript
   try {
     await saveToGoogleSheets(data);
   } catch (error) {
     // ログに記録
     console.error("Google Sheets save failed:", error);

     // 代替手段（メール通知など）
     await sendErrorNotification(data, error);

     // ユーザーにはシンプルなメッセージ
     throw new Error("予約の保存に失敗しました。しばらく後にお試しください。");
   }
   ```

### 📊 スプレッドシートでの活用

1. **データ分析**

   ```
   =COUNTIF(F:F,"2025-10-04-14:00")  # 14時公演の申込数
   =SUMIF(J:J,"bank",I:I)           # 銀行振込の合計金額
   =AVERAGE(I:I)                    # 平均購入金額
   ```

2. **条件付き書式**
   - 支払い方法別に行の色を変更
   - 申込日が古いものを強調
   - 高額な申込を目立たせる

---

## Resend API

### 🤔 Resend API とは？

Resend API は、**開発者向けのメール送信サービス**です。

### 🎯 なぜ Resend API を選んだのか？

1. **開発者フレンドリー**

   - モダンな API 設計
   - 優れたドキュメント
   - TypeScript 完全対応

2. **高い到達率**

   - 専用 IP プール
   - 送信者認証（SPF、DKIM）
   - レピュテーション管理

3. **豊富な機能**
   - HTML メール対応
   - テンプレートエンジン
   - 送信ログ・分析

### 🔧 実装方法

#### 1. セットアップ

```bash
# パッケージのインストール
npm install resend

# 環境変数の設定
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
```

#### 2. 基本的な送信

```typescript
// src/app/api/reservation/route.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 確認メール送信
async function sendConfirmationEmail(data: ReservationData) {
  try {
    const total = calculateTotal(
      data.generalTickets,
      data.studentTickets,
      data.deliveryMethod
    );

    const emailContent = `${data.name}様

この度は、フルートライブにお申し込みいただき、ありがとうございます。
以下の内容でご予約を承りました。

■ご予約内容
・お名前: ${data.name}
・ライブ日程: ${data.liveDate}
・チケット詳細: 一般 ${data.generalTickets}枚、学生 ${data.studentTickets}枚
・受取方法: ${deliveryMethodName}
・合計金額: ¥${total.toLocaleString()}
・支払い方法: ${paymentMethodName}

${paymentInstructions}

■お問い合わせ
吉原りえ
メール: contact@lietoposto.com

素敵な音楽の時間をお楽しみに！
心よりお待ちしております。`;

    await resend.emails.send({
      from: "noreply@yourdomain.com", // 送信者（検証済みドメイン）
      to: data.email, // 宛先
      subject:
        "【フルートライブ】チケットご予約ありがとうございます - 吉原りえ",
      text: emailContent, // テキスト版
      // html: htmlContent,           // HTML版（オプション）
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
```

#### 3. HTML メールの送信

```typescript
// HTMLテンプレートを使った送信
const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>予約確認</title>
    <style>
        body { font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif; }
        .header { background-color: #f59e0b; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background-color: #f3f4f6; padding: 15px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>フルートライブ 予約確認</h1>
    </div>
    <div class="content">
        <p>${data.name}様</p>
        <p>この度は、フルートライブにお申し込みいただき、ありがとうございます。</p>
        
        <h2>ご予約内容</h2>
        <table>
            <tr><td>お名前:</td><td>${data.name}</td></tr>
            <tr><td>ライブ日程:</td><td>${data.liveDate}</td></tr>
            <tr><td>チケット:</td><td>一般 ${data.generalTickets}枚、学生 ${
  data.studentTickets
}枚</td></tr>
            <tr><td>合計金額:</td><td>¥${total.toLocaleString()}</td></tr>
        </table>
    </div>
    <div class="footer">
        <p>吉原りえ｜メール: contact@lietoposto.com</p>
    </div>
</body>
</html>
`;

await resend.emails.send({
  from: "noreply@yourdomain.com",
  to: data.email,
  subject: "【フルートライブ】チケットご予約ありがとうございます",
  html: htmlTemplate,
});
```

#### 4. 複数宛先・CC・BCC

```typescript
// 複数の宛先に送信
await resend.emails.send({
  from: "noreply@yourdomain.com",
  to: [data.email, "admin@yoursite.com"], // 複数宛先
  cc: ["manager@yoursite.com"], // CC
  bcc: ["backup@yoursite.com"], // BCC
  subject: "予約通知",
  text: emailContent,
});
```

### 💡 活用のコツ

1. **送信者認証の設定**

   ```bash
   # ドメイン認証（SPF、DKIM、DMARC）
   # Resendダッシュボードでドメインを追加・認証
   # DNSレコードを設定して送信者認証を完了
   ```

2. **エラーハンドリング**

   ```typescript
   try {
     const { data, error } = await resend.emails.send({
       from: "noreply@yourdomain.com",
       to: email,
       subject: "件名",
       text: "本文",
     });

     if (error) {
       console.error("Resend Error:", error);
       return false;
     }

     console.log("Email sent successfully:", data.id);
     return true;
   } catch (error) {
     console.error("Unexpected error:", error);
     return false;
   }
   ```

3. **テンプレート管理**

   ```typescript
   // テンプレート関数
   const createConfirmationEmail = (data: ReservationData) => {
     return {
       subject: `【フルートライブ】チケットご予約ありがとうございます - ${data.name}様`,
       text: generateTextContent(data),
       html: generateHtmlContent(data),
     };
   };

   // 送信
   const emailTemplate = createConfirmationEmail(reservationData);
   await resend.emails.send({
     from: "noreply@yourdomain.com",
     to: reservationData.email,
     ...emailTemplate,
   });
   ```

---

## Vercel

### 🤔 Vercel とは？

Vercel は、**フロントエンド特化型のクラウドプラットフォーム**です。

### 🎯 なぜ Vercel を選んだのか？

1. **Next.js 最適化**

   - Next.js の開発元が提供
   - ゼロコンフィグでデプロイ
   - 自動最適化とパフォーマンス

2. **簡単デプロイ**

   - GitHub との統合
   - プッシュするだけで自動デプロイ
   - プレビューデプロイ機能

3. **高速 CDN**
   - グローバルエッジネットワーク
   - 自動画像最適化
   - 高速なページ読み込み

### 🔧 デプロイ方法

#### 1. GitHub との連携

```bash
# 1. コードをGitHubにプッシュ
git add .
git commit -m "Initial commit"
git push origin main

# 2. Vercel CLI のインストール（オプション）
npm install -g vercel

# 3. Vercelでプロジェクトをインポート
# https://vercel.com/ でGitHubリポジトリを選択
```

#### 2. 環境変数の設定

```bash
# Vercelダッシュボードの Settings > Environment Variables で設定

# 本番環境
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id
RESEND_API_KEY=re_your_api_key

# プレビュー環境（同じ値または別の値）
# Development環境（ローカル開発用）
```

#### 3. カスタムドメインの設定

```bash
# 1. Vercelダッシュボードで Domains タブを選択
# 2. カスタムドメインを追加
# 3. DNSレコードを設定
# 例: your-domain.com -> Vercelのサーバー

# DNSレコード例:
# A record: @ -> 76.76.19.61
# CNAME: www -> your-project.vercel.app
```

### 🚀 高度な機能

#### 1. プレビューデプロイ

```bash
# プルリクエストを作成すると自動でプレビューURL生成
# 例: https://your-project-git-feature-branch-username.vercel.app

# 本番に影響を与えずにテスト可能
```

#### 2. エッジ関数（Serverless Functions）

```typescript
// api/edge-example.ts
export const runtime = "edge";

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ message: "Hello from Edge!" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
```

#### 3. 分析とモニタリング

```typescript
// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics /> {/* アクセス解析 */}
      </body>
    </html>
  );
}
```

### 💡 最適化のコツ

1. **画像最適化**

   ```tsx
   import Image from "next/image";

   // 自動最適化される
   <Image
     src="/profile.jpg"
     alt="プロフィール"
     width={300}
     height={400}
     priority // LCP改善
   />;
   ```

2. **キャッシュ戦略**

   ```typescript
   // Static Generation（推奨）
   export default function StaticPage({ data }) {
     return <div>{data}</div>;
   }

   export async function getStaticProps() {
     return {
       props: { data: "静的データ" },
       revalidate: 3600, // 1時間ごとに再生成
     };
   }
   ```

---

## 料金体系と無料枠

### 💰 各サービスの料金

#### Google Sheets API

```
✅ 無料枠: 月間100万リクエスト
- 読み取り: 100リクエスト/100秒/ユーザー
- 書き込み: 100リクエスト/100秒/ユーザー

💡 このプロジェクトでの使用量目安:
- 1予約 = 1書き込みリクエスト
- 月間10,000予約でも余裕で無料枠内
```

#### Resend API

```
✅ 無料枠: 月間3,000通
- 送信レート: 10通/秒
- 添付ファイル: 25MB/通

📈 有料プラン:
- $20/月: 50,000通
- $65/月: 100,000通

💡 このプロジェクトでの使用量目安:
- 1予約 = 1通（予約確認メール）
- 月間3,000予約まで無料
```

#### Vercel

```
✅ 無料枠（Hobbyプラン）:
- 帯域幅: 100GB/月
- サーバーレス関数実行時間: 100GB-hours/月
- ビルド時間: 6,000分/月

📈 有料プラン（Proプラン: $20/月）:
- 帯域幅: 1TB/月
- より高性能な関数実行
- カスタムドメイン無制限

💡 このプロジェクトでの使用量目安:
- 月間数千アクセスなら無料枠で十分
- 画像が多い場合は帯域幅に注意
```

### 📊 コスト最適化のコツ

1. **Google Sheets API**

   ```typescript
   // バッチ処理で効率化
   const batchData = [["予約1のデータ"], ["予約2のデータ"], ["予約3のデータ"]];

   // 1回のリクエストで複数行を追加
   await sheets.spreadsheets.values.append({
     spreadsheetId,
     range: "Sheet1!A:L",
     valueInputOption: "USER_ENTERED",
     requestBody: { values: batchData },
   });
   ```

2. **Resend API**

   ```typescript
   // 必要な場合のみメール送信
   if (shouldSendEmail(reservationData)) {
     await sendConfirmationEmail(reservationData);
   }

   // テスト環境では送信をスキップ
   if (process.env.NODE_ENV === "development") {
     console.log("Development: Email not sent");
     return true;
   }
   ```

3. **Vercel**

   ```typescript
   // 静的生成を活用してサーバー負荷を軽減
   export async function getStaticProps() {
     return {
       props: {
         /* データ */
       },
       revalidate: 86400, // 24時間キャッシュ
     };
   }

   // 画像最適化
   import Image from "next/image";
   // WebP形式に自動変換、適切なサイズで配信
   ```

### 🚨 料金監視

1. **アラート設定**

   ```bash
   # Google Cloud Console
   - 予算アラートを設定
   - API使用量の監視

   # Resend Dashboard
   - 送信数の監視
   - 月末近くでの使用量チェック

   # Vercel Dashboard
   - 使用量ダッシュボードで定期確認
   ```

2. **使用量の最適化**

   ```typescript
   // ログで使用量を追跡
   console.log(`Google Sheets API called: ${new Date()}`);
   console.log(`Email sent to: ${email}`);

   // 使用量制限の実装
   const dailyLimit = 100;
   if (todaysSentCount >= dailyLimit) {
     throw new Error("Daily email limit reached");
   }
   ```

---

## 🎯 まとめ

外部 API とクラウドサービスの活用により、以下を実現：

- **Google Sheets API**: 簡単なデータ管理（月間 100 万リクエスト無料）
- **Resend API**: 信頼性の高いメール送信（月間 3,000 通無料）
- **Vercel**: 高速で簡単なデプロイ（個人利用無料）

### 💡 運用のベストプラクティス

1. **無料枠の活用**: 小〜中規模なら完全無料で運用可能
2. **監視とアラート**: 使用量を定期的にチェック
3. **エラーハンドリング**: API 障害時の代替手段を準備
4. **セキュリティ**: 認証情報の適切な管理

これらのサービスを組み合わせることで、スケーラブルで信頼性の高い Web アプリケーションを低コストで構築・運用できます。
