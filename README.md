# フルート演奏会予約システム

フルーティスト吉原りえ氏の演奏会予約 LP（ランディングページ）とフォーム管理システムです。

## 🎵 特徴

- 美しいレスポンシブデザイン
- リアルタイムフォームバリデーション
- Google Sheets 自動データ保存
- 予約者への自動メール送信
- 完全無料でデプロイ可能

## 🛠 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **スタイリング**: Tailwind CSS
- **フォーム**: React Hook Form + Zod
- **データベース**: Google Sheets API
- **メール送信**: Resend
- **デプロイ**: Vercel
- **言語**: TypeScript

## 🎓 初学者の方へ

**プログラミング初学者でも安心！** このプロジェクトは学習用として最適化されています。

### クイックスタート（5分で動作確認）

```bash
git clone https://github.com/Takuma1221/flute-contact.git
cd flute-contact
npm install
npm run dev
```

📖 **詳しい学習ガイド**: [初回セットアップガイド](./docs/learning/00-getting-started.md)

### 学べる技術

- ✅ **React/Next.js** - モダンフロントエンド開発
- ✅ **TypeScript** - 型安全なプログラミング
- ✅ **API連携** - Google Sheets、メール送信
- ✅ **レスポンシブデザイン** - 全デバイス対応
- ✅ **デプロイ** - Vercelを使った本番公開

## 🚀 セットアップ

### 1. プロジェクトのクローン

```bash
git clone https://github.com/Takuma1221/flute-contact.git
cd flute-contact
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成：

```env
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
RESEND_API_KEY=your_resend_api_key_here
ADMIN_PASSWORD=your_secure_admin_password
```

### 3. Google Sheets API の設定

詳細は[Google Sheets 設定手順](./docs/google-sheets-setup.md)を参照してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションが確認できます。

## 📁 プロジェクト構造

```
flute-contact/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/reservation/    # 予約API
│   │   ├── globals.css         # グローバルスタイル
│   │   └── page.tsx           # メインページ
│   ├── components/            # Reactコンポーネント
│   │   ├── Hero.tsx          # ヒーローセクション
│   │   ├── About.tsx         # プロフィール
│   │   ├── LiveInfo.tsx      # 演奏会情報
│   │   ├── ReservationForm.tsx # 予約フォーム
│   │   └── Footer.tsx        # フッター
│   └── types/                # TypeScript型定義
├── docs/                     # ドキュメント
│   ├── premise.prompt.md     # プロジェクト要件
│   ├── google-form-analysis.md # フォーム分析
│   ├── design-analysis.md    # デザイン分析
│   ├── google-sheets-setup.md # Google Sheets設定
│   └── deployment-guide.md   # デプロイ手順
└── public/                   # 静的ファイル
```

## 🎯 主要機能

### 1. 演奏会情報表示

- 開催日時、会場情報
- チケット料金表示
- プログラム内容
- パンフレット画像（クリック拡大対応）

### 2. 予約フォーム

- リアルタイムバリデーション
- 複数の支払い方法対応
- チケット枚数選択

### 3. データ管理

- Google Sheets への自動保存
- 予約情報の一元管理

### 4. 自動メール送信

- 予約完了通知
- 支払い方法別案内
- カスタマイズ可能なテンプレート

### 5. 管理機能 NEW! 🆕

- **管理画面**: `/admin` でアクセス
- **演奏会情報管理**: 日程・料金・会場を動的編集
- **キャンセルポリシー管理**: 期限と内容を自由設定
- **画像アップロード**: パンフレット画像をリアルタイム更新
- **ステータス監視**: システム動作状況の確認

## 💰 料金

このシステムは完全無料で運用できます：

- **Next.js/Vercel**: 無料プラン
- **Google Sheets API**: 月間 100 万リクエスト無料
- **Resend**: 月間 3,000 通のメール送信無料（オプション）
- **Nodemailer**: Gmail SMTPを使用したメール送信（推奨）

## 📊 スプレッドシートのデータ構成

予約データは自動的に以下の形式でGoogle Sheetsに保存されます。

### シート1: 予約データ（シート名指定なし、デフォルト）
予約情報は自動的にこのシートに追加されます。

#### 列定義
| 列 | 項目名 | 内容 |
|:---:|:---|:---|
| **A** | 申込日時 | 予約申込があった日時（自動記録） |
| **B** | お名前 | 予約者の氏名 |
| **C** | ふりがな | 予約者のふりがな |
| **D** | メールアドレス | 連絡先メールアドレス |
| **E** | 電話番号 | 連絡先電話番号 |
| **F** | ライブ日程 | 選択された公演日時 |
| **G** | チケット詳細 | 一般・学生の各枚数 |
| **H** | 受取方法 | 当日受取 または 郵送 |
| **I** | 合計金額 | 支払総額（チケット代＋送料） |
| **J** | 支払い方法 | 銀行振込 / PayPay / 現金など |
| **K** | ご要望・ご質問 | 自由入力欄の内容 |
| **L** | 申込経路 | 何を見てサイトを知ったか |

### シート2: LiveInfo（ライブ情報管理）
管理画面から更新されるライブ情報（日程、料金など）がこのシートに Key-Value 形式で保存されます。
**このシートは削除しないでください。**

### 運用上の注意
- **行の削除**: データが入っている行を削除すると、次の予約は最終行の下に追加されます。
- **列の変更**: 列の順番を変更すると、データが正しく保存されなくなる可能性があります。
- **共有設定**: シートの共有設定で、サービスアカウント（`client_email`）に「編集者」権限が必要です。

## 📧 本番環境でのメール設定 (Gmail)

本システムは Gmail アカウントを使用してメールを送信します。
本番環境でメールを送信するには、以下の手順で Google アカウントの「アプリパスワード」を取得し、環境変数に設定してください。

### 1. アプリパスワードの取得
1. 送信に使用したい Google アカウントで [Google アカウント管理](https://myaccount.google.com/) にアクセス
2. 「セキュリティ」→「2段階認証プロセス」をオンにする
3. [アプリパスワード](https://myaccount.google.com/apppasswords) のページへアクセス
4. アプリ名に適当な名前（例: "Flute Reservation"）を入力して「作成」
5. 生成された16桁のパスワードをコピー

### 2. 環境変数の設定
`.env.local` または Vercel の環境変数に以下を設定します。

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx  # 生成されたアプリパスワード（スペース有無は問わない）
```

