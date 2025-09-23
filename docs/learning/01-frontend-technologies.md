# フロントエンド技術スタック解説

このプロジェクトで使用している主要なフロントエンド技術について、初学者向けに解説します。

## 📚 目次

1. [Next.js](#nextjs)
2. [TypeScript](#typescript)
3. [Tailwind CSS](#tailwind-css)
4. [React Hook Form](#react-hook-form)
5. [Zod](#zod)

---

## Next.js

### 🤔 Next.js とは？

Next.js は、React をベースにした**フルスタック Web アプリケーションフレームワーク**です。

### 🎯 なぜ Next.js を選んだのか？

1. **サーバーサイドレンダリング（SSR）**

   - SEO に優れている
   - ページの初期表示が高速

2. **App Router（Next.js 13+）**

   - 直感的なファイルベースルーティング
   - サーバーコンポーネントとクライアントコンポーネントの使い分け

3. **API Routes**
   - `/app/api/`以下に API エンドポイントを作成可能
   - バックエンドとフロントエンドを 1 つのプロジェクトで管理

### 📁 このプロジェクトでの使用例

```
src/app/
├── page.tsx              # トップページ
├── admin/
│   └── page.tsx         # 管理者ページ
└── api/
    ├── reservation/
    │   └── route.ts     # 予約API
    └── live-info/
        └── route.ts     # ライブ情報API
```

### 🔧 主要な機能

#### 1. サーバーコンポーネント（デフォルト）

```tsx
// サーバーで実行される（データベースアクセスなど）
export default function ServerComponent() {
  return <div>サーバーコンポーネント</div>;
}
```

#### 2. クライアントコンポーネント

```tsx
"use client"; // この行が必要

import { useState } from "react";

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### 3. API Routes

```tsx
// src/app/api/example/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello API" });
}

export async function POST(request: Request) {
  const data = await request.json();
  // データ処理
  return NextResponse.json({ success: true });
}
```

### 📖 学習リソース

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - インタラクティブなチュートリアル

---

## TypeScript

### 🤔 TypeScript とは？

TypeScript は、JavaScript に**型安全性**を追加したプログラミング言語です。

### 🎯 なぜ TypeScript を使うのか？

1. **エラーの早期発見**

   - コンパイル時にエラーを検出
   - ランタイムエラーを減らせる

2. **開発体験の向上**

   - 自動補完が充実
   - リファクタリングが安全

3. **コードの可読性**
   - 型定義により意図が明確

### 🔧 このプロジェクトでの使用例

#### 1. 基本的な型定義

```tsx
// プリミティブ型
const name: string = "吉原りえ";
const age: number = 25;
const isMusician: boolean = true;

// 配列
const instruments: string[] = ["フルート", "ピッコロ"];

// オブジェクト
const concert: {
  title: string;
  date: string;
  price: number;
} = {
  title: "フルートリサイタル",
  date: "2025-10-04",
  price: 4000,
};
```

#### 2. インターフェース定義

```tsx
// フォームデータの型定義
interface ReservationFormData {
  name: string;
  email: string;
  phone: string;
  generalTickets: number;
  studentTickets: number;
  paymentMethod: string;
}

// コンポーネントのProps型定義
interface ButtonProps {
  onClick: () => void;
  disabled?: boolean; // ?は省略可能を意味
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, children }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
```

#### 3. ユニオン型とリテラル型

```tsx
// 支払い方法は特定の値のみ許可
type PaymentMethod = "bank" | "paypay" | "cash";

// 関数の型定義
const processPayment = (method: PaymentMethod): boolean => {
  switch (method) {
    case "bank":
      return processBankTransfer();
    case "paypay":
      return processPayPay();
    case "cash":
      return processCash();
    default:
      return false;
  }
};
```

### 💡 開発時のコツ

1. **型推論を活用**

   ```tsx
   // 明示的な型定義（冗長）
   const message: string = "Hello";

   // 型推論を活用（推奨）
   const message = "Hello"; // TypeScriptが自動でstring型と推論
   ```

2. **型ガード**

   ```tsx
   const isString = (value: unknown): value is string => {
     return typeof value === "string";
   };

   if (isString(userInput)) {
     // この中では userInput は string 型として扱える
     console.log(userInput.toUpperCase());
   }
   ```

### 📖 学習リソース

- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive/)

---

## Tailwind CSS

### 🤔 Tailwind CSS とは？

Tailwind CSS は、**ユーティリティファースト**の CSS フレームワークです。

### 🎯 なぜ Tailwind CSS を選んだのか？

1. **高速な開発**

   - HTML から離れずにスタイリング
   - 事前定義されたクラスで一貫性

2. **レスポンシブデザイン**

   - ブレークポイントが簡単
   - モバイルファースト

3. **カスタマイズ性**
   - デザインシステムの構築が容易
   - 使わない CSS は自動削除（PurgeCSS）

### 🔧 基本的な使い方

#### 1. レイアウト

```tsx
{
  /* フレックスボックス */
}
<div className="flex items-center justify-between">
  <h1>タイトル</h1>
  <button>ボタン</button>
</div>;

{
  /* グリッドレイアウト */
}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>コンテンツ1</div>
  <div>コンテンツ2</div>
</div>;
```

#### 2. スペーシング

```tsx
{/* マージンとパディング */}
<div className="p-4 m-2">          {/* padding: 1rem, margin: 0.5rem */}
<div className="px-6 py-3">        {/* padding: 0.75rem 1.5rem */}
<div className="mt-8 mb-4">        {/* margin-top: 2rem, margin-bottom: 1rem */}
```

#### 3. 色とタイポグラフィ

```tsx
{/* テキストと背景色 */}
<h1 className="text-3xl font-bold text-gray-900">見出し</h1>
<p className="text-sm text-gray-600">本文</p>
<div className="bg-amber-50 border border-amber-200">注意書き</div>

{/* ホバー効果 */}
<button className="bg-blue-500 hover:bg-blue-700 text-white">
  ボタン
</button>
```

#### 4. レスポンシブデザイン

```tsx
{/* モバイルファースト */}
<div className="text-sm md:text-base lg:text-lg">
  {/*
    デフォルト（モバイル）: text-sm
    md以上（タブレット）: text-base
    lg以上（デスクトップ）: text-lg
  */}
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/*
    モバイル: 1列
    タブレット: 2列
    デスクトップ: 3列
  */}
</div>
```

### 🎨 このプロジェクトでの使用例

```tsx
// フォームのスタイリング例
<input
  type="text"
  className="w-full px-3 py-2 border border-gray-300 rounded-md
             focus:outline-none focus:ring-2 focus:ring-amber-500
             invalid:border-red-500"
/>

// カードコンポーネントのスタイリング
<div className="bg-white p-8 rounded-lg shadow-lg
                hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-xl font-medium text-gray-900 mb-4">
    カードタイトル
  </h3>
  <p className="text-gray-600 leading-relaxed">
    カードの内容
  </p>
</div>
```

### 💡 開発時のコツ

1. **コンポーネント化で重複を避ける**

   ```tsx
   // 共通のボタンコンポーネント
   const Button = ({ children, variant = "primary" }) => {
     const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
     const variants = {
       primary: "bg-blue-500 hover:bg-blue-600 text-white",
       secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
     };

     return (
       <button className={`${baseClasses} ${variants[variant]}`}>
         {children}
       </button>
     );
   };
   ```

2. **カスタム CSS との併用**
   ```tsx
   // globals.cssでカスタムクラスを定義
   @layer components {
     .btn-primary {
       @apply bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md;
     }
   }
   ```

### 📖 学習リソース

- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/) - プレミアムコンポーネント集

---

## React Hook Form

### 🤔 React Hook Form とは？

React Hook Form は、**パフォーマンスと使いやすさ**を重視した React フォームライブラリです。

### 🎯 なぜ React Hook Form を選んだのか？

1. **高パフォーマンス**

   - 再レンダリングの最小化
   - 非制御コンポーネントの使用

2. **簡単なバリデーション**

   - 組み込みバリデーション
   - 外部スキーマ（Yup、Zod）との統合

3. **直感的な API**
   - 少ないコード量
   - TypeScript 完全対応

### 🔧 基本的な使い方

#### 1. 基本的なフォーム

```tsx
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data); // { name: "田中太郎", email: "tanaka@example.com" }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", { required: "名前は必須です" })}
        placeholder="お名前"
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        {...register("email", {
          required: "メールアドレスは必須です",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "有効なメールアドレスを入力してください",
          },
        })}
        placeholder="メールアドレス"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit">送信</button>
    </form>
  );
};
```

#### 2. デフォルト値の設定

```tsx
const { register, handleSubmit } = useForm<FormData>({
  defaultValues: {
    name: "",
    email: "",
    generalTickets: 0,
    studentTickets: 0,
  },
});
```

#### 3. リアルタイム値の監視

```tsx
const { register, watch } = useForm();

