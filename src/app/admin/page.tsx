"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

// ライブ情報のスキーマ
const liveInfoSchema = z.object({
  liveDate: z.string().min(1, "ライブ日程を入力してください"),
  liveTime1: z.string().min(1, "1回目の開演時間を入力してください"),
  liveTime2: z.string().optional(),
  venue: z.string().min(1, "会場情報を入力してください"),
  venueAddress: z.string().optional(),
  generalPrice: z.number().min(0, "一般料金を入力してください"),
  studentPrice: z.number().min(0, "学生料金を入力してください"),
  deliveryFee: z.number().min(0, "配送料を入力してください"),
  maxTickets: z.number().min(1, "最大チケット枚数を入力してください"),
  notes: z.string().optional(),
  programImageUrl: z.string().optional(),
});

type LiveInfoData = z.infer<typeof liveInfoSchema>;

// ログインスキーマ
const loginSchema = z.object({
  password: z.string().min(1, "パスワードを入力してください"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [liveInfo, setLiveInfo] = useState<LiveInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // ログインフォーム
  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // ライブ情報フォーム
  const liveForm = useForm<LiveInfoData>({
    resolver: zodResolver(liveInfoSchema),
    defaultValues: {
      liveDate: "2025年10月4日（土）",
      liveTime1: "14:00",
      liveTime2: "18:00",
      venue: "",
      venueAddress: "",
      generalPrice: 4000,
      studentPrice: 3000,
      deliveryFee: 200,
      maxTickets: 10,
      notes: "",
    },
  });

  // 認証処理
  const handleLogin = async (data: LoginData) => {
    console.log("Attempting login...");
    
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          setMessage(errorData.error || `サーバーエラー (${response.status})`);
        } catch {
          setMessage(`サーバーエラーが発生しました (${response.status})`);
        }
        return;
      }

      const result = await response.json();
      console.log("Login result:", result);

      if (result.success) {
        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        setMessage("");
        loadLiveInfo();
      } else {
        setMessage(result.error || "認証に失敗しました");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(`ネットワークエラー: ${error instanceof Error ? error.message : "不明なエラー"}`);
    }
  };

  // ライブ情報の読み込み
  const loadLiveInfo = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/live-info");
      if (response.ok) {
        const data = await response.json();
        setLiveInfo(data);
        liveForm.reset(data);
      }
    } catch (error) {
      console.error("ライブ情報の読み込みに失敗:", error);
    }
  }, [liveForm]);

  // ライブ情報の保存
  const handleSaveLiveInfo = async (data: LiveInfoData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/live-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("ライブ情報を更新しました");
        setLiveInfo(data);
      } else {
        setMessage("更新に失敗しました");
      }
    } catch (error) {
      console.error("保存エラー:", error);
      setMessage("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 画像アップロード機能
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("ファイルサイズは5MB以下にしてください");
      return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith("image/")) {
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
        setMessage(
          "画像をアップロードしました。保存ボタンを押して確定してください。"
        );
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("アップロードエラー:", error);
      setMessage("画像のアップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  // 初期化
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      loadLiveInfo();
    }
  }, [loadLiveInfo]);

  // ログアウト
  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-8">
            管理者ログイン
          </h1>
          <form onSubmit={loginForm.handleSubmit(handleLogin)}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                {...loginForm.register("password")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {loginForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
            >
              ログイン
            </button>
            {message && (
              <p className="mt-4 text-sm text-red-600 text-center">{message}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ライブ情報管理</h1>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            ログアウト
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={liveForm.handleSubmit(handleSaveLiveInfo)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本情報 */}
              <div>
                <label
                  htmlFor="liveDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ライブ日程 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="liveDate"
                  {...liveForm.register("liveDate")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {liveForm.formState.errors.liveDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {liveForm.formState.errors.liveDate.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="liveTime1"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  1回目開演時間 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="liveTime1"
                  {...liveForm.register("liveTime1")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {liveForm.formState.errors.liveTime1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {liveForm.formState.errors.liveTime1.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="liveTime2"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  2回目開演時間（任意）
                </label>
                <input
                  type="text"
                  id="liveTime2"
                  {...liveForm.register("liveTime2")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label
                  htmlFor="venue"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  会場名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="venue"
                  {...liveForm.register("venue")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {liveForm.formState.errors.venue && (
                  <p className="mt-1 text-sm text-red-600">
                    {liveForm.formState.errors.venue.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="venueAddress"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                会場住所（任意）
              </label>
              <textarea
                id="venueAddress"
                rows={2}
                {...liveForm.register("venueAddress")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* 料金設定 */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                料金設定
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="generalPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    一般料金（円） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="generalPrice"
                    {...liveForm.register("generalPrice", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {liveForm.formState.errors.generalPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {liveForm.formState.errors.generalPrice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="studentPrice"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    学生料金（円） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="studentPrice"
                    {...liveForm.register("studentPrice", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {liveForm.formState.errors.studentPrice && (
                    <p className="mt-1 text-sm text-red-600">
                      {liveForm.formState.errors.studentPrice.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="deliveryFee"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    配送料（円） <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="deliveryFee"
                    {...liveForm.register("deliveryFee", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {liveForm.formState.errors.deliveryFee && (
                    <p className="mt-1 text-sm text-red-600">
                      {liveForm.formState.errors.deliveryFee.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* その他設定 */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                その他設定
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="maxTickets"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    最大チケット枚数 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="maxTickets"
                    {...liveForm.register("maxTickets", {
                      valueAsNumber: true,
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {liveForm.formState.errors.maxTickets && (
                    <p className="mt-1 text-sm text-red-600">
                      {liveForm.formState.errors.maxTickets.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                備考・注意事項（任意）
              </label>
              <textarea
                id="notes"
                rows={4}
                {...liveForm.register("notes")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="特別な注意事項やメッセージがあれば入力してください"
              />
            </div>

            {/* パンフレット画像アップロード */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                コンサートプログラム画像
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="programImage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    パンフレット画像をアップロード
                  </label>
                  <input
                    type="file"
                    id="programImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 disabled:opacity-50"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    PNG、JPG形式、最大5MB。現在の表示を変更したい場合のみアップロードしてください。
                  </p>
                </div>

                {/* 現在の画像プレビュー */}
                {liveForm.watch("programImageUrl") && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      プレビュー:
                    </p>
                    <div className="max-w-xs">
                      <Image
                        src={
                          liveForm.watch("programImageUrl") ||
                          "/images/concert-program.png"
                        }
                        alt="コンサートプログラム"
                        width={300}
                        height={400}
                        className="w-full h-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 text-white px-8 py-3 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "保存中..." : "ライブ情報を更新"}
              </button>
            </div>

            {message && (
              <p className="mt-4 text-center text-sm text-green-600">
                {message}
              </p>
            )}
          </form>
        </div>

        {/* プレビュー */}
        {liveInfo && (
          <div className="mt-8 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              現在の設定（プレビュー）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>ライブ日程:</strong> {liveInfo.liveDate}
              </div>
              <div>
                <strong>開演時間:</strong> {liveInfo.liveTime1}
                {liveInfo.liveTime2 && ` / ${liveInfo.liveTime2}`}
              </div>
              <div>
                <strong>会場:</strong> {liveInfo.venue}
              </div>
              <div>
                <strong>一般料金:</strong> ¥
                {liveInfo.generalPrice?.toLocaleString()}
              </div>
              <div>
                <strong>学生料金:</strong> ¥
                {liveInfo.studentPrice?.toLocaleString()}
              </div>
              <div>
                <strong>配送料:</strong> ¥
                {liveInfo.deliveryFee?.toLocaleString()}
              </div>
            </div>
            {liveInfo.notes && (
              <div className="mt-4">
                <strong>備考:</strong> {liveInfo.notes}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
