"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageModal } from "./ImageModal";

interface LiveInfoData {
  liveDate: string;
  liveTime1: string;
  liveTime2?: string;
  venue: string;
  venueAddress?: string;
  generalPrice: number;
  studentPrice: number;
  deliveryFee: number;
  notes?: string;
  programImageUrl?: string;
}

export function LiveInfo() {
  const [liveInfo, setLiveInfo] = useState<LiveInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLiveInfo = async () => {
      try {
        const response = await fetch("/api/live-info");
        if (response.ok) {
          const data = await response.json();
          setLiveInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch live info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveInfo();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-12"></div>
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
                <div className="h-6 bg-gray-300 rounded w-32 mx-auto mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-300 rounded w-48 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded w-56 mx-auto"></div>
                  <div className="h-4 bg-gray-300 rounded w-40 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
          Live Information
        </h2>

        {/* ライブ詳細 */}
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-gray-900 mb-6 text-center">
            開催概要
          </h3>
          <div className="space-y-6">
            <div className="flex items-start justify-center space-x-3">
              <Calendar className="h-5 w-5 text-amber-600 mt-1" />
              <div className="text-center">
                <p className="font-medium text-gray-900">開催日</p>
                <p className="text-gray-600">
                  {liveInfo?.liveDate || "未設定"}
                </p>
              </div>
            </div>

            <div className="flex items-start justify-center space-x-3">
              <Clock className="h-5 w-5 text-amber-600 mt-1" />
              <div className="text-center">
                <p className="font-medium text-gray-900">開演時間</p>
                <p className="text-gray-600">
                  {liveInfo?.liveTime1 && `①${liveInfo.liveTime1}開演`}
                  {liveInfo?.liveTime2 && ` / ②${liveInfo.liveTime2}開演`}
                  {!liveInfo?.liveTime1 && "未設定"}
                </p>
              </div>
            </div>

            <div className="flex items-start justify-center space-x-3">
              <MapPin className="h-5 w-5 text-amber-600 mt-1" />
              <div className="text-center">
                <p className="font-medium text-gray-900">会場</p>
                <p className="text-gray-600">
                  {liveInfo?.venue || "詳細は予約後にご案内いたします"}
                </p>
                {liveInfo?.venueAddress && (
                  <p className="text-sm text-gray-500 mt-1">
                    {liveInfo.venueAddress}
                  </p>
                )}
              </div>
            </div>

            {/* 料金情報 */}
            {liveInfo &&
              (liveInfo.generalPrice > 0 || liveInfo.studentPrice > 0) && (
                <div className="flex items-start justify-center space-x-3">
                  <div className="text-center">
                    <p className="font-medium text-gray-900">料金</p>
                    <div className="text-gray-600 space-y-1">
                      {liveInfo.generalPrice > 0 && (
                        <p>一般: ¥{liveInfo.generalPrice.toLocaleString()}</p>
                      )}
                      {liveInfo.studentPrice > 0 && (
                        <p>学生: ¥{liveInfo.studentPrice.toLocaleString()}</p>
                      )}
                      {liveInfo.deliveryFee > 0 && (
                        <p className="text-sm">
                          郵送料: ¥{liveInfo.deliveryFee.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* 会場画像 */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-lg overflow-hidden shadow-md">
                <Image
                  src="/images/venue.png"
                  alt="Lieto Posto - コンサート会場"
                  width={673}
                  height={506}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600 text-center">
                    会場の様子
                  </p>
                </div>
              </div>

              <div
                className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("パンフレット画像がクリックされました");
                  setIsModalOpen(true);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsModalOpen(true);
                  }
                }}
              >
                <Image
                  src={
                    liveInfo?.programImageUrl || "/images/concert-program.png"
                  }
                  alt="コンサートプログラム"
                  width={583}
                  height={830}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform pointer-events-none"
                />
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600 text-center">
                    コンサートプログラム（クリックで拡大）
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg text-center">
            <p className="text-sm text-amber-800">
              {liveInfo?.notes ||
                "詳細情報はお申し込み時にお問い合わせください"}
            </p>
          </div>
        </div>
      </div>

      {/* パンフレット画像モーダル */}
      <ImageModal
        src={liveInfo?.programImageUrl || "/images/concert-program.png"}
        alt="コンサートプログラム詳細"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