// 特定のフィールドの値を監視
const generalTickets = watch("generalTickets");
const studentTickets = watch("studentTickets");

// 複数フィールドの監視
const [general, student] = watch(["generalTickets", "studentTickets"]);

// 計算処理
const totalAmount = (general || 0) * 4000 + (student || 0) * 3000;
```

#### 4. 条件付きバリデーション

```tsx
const { register } = useForm();

<input
  {...register("generalTickets", {
    min: { value: 0, message: "0以上を入力してください" },
    max: { value: 10, message: "最大10枚まで選択可能です" },
    validate: (value, formValues) => {
      // カスタムバリデーション
      const total = value + formValues.studentTickets;
      return total >= 1 || "最低1枚のチケットを選択してください";
    },
  })}
/>;
```

### 🎯 このプロジェクトでの実装例

```tsx
// src/components/ReservationForm.tsx での使用例
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  watch,
} = useForm<ReservationFormData>({
  resolver: zodResolver(reservationSchema), // Zodと統合
  defaultValues: {
    generalTickets: 0,
    studentTickets: 0,
    deliveryMethod: "pickup",
  },
});

// リアルタイム料金計算
const watchedValues = watch([
  "generalTickets",
  "studentTickets",
  "deliveryMethod",
]);
const [generalTickets, studentTickets, deliveryMethod] = watchedValues;

