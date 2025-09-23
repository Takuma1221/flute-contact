# 🎯 GitHub Issues・Projects セットアップガイド

## 📋 Issues作成チェックリスト

以下のIssuesを作成してください：

### Phase 1: UI/UX改善

#### Issue #1: 用語統一
```
タイトル: [Task-1] 用語統一：ライブ→演奏会
ラベル: priority/high, type/feature, difficulty/easy, effort/1-2h
担当者: (分担決定後)
マイルストーン: Phase 1

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

## ⏱️ 見積工数: 2-3時間
```

#### Issue #2: 料金体系見直し
```
タイトル: [Task-2] 料金体系見直し（学生割引）
ラベル: priority/high, type/feature, difficulty/medium, effort/3-5h
```

#### Issue #3: 問い合わせ先更新
```
タイトル: [Task-3] 問い合わせメールアドレス変更
ラベル: priority/high, type/feature, difficulty/easy, effort/1-2h
```

### Phase 2: 画像・表示機能拡張

#### Issue #4: 複数チラシ画像対応
```
タイトル: [Task-4] 管理画面：複数チラシ画像アップロード機能
ラベル: priority/medium, type/feature, difficulty/hard, effort/6+h
```

#### Issue #5: 開場時間表示
```
タイトル: [Task-5] 開場時間表示機能の追加
ラベル: priority/medium, type/feature, difficulty/medium, effort/3-5h
```

### Phase 3-4: 他の機能も同様に作成

---

## 🏗️ GitHub Project設定手順

### 1. プロジェクト作成
1. リポジトリの「Projects」タブ
2. 「New project」→「Board」を選択
3. 名前: "フルート演奏会システム改善"

### 2. カラム設定
```
📋 Backlog
🏗️ In Progress  
👀 In Review
✅ Done
🚀 Released
```

### 3. 自動化設定
```yaml
# .github/workflows/project-automation.yml
name: Project Automation

on:
  issues:
    types: [opened, closed]
  pull_request:
    types: [opened, closed, converted_to_draft, ready_for_review]

jobs:
  update_project:
    runs-on: ubuntu-latest
    steps:
      - name: Move issue to project
        uses: actions/add-to-project@v0.4.0
        with:
          project-url: https://github.com/users/Takuma1221/projects/1
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## 🏷️ ラベル設定スクリプト

GitHubのSettings → Labelsで以下を作成：

### 優先度ラベル
- `priority/high` - 色: #D73A4A (赤)
- `priority/medium` - 色: #FBCA04 (黄)  
- `priority/low` - 色: #0E8A16 (緑)

### 種別ラベル
- `type/feature` - 色: #7057FF (紫)
- `type/bug` - 色: #D73A4A (赤)
- `type/documentation` - 色: #0075CA (青)

### 難易度ラベル  
- `difficulty/easy` - 色: #0E8A16 (緑)
- `difficulty/medium` - 色: #FBCA04 (黄)
- `difficulty/hard` - 色: #D73A4A (赤)

### 工数ラベル
- `effort/1-2h` - 色: #C5DEF5 (薄青)
- `effort/3-5h` - 色: #BFD4F2 (青)
- `effort/6+h` - 色: #8B949E (グレー)

---

## 📊 ダッシュボード用クエリ

### Issues Overview
```
is:issue is:open label:priority/high
is:issue is:open assignee:@me
is:issue is:open milestone:"Phase 1"
```

### Pull Requests
```
is:pr is:open review-requested:@me
is:pr is:open author:@me
```

---

## 🚀 初期セットアップコマンド

```bash
# developブランチ作成
git checkout -b develop
git push origin develop

# ブランチ保護設定（GitHubで手動設定）
# Settings → Branches → Add rule

# 最初のIssue作成用ブランチ
git checkout -b setup/github-issues
```

---

## 📅 週次レビューテンプレート

```markdown
# 週次レビュー - YYYY/MM/DD

## 📊 今週の進捗
- [ ] Task-1: 用語統一 (進行中/完了/ブロック中)
- [ ] Task-2: 料金体系見直し (進行中/完了/ブロック中)

## 🎯 来週の計画
- [ ] Task-X の開始
- [ ] 〇〇の調査・検討

## 🚨 問題・ブロッカー
- なし
- 〇〇について要相談

## 💡 改善提案
- ワークフローの改善案
- ツールの追加提案
```

---

## 🎉 セットアップ完了後のアクション

1. ✅ Issues作成完了
2. ✅ Project設定完了  
3. ✅ ラベル設定完了
4. ✅ ブランチ保護設定完了
5. ✅ 協業者招待完了

→ **開発開始準備完了！**