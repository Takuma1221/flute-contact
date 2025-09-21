# 4. 画像管理システムと管理機能の実装

このドキュメントでは、フルートライブ予約システムに実装した画像管理機能と管理者向け機能について詳しく解説します。

## 📋 目次

1. [実装概要](#実装概要)
2. [画像最適化システム](#画像最適化システム)
3. [モーダル表示機能](#モーダル表示機能)
4. [管理画面での画像アップロード](#管理画面での画像アップロード)
5. [パフォーマンス最適化](#パフォーマンス最適化)
6. [学習ポイント](#学習ポイント)

## 実装概要

### 🎯 実装した機能

1. **プロフィール画像の表示最適化**
   - フルーティストの顔が見えるように画像の切り抜き位置を調整
   - CSS `object-position` プロパティを使用

2. **フルート楽器画像の視認性向上**
   - 装飾的なフルート画像のサイズを拡大
   - レスポンシブデザインでの適切な表示

3. **パンフレット画像のクリック拡大機能**
   - 画像をクリックすると全体が見えるモーダル表示
   - アクセシビリティに配慮したキーボード操作対応

4. **管理画面での画像アップロード機能**
   - Base64エンコードでの画像データ処理
   - ファイルサイズとタイプの検証
   - プレビュー機能付きのアップロードUI

## 画像最適化システム

### Next.js Image コンポーネントの活用

```tsx
// プロフィール画像の最適化
<Image
  src="/images/flutist-profile.png"
  alt="フルーティストプロフィール"
  width={400}
  height={600}
  priority
  className="w-full h-full object-cover"
  style={{ objectPosition: 'center 25%' }}
/>
```

### 🔧 技術ポイント

#### 1. object-position での画像切り抜き制御

```css
/* 画像の上部25%の位置を中心に表示 */
object-position: center 25%;
```

**学習ポイント:**
- `object-fit: cover` で画像をコンテナにフィット
- `object-position` で表示する部分を制御
- パーセント値で細かい調整が可能

#### 2. レスポンシブな画像サイズ

```tsx
// Tailwind CSSでのレスポンシブサイズ指定
className="w-32 h-32 md:w-36 md:h-36"
```

**学習ポイント:**
- モバイル: `w-32 h-32` (128px × 128px)
- デスクトップ: `md:w-36 md:h-36` (144px × 144px)
- ブレークポイントでの適切なサイズ調整

## モーダル表示機能

### ImageModal コンポーネントの実装

```tsx
// ImageModal.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ src, alt, isOpen, onClose }: ImageModalProps) {
  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75 p-4">
      {/* モーダル内容 */}
    </div>
  );
}
```

### 🔧 技術ポイント

#### 1. モーダルの状態管理

```tsx
// LiveInfo.tsx
const [isModalOpen, setIsModalOpen] = useState(false);

// クリックイベントハンドラー
const handleImageClick = () => {
  console.log('パンフレット画像がクリックされました');
  setIsModalOpen(true);
};
```

#### 2. アクセシビリティ対応

```tsx
<div 
  className="cursor-pointer" 
  onClick={handleImageClick}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsModalOpen(true);
    }
  }}
>
```

**学習ポイント:**
- `role="button"` でスクリーンリーダー対応
- `tabIndex={0}` でキーボードフォーカス対応
- Enter/Spaceキーでの操作対応

#### 3. スクロール制御とクリーンアップ

```tsx
useEffect(() => {
  if (isOpen) {
    // モーダル表示時にスクロールを無効化
    document.body.style.overflow = 'hidden';
  }

  return () => {
    // コンポーネントのアンマウント時にスクロールを復元
    document.body.style.overflow = 'unset';
  };
}, [isOpen]);
```

## 管理画面での画像アップロード

### Base64エンコードでの画像処理

```tsx
// admin/page.tsx
const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // ファイルサイズ制限（5MB）
  if (file.size > 5 * 1024 * 1024) {
    setMessage("ファイルサイズが大きすぎます（最大5MB）");
    return;
  }

  // ファイルタイプ検証
  if (!file.type.startsWith('image/')) {
    setMessage("画像ファイルを選択してください");
    return;
  }

  setUploading(true);
  setMessage("");

  try {
    // Base64エンコード
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      liveForm.setValue("programImageUrl", base64);
      setMessage("画像をアップロードしました。保存ボタンを押して確定してください。");
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error("アップロードエラー:", error);
    setMessage("画像のアップロードに失敗しました");
  } finally {
    setUploading(false);
  }
}, [liveForm]);
```

### 🔧 技術ポイント

#### 1. FileReader APIの使用

```tsx
const reader = new FileReader();
reader.onload = () => {
  const base64 = reader.result as string;
  // Base64データをフォームに設定
};
reader.readAsDataURL(file);
```

**学習ポイント:**
- `FileReader` でファイルをBase64に変換
- `readAsDataURL()` でData URLスキーマ形式に変換
- 非同期処理のためコールバック関数で結果を処理

#### 2. ファイル検証

```tsx
// サイズ制限
if (file.size > 5 * 1024 * 1024) {
  setMessage("ファイルサイズが大きすぎます（最大5MB）");
  return;
}

// タイプ検証
if (!file.type.startsWith('image/')) {
  setMessage("画像ファイルを選択してください");
  return;
}
```

#### 3. React Hook Formとの連携

```tsx
// フォームスキーマの拡張
const liveInfoSchema = z.object({
  // ... 他のフィールド
  programImageUrl: z.string().optional(),
});

// フォームへの値設定
liveForm.setValue("programImageUrl", base64);

// プレビュー表示
{liveForm.watch("programImageUrl") && (
  <div className="mt-4">
    <Image
      src={liveForm.watch("programImageUrl") || "/images/concert-program.png"}
      alt="コンサートプログラム"
      width={300}
      height={400}
      className="w-full h-auto rounded-lg shadow-md"
    />
  </div>
)}
```

## パフォーマンス最適化

### useCallback による関数メモ化

```tsx
// 関数の再作成を防ぐ
const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
  // アップロード処理
}, [liveForm]);

const loadLiveInfo = useCallback(async () => {
  // データ読み込み処理
}, []);
```

### Next.js Image最適化の活用

```tsx
// 優先読み込み設定
<Image
  src="/images/flutist-profile.png"
  alt="プロフィール"
  priority  // Above-the-fold画像として優先読み込み
  width={400}
  height={600}
/>

// 遅延読み込み（デフォルト）
<Image
  src="/images/flute-instrument.png"
  alt="フルート"
  width={150}
  height={150}
  // loading="lazy" はデフォルト
/>
```

## 学習ポイント

### 🎯 画像処理・表示に関する知識

1. **Next.js Image コンポーネント**
   - 自動最適化（WebP変換、サイズ調整）
   - 遅延読み込みとpriority設定
   - レスポンシブ画像の実装

2. **CSS による画像制御**
   - `object-fit` と `object-position`
   - レスポンシブな画像サイズ
   - ホバーエフェクトとトランジション

3. **JavaScript による画像処理**
   - FileReader API
   - Base64エンコーディング
   - ファイル検証とエラーハンドリング

### 🚀 ユーザビリティ・アクセシビリティ

1. **インタラクション設計**
   - 明確なクリック可能要素の表示
   - ホバー状態とフォーカス状態
   - ローディング状態の表示

2. **アクセシビリティ対応**
   - セマンティックなHTML要素
   - キーボード操作対応
   - スクリーンリーダー対応

3. **エラーハンドリング**
   - 適切なエラーメッセージ
   - フォールバック画像の表示
   - 検証エラーの明確な表示

### 💡 実践的な応用例

この画像管理システムは以下のようなプロジェクトに応用できます：

- **ポートフォリオサイト**: 作品画像の管理・表示
- **ECサイト**: 商品画像のアップロード・表示
- **ブログシステム**: 記事画像の管理
- **SNSアプリ**: プロフィール画像・投稿画像
- **ギャラリーサイト**: 写真の一覧・詳細表示

---

## 📝 次のステップ

### 拡張アイデア

1. **画像の複数枚対応**
   - 複数画像のアップロード
   - ドラッグ&ドロップ対応
   - 画像の順序変更

2. **画像編集機能**
   - クロッピング機能
   - フィルター・効果の適用
   - リサイズ機能

3. **パフォーマンス改善**
   - 画像の圧縮処理
   - Progressive JPEG対応
   - CDN連携

4. **セキュリティ強化**
   - ファイルタイプの厳密な検証
   - 画像内容のスキャン
   - アップロード権限の管理

この実装を通じて、モダンなWeb開発における画像処理の基本から応用まで学ぶことができます！