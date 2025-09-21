"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// フォームスキーマ
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

type ReservationFormData = z.infer<typeof reservationSchema>;

interface LiveInfoData {
  generalPrice: number;
  studentPrice: number;
  deliveryFee: number;
  maxTickets: number;
}

export function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [liveInfo, setLiveInfo] = useState<LiveInfoData>({
    generalPrice: 4000,
    studentPrice: 3000,
    deliveryFee: 200,
    maxTickets: 10,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      generalTickets: 0,
      studentTickets: 0,
      deliveryMethod: "pickup",
    },
  });

  const watchedValues = watch([
    "generalTickets",
    "studentTickets",
    "deliveryMethod",
  ]);
  const [generalTickets, studentTickets, deliveryMethod] = watchedValues;

  // 料金計算（動的）
  const ticketTotal =
    (generalTickets || 0) * liveInfo.generalPrice +
    (studentTickets || 0) * liveInfo.studentPrice;
  const deliveryFeeAmount =
    deliveryMethod === "postal" ? liveInfo.deliveryFee : 0;
  const totalAmount = ticketTotal + deliveryFeeAmount;

  // ライブ情報を取得
  useEffect(() => {
    const fetchLiveInfo = async () => {
      try {
        const response = await fetch("/api/live-info");
        if (response.ok) {
          const data = await response.json();
          setLiveInfo({
            generalPrice: data.generalPrice || 4000,
            studentPrice: data.studentPrice || 3000,
            deliveryFee: data.deliveryFee || 200,
            maxTickets: data.maxTickets || 10,
          });
        }
      } catch (error) {
        console.error("Failed to fetch live info:", error);
      }
    };

    fetchLiveInfo();
  }, []);

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reservation" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
          チケット予約
        </h2>

        {submitStatus === "success" && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ご予約ありがとうございます。確認メールをお送りしましたのでご確認ください。
            </p>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              エラーが発生しました。しばらくしてから再度お試しください。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 基本情報 */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">基本情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="nameKana"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ふりがな <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="nameKana"
                  {...register("nameKana")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {errors.nameKana && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nameKana.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* 予約情報 */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">予約情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="liveDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  ライブ日程 <span className="text-red-500">*</span>
                </label>
                <select
                  id="liveDate"
                  {...register("liveDate")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">選択してください</option>
                  <option value="2025-10-04-14:00">
                    2025年10月4日（土）14:00開演
                  </option>
                  <option value="2025-10-04-18:00">
                    2025年10月4日（土）18:00開演
                  </option>
                </select>
                {errors.liveDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.liveDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  htmlFor="generalTickets"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  一般チケット（¥{liveInfo.generalPrice.toLocaleString()}）
                </label>
                <select
                  id="generalTickets"
                  {...register("generalTickets", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[...Array(liveInfo.maxTickets + 1)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}枚
                    </option>
                  ))}
                </select>
                {errors.generalTickets && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.generalTickets.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="studentTickets"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  学生チケット（¥{liveInfo.studentPrice.toLocaleString()}）
                </label>
                <select
                  id="studentTickets"
                  {...register("studentTickets", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[...Array(liveInfo.maxTickets + 1)].map((_, i) => (
                    <option key={i} value={i}>
                      {i}枚
                    </option>
                  ))}
                </select>
                {errors.studentTickets && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.studentTickets.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label
                  htmlFor="deliveryMethod"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  チケット受取方法 <span className="text-red-500">*</span>
                </label>
                <select
                  id="deliveryMethod"
                  {...register("deliveryMethod")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">選択してください</option>
                  <option value="pickup">当日受取（無料）</option>
                  <option value="postal">
                    郵送（¥{liveInfo.deliveryFee.toLocaleString()}）
                  </option>
                </select>
                {errors.deliveryMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.deliveryMethod.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  支払い方法 <span className="text-red-500">*</span>
                </label>
                <select
                  id="paymentMethod"
                  {...register("paymentMethod")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">選択してください</option>
                  <option value="bank">銀行振込（三井住友銀行）</option>
                  <option value="paypay">PayPay（fueneko5656）</option>
                  <option value="cash">現金（当日受付）</option>
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>
            </div>

            {/* 料金計算表示 */}
            {(generalTickets || 0) + (studentTickets || 0) > 0 && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">お支払い金額</h4>
                <div className="space-y-2 text-sm">
                  {(generalTickets || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>一般チケット × {generalTickets}枚</span>
                      <span>
                        ¥
                        {(
                          (generalTickets || 0) * liveInfo.generalPrice
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {(studentTickets || 0) > 0 && (
                    <div className="flex justify-between">
                      <span>学生チケット × {studentTickets}枚</span>
                      <span>
                        ¥
                        {(
                          (studentTickets || 0) * liveInfo.studentPrice
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {deliveryMethod === "postal" && (
                    <div className="flex justify-between">
                      <span>郵送料</span>
                      <span>¥{liveInfo.deliveryFee.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-amber-200" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>合計</span>
                    <span>¥{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* その他 */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">その他</h3>

            <div className="mb-4">
              <label
                htmlFor="requests"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メッセージまたはお問い合わせ
              </label>
              <textarea
                id="requests"
                rows={4}
                {...register("requests")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="購入方法などわからないことがあればご記入ください"
              />
            </div>

            <div>
              <label
                htmlFor="howDidYouKnow"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                どちらで知りましたか？ <span className="text-red-500">*</span>
              </label>
              <select
                id="howDidYouKnow"
                {...register("howDidYouKnow")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">選択してください</option>
                <option value="search">インターネット検索</option>
                <option value="sns">SNS（Instagram/Twitter/Facebook）</option>
                <option value="referral">友人・知人の紹介</option>
                <option value="flyer">チラシ・ポスター</option>
                <option value="musician">音楽関係者からの紹介</option>
                <option value="other">その他</option>
              </select>
              {errors.howDidYouKnow && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.howDidYouKnow.message}
                </p>
              )}
            </div>
          </div>

          {/* 同意事項 */}
          <div className="bg-slate-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">同意事項</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreeCancel"
                  {...register("agreeCancel")}
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeCancel" className="text-sm text-gray-700">
                  <span className="text-red-500">*</span>{" "}
                  キャンセルポリシーに同意します
                  <div className="text-xs text-gray-500 mt-1">
                    ライブ3日前までは無料キャンセル可能。それ以降のキャンセルは承れません。
                  </div>
                </label>
              </div>
              {errors.agreeCancel && (
                <p className="text-sm text-red-600">
                  {errors.agreeCancel.message}
                </p>
              )}

              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreePrivacy"
                  {...register("agreePrivacy")}
                  className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="agreePrivacy" className="text-sm text-gray-700">
                  <span className="text-red-500">*</span>{" "}
                  個人情報の取り扱いに同意します
                  <div className="text-xs text-gray-500 mt-1">
                    お預かりした個人情報は、本ライブに関する連絡・案内のみに使用いたします。
                  </div>
                </label>
              </div>
              {errors.agreePrivacy && (
                <p className="text-sm text-red-600">
                  {errors.agreePrivacy.message}
                </p>
              )}
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-4 rounded-full font-medium text-lg transition-colors duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isSubmitting ? "送信中..." : "予約を申し込む"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