const ticketTotal = (generalTickets || 0) * 4000 + (studentTickets || 0) * 3000;
const deliveryFee = deliveryMethod === "postal" ? 200 : 0;
const totalAmount = ticketTotal + deliveryFee;
```

### 💡 開発時のコツ

1. **非制御コンポーネントを活用**

   ```tsx
   // ❌ 制御コンポーネント（避ける）
   const [name, setName] = useState("");
   <input value={name} onChange={(e) => setName(e.target.value)} />

   // ✅ 非制御コンポーネント（推奨）
   <input {...register("name")} />
   ```

2. **エラーハンドリングの統一**

   ```tsx
   const ErrorMessage = ({ error }: { error?: FieldError }) => {
     if (!error) return null;
     return <p className="text-red-500 text-sm mt-1">{error.message}</p>;
   };

   // 使用例
   <ErrorMessage error={errors.name} />;
   ```

### 📖 学習リソース

- [React Hook Form 公式ドキュメント](https://react-hook-form.com/)
- [React Hook Form Examples](https://github.com/react-hook-form/react-hook-form/tree/master/examples)

---

## Zod

### 🤔 Zod とは？

Zod は、**TypeScript-first**なスキーマ検証ライブラリです。

### 🎯 なぜ Zod を使うのか？

1. **型安全性**

   - スキーマから自動で型を生成
   - ランタイムとコンパイル時の両方で型安全

2. **直感的な API**

   - チェーン可能なメソッド
   - 豊富なバリデーション機能

3. **React Hook Form との統合**
   - `@hookform/resolvers/zod`で簡単統合
   - 一元的なバリデーション管理

### 🔧 基本的な使い方

#### 1. 基本的なスキーマ定義

```tsx
import { z } from "zod";

// 基本的な型
const stringSchema = z.string();
const numberSchema = z.number();
const booleanSchema = z.boolean();

// オプショナル
const optionalStringSchema = z.string().optional();

// 配列
const stringArraySchema = z.array(z.string());

// オブジェクト
const userSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  age: z.number().min(0, "年齢は0以上である必要があります"),
  email: z.string().email("有効なメールアドレスを入力してください"),
});

// 型の抽出
type User = z.infer<typeof userSchema>;
// これは以下と同等:
// type User = {
//   name: string;
//   age: number;
//   email: string;
// }
```

#### 2. バリデーション

```tsx
const schema = z.object({
  name: z
    .string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),

  email: z.string().email("有効なメールアドレスを入力してください"),

  age: z
    .number()
    .int("整数で入力してください")
    .min(0, "0以上の値を入力してください")
    .max(120, "120以下の値を入力してください"),

  phone: z.string().regex(/^[0-9-]+$/, "電話番号の形式が正しくありません"),
});

// バリデーション実行
const result = schema.safeParse({
  name: "田中太郎",
  email: "tanaka@example.com",
  age: 25,
  phone: "090-1234-5678",
});

