# 初回セットアップガイド（初学者向け）

このガイドでは、プログラミング初学者の方でもフルートライブ予約システムを理解・運用できるよう、詳しく解説します。

## 🎯 このシステムで学べること

### 基本概念

- **Webアプリケーション**の構成と動作原理
- **フロントエンド**と**バックエンド**の違い
- **API**を使った外部サービス連携
- **レスポンシブデザイン**（PC・タブレット・スマホ対応）

### 実践的なスキル

- **React/Next.js**を使ったモダンWeb開発
- **TypeScript**による型安全なプログラミング
- **フォーム処理**とバリデーション
- **データベース操作**（Google Sheets活用）
- **メール送信機能**の実装

## 🏃‍♂️ クイックスタート（5分で動作確認）

### 必要なもの

- Node.js（バージョン18以上）
- Gitアカウント
- Googleアカウント

### ステップ1: プロジェクト取得

```bash
# プロジェクトをダウンロード
git clone https://github.com/Takuma1221/flute-contact.git
cd flute-contact

# 依存関係をインストール
npm install
```

### ステップ2: 開発サーバー起動

```bash
# 開発モードで起動
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、サイトが表示されます！

## 📚 段階別学習ロードマップ

### 【レベル1】基本理解（1-2週間）

1. **サイトを触ってみる**
   - 予約フォームを試す
   - 管理画面（`/admin`）を確認
   - レスポンシブデザインをチェック

2. **基本概念を学ぶ**
   - [フロントエンド技術解説](./learning/01-frontend-technologies.md)
   - [プロジェクト構成](./learning/03-project-structure.md)

### 【レベル2】外部サービス連携（2-3週間）

1. **API連携を理解**
   - [外部API・サービス解説](./learning/02-external-apis.md)
   - Google Sheets、メール送信の仕組み

2. **実際に設定してみる**
   - [Google Sheets設定](./google-sheets-setup.md)
   - [画像管理システム](./learning/04-image-management-system.md)

### 【レベル3】運用・拡張（3-4週間）

1. **デプロイと運用**
   - [Vercel完全ガイド](./learning/05-vercel-complete-guide.md)
   - [セキュリティ対策](./learning/06-security-error-handling.md)

2. **カスタマイズに挑戦**
   - デザイン変更
   - 機能追加
   - パフォーマンス最適化

## 🛠 トラブルシューティング（初学者向け）

### よくあるエラー

#### 1. `npm install` でエラーが出る

```bash
# Nodeのバージョン確認
node --version

# 18以上でない場合は更新
# https://nodejs.org/ からダウンロード
```

#### 2. 環境変数が設定できない

- Windows: `.env.local`ファイルをメモ帳で作成
- Mac: ターミナルで `touch .env.local` コマンド実行

#### 3. Google Sheets接続エラー

1. サービスアカウントが正しく作成されているか確認
2. スプレッドシートの共有設定を確認
3. 環境変数のコピペミスがないかチェック

#### 4. メール送信できない

1. Resendアカウントの作成確認
2. APIキーの有効性確認
3. 送信者メールアドレスの検証完了確認

## 💡 学習のコツ

### 🎯 効果的な学習方法

1. **実際に動かしながら学ぶ**
   - コードを変更して結果を確認
   - エラーを恐れず試行錯誤

2. **公式ドキュメントを活用**
   - Next.js: https://nextjs.org/docs
   - React: https://react.dev/
   - TypeScript: https://www.typescriptlang.org/docs/

3. **コミュニティを活用**
   - Stack Overflow
   - GitHub Discussions
   - Discord コミュニティ

### 📝 記録を残す

- 学習ログを書く
- 躓いた点とその解決方法をメモ
- 改善アイデアをリストアップ

## 🚀 次のステップ

### カスタマイズアイデア

1. **デザイン変更**
   - 色合いの変更
   - レイアウトの調整
   - アニメーション追加

2. **機能拡張**
   - 複数公演対応
   - 座席指定機能
   - 決済システム連携

3. **技術スタック変更**
   - データベースをSupabaseに変更
   - 認証システム追加
   - PWA化

### 類似プロジェクト案

- 美容院予約システム
- レストラン予約システム
- イベント管理システム
- ブログサイト
- ECサイト

## 🤝 サポート

### 質問がある場合

1. エラーメッセージを正確にコピー
2. 実行した手順を整理
3. 環境情報（OS、Nodeバージョン等）を確認

### 参考リソース

- [Next.js Learn](https://nextjs.org/learn) - 公式チュートリアル
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React Hook Form Get Started](https://react-hook-form.com/get-started)

---

**このシステムを通じて、モダンなWeb開発の基礎から実践まで幅広く学べます。自分のペースで楽しく学習を進めてください！** 🎉
