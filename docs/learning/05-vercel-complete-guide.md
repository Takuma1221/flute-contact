# Vercel完全ガイド - 仕組み・使い方・メンテナンス方法

## 📋 目次

1. [Vercelとは？](#vercelとは)
2. [自動デプロイの仕組み](#自動デプロイの仕組み)
3. [初回セットアップ手順](#初回セットアップ手順)
4. [環境変数の管理](#環境変数の管理)
5. [日常のメンテナンス](#日常のメンテナンス)
6. [トラブルシューティング](#トラブルシューティング)
7. [料金体系と制限](#料金体系と制限)
8. [高度な機能](#高度な機能)

## Vercelとは？

### 🚀 概要

**Vercel**は、フロントエンドアプリケーション（特にNext.js）に最適化されたホスティングプラットフォームです。

### 🌟 主な特徴

- **ゼロ設定デプロイ**: 設定ファイル不要でNext.jsアプリをデプロイ
- **グローバルCDN**: 世界中の高速ネットワークで配信
- **自動HTTPS**: SSL証明書の自動発行・更新
- **プレビューデプロイ**: プルリクエストごとに専用URL生成
- **サーバーレス関数**: API Routesの自動スケーリング
- **カスタムドメイン**: 独自ドメインの簡単設定

## 自動デプロイの仕組み

### 🔄 デプロイフロー

```mermaid
graph LR
    A[コード変更] --> B[git push]
    B --> C[GitHub]
    C --> D[Vercel Webhook]
    D --> E[自動ビルド]
    E --> F[デプロイ]
    F --> G[本番環境更新]
```

### 📊 ブランチ別デプロイ戦略

| ブランチ    | デプロイ先       | URL例                                         | 用途             |
| ----------- | ---------------- | --------------------------------------------- | ---------------- |
| `main`      | **本番環境**     | `https://your-app.vercel.app`                 | 一般ユーザー向け |
| `develop`   | **ステージング** | `https://your-app-git-develop.vercel.app`     | 内部テスト用     |
| `feature/*` | **プレビュー**   | `https://your-app-git-feature-xxx.vercel.app` | 機能開発確認     |

### ⚡ 自動デプロイのタイミング

1. **mainブランチへのプッシュ** → 即座に本番環境更新
2. **プルリクエスト作成/更新** → プレビュー環境作成
3. **プルリクエストマージ** → 本番環境自動更新

## 初回セットアップ手順

### 1. 📁 GitHubリポジトリの準備

```bash
# ローカルでの初期化（既に完了済み）
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. 🌐 Vercelアカウント作成

1. [vercel.com](https://vercel.com)にアクセス
2. **「Sign up」** をクリック
3. **GitHub アカウント**でログイン
4. 必要な権限を許可

### 3. 🚀 プロジェクト作成

```bash
# Vercel CLI（オプション）
npm i -g vercel
vercel login
vercel --prod
```

**または Web UI で：**

1. Vercel ダッシュボードで **「New Project」**
2. GitHub リポジトリを選択
3. **「Deploy」** をクリック
4. 自動的にビルド・デプロイ開始

### 4. ⚙️ 初期設定確認

- **Framework Preset**: Next.js（自動検出）
- **Build Command**: `npm run build`（自動設定）
- **Output Directory**: `.next`（自動設定）
- **Node.js Version**: 18.x（推奨）

## 環境変数の管理

### 🔐 セキュリティレベル

| 環境変数の種類         | プレフィックス | 公開範囲       | 用途例                     |
| ---------------------- | -------------- | -------------- | -------------------------- |
| **サーバーサイド**     | なし           | サーバーのみ   | API キー、データベース接続 |
| **クライアントサイド** | `NEXT_PUBLIC_` | ブラウザに公開 | サイトURL、公開設定        |

### 📝 設定方法

#### Web UI での設定

1. プロジェクト → **Settings** → **Environment Variables**
2. **Name** と **Value** を入力
3. **Environment** を選択:
   - `Production`: 本番環境のみ
   - `Preview`: プレビュー環境のみ
   - `Development`: ローカル開発のみ

#### 一括設定（推奨）

```bash
# .env.example ファイルから一括インポート
vercel env pull .env.local  # 環境変数をローカルに同期
vercel env add              # 新しい環境変数を追加
```

### 🛡️ セキュリティベストプラクティス

```bash
# ✅ 良い例：サーバーサイドのみで使用
RESEND_API_KEY=re_xxx...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# ✅ 良い例：クライアントサイドで使用
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ❌ 悪い例：秘密情報をクライアントサイドに公開
NEXT_PUBLIC_API_SECRET=secret_key  # 危険！
```

## 日常のメンテナンス

### 📅 一般的なワークフロー

#### 1. 機能開発

```bash
# 1. 新機能ブランチを作成
git checkout -b feature/new-function

# 2. 開発・テスト
npm run dev

# 3. コミット・プッシュ
git add .
git commit -m "feat: 新機能を追加"
git push origin feature/new-function

# 4. プルリクエスト作成
# → Vercelが自動でプレビュー環境を作成

# 5. レビュー・承認後、mainにマージ
# → 自動的に本番環境に反映
```

#### 2. 緊急修正（ホットフィックス）

```bash
# mainブランチから直接修正
git checkout main
git pull origin main

# 修正
# ...

git add .
git commit -m "hotfix: 緊急修正"
git push origin main
# → 即座に本番環境に反映（通常2-3分）
```

### 🔍 デプロイ状況の確認

#### Vercel ダッシュボード

- **Functions**: サーバーレス関数の実行状況
- **Deployments**: デプロイ履歴とログ
- **Analytics**: アクセス解析（有料プラン）
- **Speed Insights**: パフォーマンス分析

#### CLI での確認

```bash
# デプロイ履歴
vercel list

# ログの確認
vercel logs your-project-url

# 現在のデプロイ情報
vercel inspect your-deployment-url
```

### 📊 パフォーマンス監視

```bash
# Next.js に組み込まれた分析
# next.config.js
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
  // Vercel Analytics（有料）
  analyticsId: process.env.VERCEL_ANALYTICS_ID,
}
```

## トラブルシューティング

### 🚨 よくあるエラーと解決方法

#### 1. ビルドエラー

```bash
# エラー例
Error: Module not found: Can't resolve 'somePackage'

# 解決方法
npm install somePackage
git add package.json package-lock.json
git commit -m "deps: missing package added"
git push origin main
```

#### 2. 環境変数エラー

```bash
# エラー例
ReferenceError: process.env.API_KEY is not defined

# 解決手順
1. Vercel Dashboard → Settings → Environment Variables
2. 必要な環境変数を追加
3. Deployments → "..." → Redeploy
```

#### 3. 関数タイムアウト

```bash
# エラー例
Task timed out after 10 seconds

# 解決方法（vercel.json）
{
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

#### 4. ドメイン関連

```bash
# カスタムドメイン設定
1. Settings → Domains
2. ドメインを追加
3. DNS設定（CNAMEレコード）
   Name: your-subdomain
   Value: cname.vercel-dns.com
```

### 🔧 デバッグ手法

```javascript
// 本番環境でのデバッグ
console.log("Environment:", process.env.NODE_ENV);
console.log("Vercel URL:", process.env.VERCEL_URL);

// 条件付きログ
if (process.env.NODE_ENV === "development") {
  console.log("Debug info:", debugData);
}
```

## 料金体系と制限

### 💰 無料プラン（Hobby）

| 項目                 | 制限       | 説明                       |
| -------------------- | ---------- | -------------------------- |
| **帯域幅**           | 100GB/月   | 転送量の上限               |
| **関数実行時間**     | 10秒       | API Routes のタイムアウト  |
| **関数呼び出し**     | 100万回/月 | サーバーレス関数の実行回数 |
| **ビルド時間**       | 6000分/月  | CI/CD の実行時間           |
| **チームサイズ**     | 1人        | 個人開発のみ               |
| **カスタムドメイン** | ✅ 無制限  | 独自ドメインの設定         |

### 💼 有料プラン（Pro: $20/月）

- **帯域幅**: 1TB/月
- **関数実行時間**: 60秒
- **パスワード保護**: プレビュー環境の保護
- **Analytics**: 詳細なアクセス解析
- **チーム機能**: 複数人での開発

### 🏢 エンタープライズ

- **カスタム制限**: 要相談
- **SLA保証**: 99.99%稼働保証
- **専任サポート**: 24/7サポート

## 高度な機能

### 🔀 A/Bテスト（Edge Config）

```javascript
// middleware.js
import { geolocation } from "@vercel/edge";

export function middleware(request) {
  const { country } = geolocation(request);

  if (country === "JP") {
    return NextResponse.rewrite("/jp/home");
  }

  return NextResponse.next();
}
```

### 📈 パフォーマンス最適化

```javascript
// next.config.js
module.exports = {
  // 画像最適化
  images: {
    domains: ["example.com"],
    formats: ["image/webp", "image/avif"],
  },

  // 静的生成の最適化
  trailingSlash: false,
  poweredByHeader: false,

  // バンドル分析
  analyzeBundle: process.env.ANALYZE === "true",
};
```

### 🌍 国際化（i18n）

```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ["ja", "en"],
    defaultLocale: "ja",
    domains: [
      {
        domain: "example.com",
        defaultLocale: "ja",
      },
      {
        domain: "example.com/en",
        defaultLocale: "en",
      },
    ],
  },
};
```

### 🛡️ セキュリティヘッダー

```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin",
        },
      ],
    },
  ],
};
```

## 📋 チェックリスト

### 🚀 デプロイ前

- [ ] ローカルでのビルドテスト（`npm run build`）
- [ ] 環境変数の確認
- [ ] セキュリティの検証
- [ ] パフォーマンステスト

### 🔍 デプロイ後

- [ ] 本番環境での動作確認
- [ ] フォーム送信テスト
- [ ] API エンドポイントの動作確認
- [ ] レスポンス時間の確認
- [ ] エラーログの確認

---

## 💡 まとめ

Vercelは**開発体験を重視した現代的なホスティングプラットフォーム**です：

### ✅ メリット

- **自動デプロイ**: コードをプッシュするだけで本番反映
- **プレビュー機能**: 安全な機能開発・レビュー
- **スケーラビリティ**: 自動スケーリングで高負荷対応
- **開発者体験**: シンプルで直感的な操作
- **パフォーマンス**: グローバルCDNで高速配信

### ⚠️ 注意点

- **ベンダーロックイン**: Vercel依存のアーキテクチャ
- **コスト**: トラフィック増加時の料金上昇
- **制限**: 無料プランの機能・容量制限

### 🎯 適用場面

- **個人プロジェクト**: 無料で本格運用
- **スタートアップ**: 迅速なMVP開発
- **企業サイト**: スケーラブルな本番運用
- **ポートフォリオ**: 開発者の技術アピール

**Vercelを使うことで、インフラ管理に時間を取られることなく、アプリケーション開発に集中できます！** 🚀
