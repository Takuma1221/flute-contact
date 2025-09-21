"use client";

import { ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToReservation = () => {
    const element = document.getElementById("reservation");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient">
      <div className="max-w-4xl mx-auto px-6 text-center animate-fade-in">
        {/* メインタイトル */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-4 text-shadow">
            吉原りえ
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            フルーティスト
          </p>
        </div>

        {/* ライブ情報 */}
        <div className="mb-12 p-8 glass-effect rounded-lg shadow-lg max-w-2xl mx-auto border border-white/20">
          <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-4">
            フルートリサイタル Vol.19
          </h2>
          <div className="text-lg text-gray-700 space-y-2">
            <p className="font-medium">2025年10月4日（土）</p>
            <p>14:00開演 / 18:00開演</p>
            <p className="text-sm text-gray-600">
              会場: Lieto Posto（リエト・ポスト）
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
          <div className="text-sm text-gray-500">¥2,500〜 | 残席わずか</div>
        </div>

        {/* スクロール案内 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-gray-400" />
        </div>
      </div>
    </section>
  );
}
