"use client";

import { ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

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
}

export function Hero() {
  const [liveInfo, setLiveInfo] = useState<LiveInfoData | null>(null);

  const scrollToReservation = () => {
    const element = document.getElementById("reservation");
    element?.scrollIntoView({ behavior: "smooth" });
  };

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
      }
    };

    fetchLiveInfo();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/hero-background.png')",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in">
        {/* メインタイトル */}
        <div className="mb-8 text-center">
          <div className="mb-6">
            <Image
              src="/images/flutist-profile.png"
              alt="吉原りえ"
              width={358}
              height={540}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto shadow-lg border-4 border-white/20 object-cover"
              style={{ objectPosition: 'center 25%' }}
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 text-shadow">
            吉原りえ
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light">
            フルーティスト
          </p>
        </div>

        {/* ライブ情報 */}
        <div className="mb-12 p-8 bg-white/10 backdrop-blur-md rounded-lg shadow-lg max-w-2xl mx-auto border border-white/20">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
            フルートリサイタル Vol.19
          </h2>
          <div className="text-lg text-white/90 space-y-2">
            <p className="font-medium text-white">
              {liveInfo?.liveDate || "日程調整中"}
            </p>
            <p className="text-white/90">
              {liveInfo?.liveTime1 && `${liveInfo.liveTime1}開演`}
              {liveInfo?.liveTime2 && ` / ${liveInfo.liveTime2}開演`}
              {!liveInfo?.liveTime1 && "時間調整中"}
            </p>
            <p className="text-sm text-white/80">
              会場: {liveInfo?.venue || "会場調整中"}
            </p>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="space-y-4">
          <button
            onClick={scrollToReservation}
            className="inline-flex items-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-full transition-colors duration-200 text-lg shadow-lg hover:shadow-xl"
          >
            チケット予約
          </button>
          <div className="text-sm text-white/70">
            {liveInfo && liveInfo.studentPrice > 0 && liveInfo.generalPrice > 0
              ? `¥${Math.min(
                  liveInfo.studentPrice,
                  liveInfo.generalPrice
                ).toLocaleString()}〜 | 残席わずか`
              : "料金調整中"}
          </div>
        </div>

        {/* スクロール案内 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
}
