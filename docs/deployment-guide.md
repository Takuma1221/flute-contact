# Vercel デプロイ手順

## 1. GitHub リポジトリの準備

```bash
# プロジェクトをGitで管理
git add .
git commit -m "Initial commit: フルートライブ予約LP"

# GitHubリポジトリを作成して push
git remote add origin https://github.com/Takuma1221/flute-contact.git
git branch -M main
git push -u origin main
```

## 2. Vercel でのデプロイ

1. [Vercel](https://vercel.com/)にアクセス
2. GitHub アカウントでログイン
3. 「New Project」をクリック
4. 作成したリポジトリを選択
5. 「Deploy」をクリック

## 3. 環境変数の設定

Vercel の設定画面で以下の環境変数を設定：

### 必須環境変数

```
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
RESEND_API_KEY=your_resend_api_key_here
```

### オプション環境変数

```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 4. デプロイ後の確認事項

- [ ] フォーム送信が正常に動作する
- [ ] Google Sheets にデータが保存される
- [ ] メール送信が正常に動作する
- [ ] レスポンシブデザインが正しく表示される

## 5. カスタムドメインの設定（オプション）

1. Vercel プロジェクト設定で「Domains」を選択
2. カスタムドメインを追加
3. DNS レコードを設定

## 無料枠の制限

- **Vercel**:
  - 月間 100GB 帯域幅
  - 1,000 回のビルド
  - サーバーレス関数実行時間制限
- **Google Sheets API**: 月間 100 万リクエスト
- **Resend**: 月間 3,000 通のメール送信

## トラブルシューティング

### よくある問題

1. **Google Sheets API エラー**

   - サービスアカウントのメール権限を確認
   - スプレッドシートの共有設定を確認

2. **メール送信エラー**

   - Resend API キーを確認
   - 送信者ドメインの認証を確認

3. **ビルドエラー**
   - 環境変数が正しく設定されているか確認
   - TypeScript エラーがないか確認