これにより、予約確認メールがあなたのアカウントから送信されます。

## 📚 ドキュメント

### 基本設定

- [Google Sheets 設定手順](./docs/google-sheets-setup.md)
- [デプロイ手順](./docs/deployment-guide.md)
- [フォーム内容分析](./docs/google-form-analysis.md)

### 管理機能

- [管理機能詳細ガイド](./docs/admin-features.md)
- [画像管理システム](./docs/IMAGE_SETUP.md)
- [プロジェクト完成チェックリスト](./docs/project-completion-checklist.md)
- [デザイン分析](./docs/design-analysis.md)

## 🤝 カスタマイズ

### 演奏会情報の更新

`docs/google-form-analysis.md`の「TODO」セクションを確認し、実際の演奏会情報に合わせて以下を更新してください：

- 日程・時間
- 会場情報
- チケット料金
- プログラム内容

### デザインのカスタマイズ

- `src/app/globals.css`: カスタムスタイル
- `src/components/`: 各コンポーネントのスタイル調整

## 🆘 よくある質問（初学者向け）

### Q: エラーが出て動かない

**A:** [初回セットアップガイド](./docs/learning/00-getting-started.md#trouble-shooting)で解決方法を確認してください。

### Q: プログラミング未経験でも大丈夫？

**A:** はい！[学習ロードマップ](./docs/learning/00-getting-started.md#learning-roadmap)で段階的に学べます。

### Q: どの技術から学び始めればいい？

**A:** [学習ガイド](./docs/learning/)でHTML/CSS → JavaScript → React の順で学習することをお勧めします。

### Q: 実際のプロジェクトとして使えますか？

**A:** はい！本番環境での利用を想定して設計されています。

## 📞 サポート

問題や質問がある場合は、以下を確認してください：

1. [初学者向けトラブルシューティング](./docs/learning/00-getting-started.md#trouble-shooting)
2. [詳細なトラブルシューティング](./docs/deployment-guide.md#トラブルシューティング)
3. GitHub の Issues
4. [学習ガイド](./docs/learning/)

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