if (result.success) {
  console.log(result.data); // 検証済みデータ
} else {
  console.log(result.error.issues); // エラー詳細
}
```

#### 3. 高度なバリデーション

```tsx
const reservationSchema = z
  .object({
    generalTickets: z.number().min(0).max(10),
    studentTickets: z.number().min(0).max(10),
    paymentMethod: z.enum(["bank", "paypay", "cash"]),
  })
  .refine((data) => data.generalTickets + data.studentTickets >= 1, {
    message: "最低1枚のチケットを選択してください",
    path: ["generalTickets"], // エラーを表示するフィールド
  });

// 条件付きバリデーション
const conditionalSchema = z
  .object({
    deliveryMethod: z.enum(["pickup", "postal"]),
    address: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "postal") {
        return data.address && data.address.length > 0;
      }
      return true;
    },
    {
      message: "郵送の場合は住所が必要です",
      path: ["address"],
    }
  );
```

### 🎯 このプロジェクトでの実装例

```tsx
// src/components/ReservationForm.tsx でのスキーマ定義
const reservationSchema = z
  .object({
    name: z.string().min(1, "お名前を入力してください"),
    nameKana: z.string().min(1, "ふりがなを入力してください"),
    email: z.string().email("正しいメールアドレスを入力してください"),
    phone: z.string().min(10, "電話番号を入力してください"),
    liveDate: z.string().min(1, "ライブ日程を選択してください"),
    generalTickets: z
      .number()
      .min(0, "0枚以上を選択してください")
      .max(10, "最大10枚まで"),
    studentTickets: z
      .number()
      .min(0, "0枚以上を選択してください")
      .max(10, "最大10枚まで"),
    deliveryMethod: z.string().min(1, "チケット受取方法を選択してください"),
    paymentMethod: z.string().min(1, "支払い方法を選択してください"),
    requests: z.string().optional(),
    howDidYouKnow: z.string().min(1, "どちらで知りましたかを選択してください"),
    agreeCancel: z
      .boolean()
      .refine((val) => val === true, "キャンセルポリシーに同意してください"),
    agreePrivacy: z
      .boolean()
      .refine((val) => val === true, "個人情報の取り扱いに同意してください"),
  })
  .refine((data) => data.generalTickets + data.studentTickets >= 1, {
    message: "最低1枚のチケットを選択してください",
    path: ["generalTickets"],
  });

// 型の自動生成
type ReservationFormData = z.infer<typeof reservationSchema>;

// React Hook Formとの統合
const form = useForm<ReservationFormData>({
  resolver: zodResolver(reservationSchema),
});
```

### 💡 開発時のコツ

1. **スキーマの再利用**

   ```tsx
   // 基本スキーマ
   const baseUserSchema = z.object({
     name: z.string().min(1),
     email: z.string().email(),
   });

   // 拡張スキーマ
   const createUserSchema = baseUserSchema.extend({
     password: z.string().min(6),
   });

   const updateUserSchema = baseUserSchema.partial(); // 全フィールドをオプショナルに
   ```

2. **カスタムエラーメッセージ**

   ```tsx
   const schema = z.object({
     email: z
       .string({
         required_error: "メールアドレスは必須です",
         invalid_type_error: "メールアドレスは文字列である必要があります",
       })
       .email("有効なメールアドレスを入力してください"),
   });
   ```

3. **データ変換**
   ```tsx
   const schema = z.object({
     age: z.string().transform((val) => parseInt(val, 10)), // 文字列から数値に変換
     tags: z.string().transform((val) => val.split(",")), // カンマ区切り文字列を配列に
   });
   ```

### 📖 学習リソース

- [Zod 公式ドキュメント](https://zod.dev/)
- [Zod GitHub](https://github.com/colinhacks/zod)

---

## 🚀 まとめ

このプロジェクトで使用している技術スタックは、モダンな Web 開発のベストプラクティスを組み合わせています：

- **Next.js**: 高速で SEO に優れた Web アプリケーション
- **TypeScript**: 型安全性による開発体験の向上
- **Tailwind CSS**: 高速で一貫性のあるスタイリング
- **React Hook Form**: 高パフォーマンスなフォーム管理
- **Zod**: 型安全なバリデーション

これらの技術を組み合わせることで、保守性が高く、スケーラブルな Web アプリケーションを構築できます。

### 🎯 次のステップ

1. 各技術の公式ドキュメントを読む
2. 小さなプロジェクトで実際に試してみる
3. コミュニティやフォーラムで質問・情報交換
4. オープンソースプロジェクトに貢献
