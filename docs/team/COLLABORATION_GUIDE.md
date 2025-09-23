# 🤝 GitHub協業開発ガイド

## 📋 基本情報
- **プロジェクト**: フルート演奏会予約システム
- **開発者**: 2名
- **リポジトリ**: 個人リポジトリでの共同開発

---

## 🌿 ブランチ戦略

### ブランチ構成
```
main (本番環境)
├── develop (開発統合ブランチ)
    ├── feature/task-1-terminology-update
    ├── feature/task-2-pricing-revision  
    ├── feature/task-4-multi-image-upload
    └── hotfix/emergency-fix
```

### ブランチ命名規則
- **機能開発**: `feature/task-{番号}-{概要}`
- **バグ修正**: `bugfix/issue-{番号}-{概要}`
- **緊急修正**: `hotfix/{概要}`
- **リファクタリング**: `refactor/{概要}`

### 例
```bash
feature/task-1-terminology-update
feature/task-4-multi-image-upload
bugfix/issue-15-form-validation
hotfix/email-sending-error
```

---

## 🔄 開発フロー

### 1. 作業開始前
```bash
# 最新のdevelopブランチを取得
git checkout develop
git pull origin develop

# 新しいfeatureブランチを作成
git checkout -b feature/task-1-terminology-update
```

### 2. 開発・コミット
```bash
# 作業後にコミット
git add .
git commit -m "feat: ライブ→演奏会に用語統一

- フロントエンド全体の表記を変更
- メール文面の用語を統一
- 管理画面のラベルを更新

Closes #1"
```

### 3. プッシュ・プルリクエスト
```bash
# リモートにプッシュ
git push origin feature/task-1-terminology-update

# GitHub上でPull Requestを作成
# develop ← feature/task-1-terminology-update
```

### 4. レビュー・マージ
- 相手のレビューを受ける
- 修正があれば対応
- 承認後、developにマージ
- featureブランチを削除

### 5. 本番デプロイ
```bash
# developが安定したらmainにマージ
git checkout main
git merge develop
git push origin main
# → 自動デプロイ（Vercel）
```

---

## 📝 コミットメッセージ規約

### フォーマット
```
<type>: <subject>

<body>

<footer>
```

### Type一覧
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: コードスタイル（機能に影響なし）
- `refactor`: リファクタリング
- `test`: テスト追加・修正
- `chore`: ビルド・補助ツール関連

### 例
```
feat: 管理画面に複数画像アップロード機能を追加

- 最大2枚まで画像をアップロード可能
- プレビュー機能を実装
- 画像削除機能を追加

Closes #4
```

---

## 🎯 GitHub Issues活用

### Issue作成ルール
1. **タイトル**: `[Task-1] 用語統一：ライブ→演奏会`
2. **ラベル**: 優先度・種別を設定
3. **担当者**: アサイン
4. **マイルストーン**: Phase別に設定

### ラベル設定
```
優先度:
- priority/high 🔴
- priority/medium 🟡  
- priority/low 🟢

種別:
- type/feature ✨
- type/bug 🐛
- type/documentation 📚
- type/refactor ♻️

難易度:
- difficulty/easy 🟢
- difficulty/medium 🟡
- difficulty/hard 🔴

工数:
- effort/1-2h ⏰
- effort/3-5h ⏳
- effort/6+h ⏲️
```

### Issue テンプレート例
```markdown
## 📋 タスク概要
「ライブ」を「演奏会」に全システムで統一する

## 🎯 受け入れ条件
- [ ] フロントエンド全ページの表記変更
- [ ] メール文面の用語統一
- [ ] 管理画面ラベルの更新
- [ ] コンソールログ・コメントも統一

## 📊 影響範囲
- src/components/ 全体
- src/app/api/reservation/route.ts
- メールテンプレート

## ⏱️ 見積工数
2-3時間

## 📝 備考
特になし
```

---

## 📊 GitHub Projects設定

### 1. Project作成
- **名前**: "フルート演奏会システム改善"
- **テンプレート**: "Feature"を選択

### 2. カラム設定
```
📋 Backlog     → 未着手のタスク
🏗️ In Progress → 作業中
👀 In Review   → レビュー待ち
✅ Done        → 完了
🚀 Released    → 本番リリース済み
```

### 3. 自動化設定
- Issue作成時 → Backlogに自動追加
- PRドラフト作成時 → In Progressに移動
- PR作成時 → In Reviewに移動
- PRマージ時 → Doneに移動

---

## 🛡️ リポジトリ保護設定

### ブランチ保護ルール（main・develop）
```
☑️ Require a pull request before merging
☑️ Require approvals (1)
☑️ Dismiss stale reviews
☑️ Require status checks to pass
☑️ Require conversation resolution before merging
☑️ Include administrators
```

### 設定手順
1. Settings → Branches
2. "Add rule"をクリック
3. Branch name pattern: `main`, `develop`
4. 上記ルールを有効化

---

## 👥 協業のベストプラクティス

### 🗣️ コミュニケーション
- **毎日**: 進捗を簡単に共有
- **週1**: オンライン作業会
- **Issue**: 疑問・提案はIssueで議論
- **PR**: レビューは24時間以内に

### 🔄 作業分担
- **初期**: スキルレベルに応じて分担
- **後期**: 得意分野をクロストレーニング

### 📋 レビューポイント
- 機能要件を満たしているか
- コードスタイルは統一されているか
- セキュリティ上の問題はないか
- パフォーマンスに影響はないか

### 🚨 緊急対応
- **P0障害**: hotfixブランチで即座対応
- **Slack/Discord**: 緊急時の連絡手段

---

## 🛠️ 開発環境セットアップ

### 友達の環境構築
```bash
# リポジトリをクローン
git clone https://github.com/Takuma1221/flute-contact.git
cd flute-contact

# 依存関係インストール
npm install

# 環境変数設定（オーナーから共有）
cp .env.example .env.local
# .env.localを編集

# 開発サーバー起動
npm run dev
```

### 必要な権限設定
1. **Collaborator追加**: Settings → Manage access → Invite
2. **権限レベル**: Write権限を付与

---

## 📈 進捗管理

### 週次レビュー
- 完了タスクの確認
- 次週のタスク計画
- 問題・ブロッカーの共有

### マイルストーン設定
- **Phase 1完了**: 2週間後
- **Phase 2完了**: 1ヶ月後
- **全体完了**: 2ヶ月後

---

## 🎉 完了時のチェックリスト

### マージ前
- [ ] 機能テスト完了
- [ ] コードレビュー承認
- [ ] 関連ドキュメント更新
- [ ] 環境変数・設定ファイル確認

### リリース後
- [ ] 本番環境動作確認
- [ ] Issueクローズ
- [ ] 関連PRクローズ
- [ ] 次タスクの準備

---

これらのルールを設定することで、効率的で質の高い協業開発が実現できます！