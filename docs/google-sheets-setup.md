# Google Sheets API 設定手順

## 1. Google Cloud Project の作成

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成（プロジェクト名例: "flute-live-reservations"）
3. プロジェクトを選択

## 2. Google Sheets API の有効化

1. 「API とサービス」→「演奏会ラリ」を選択
2. "Google Sheets API"を検索して選択
3. 「有効にする」をクリック

## 3. サービスアカウントの作成

1. 「API とサービス」→「認証情報」を選択
2. 「認証情報を作成」→「サービスアカウント」を選択
3. サービスアカウント情報を入力：
   - 名前: flute-reservation-service
   - ID: flute-reservation-service
   - 説明: フルート演奏会予約システム用
4. 「作成して続行」をクリック
5. ロールは設定せずに「続行」
6. 「完了」をクリック

## 4. サービスアカウントキーの作成

1. 作成したサービスアカウントをクリック
2. 「キー」タブを選択
3. 「鍵を追加」→「新しい鍵を作成」
4. 「JSON」を選択して「作成」
5. ダウンロードされた JSON ファイルを保存

## 5. Google Spreadsheet の作成と共有

1. [Google Sheets](https://sheets.google.com/)で新しいスプレッドシートを作成
2. シート名を「フルート演奏会予約管理」などに変更
3. 1 行目にヘッダーを作成：
   ```
   A1: 申込日時
   B1: お名前
   C1: ふりがな
   D1: メールアドレス
   E1: 電話番号
   F1: 演奏会日程
   G1: 席種
   H1: チケット枚数
   I1: 合計金額
   J1: 支払い方法
   K1: ご要望・ご質問
   L1: 申込経路
   ```
4. スプレッドシートを共有：
   - 「共有」ボタンをクリック
   - サービスアカウントのメールアドレス（JSON ファイル内の client_email）を追加
   - 権限を「編集者」に設定
5. スプレッドシートの ID をコピー（URL の`/d/`と`/edit`の間の文字列）

## 6. 環境変数の設定

`.env.local`ファイルに以下を設定：

```env
# ダウンロードしたJSONファイルから取得
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# スプレッドシートのID
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
```

## 7. Resend API の設定

1. [Resend](https://resend.com/)でアカウント作成
2. API キーを生成
3. `.env.local`に追加：
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   ```

## 無料枠の制限

- **Google Sheets API**: 月間 100 万リクエスト（無料）
- **Resend**: 月間 3,000 通のメール送信（無料）
- **Vercel**: 無料枠でホスティング可能

## セキュリティ注意事項

- `.env.local`ファイルは Git にコミットしない
- サービスアカウントキーは安全に管理
- 本番環境では Vercel の環境変数設定を使用
