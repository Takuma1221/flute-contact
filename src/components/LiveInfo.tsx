import { Calendar, Clock, MapPin, Music } from "lucide-react";

export function LiveInfo() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
          Live Information
        </h2>

        {/* ライブ詳細 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* 基本情報 */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">開催概要</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">開催日</p>
                  <p className="text-gray-600">2025年10月4日（土）</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">開演時間</p>
                  <p className="text-gray-600">
                    ①14:00開演（13:30開場）
                    <br />
                    ②18:00開演（17:30開場）
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <p className="font-medium text-gray-900">会場</p>
                  <p className="text-gray-600">
                    Lieto Posto（リエト・ポスト）
                    <br />
                    <span className="text-sm">※詳細住所は予約後にご案内</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 料金情報 */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-medium text-gray-900 mb-6">
              チケット料金
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-700">前席（1-3列目）</span>
                <span className="font-medium text-gray-900">¥3,500</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-700">中席（4-6列目）</span>
                <span className="font-medium text-gray-900">¥3,000</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-700">後席（7列目以降）</span>
                <span className="font-medium text-gray-900">¥2,500</span>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                ※全席自由席（当日先着順）
                <br />
                ※未就学児の入場はご遠慮ください
              </p>
            </div>
          </div>
        </div>

        {/* プログラム */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <Music className="h-6 w-6 text-amber-600" />
            <h3 className="text-xl font-medium text-gray-900">プログラム</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">第1部</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• J.S.バッハ：フルートソナタ</li>
                <li>• モーツァルト：フルート協奏曲より</li>
                <li>• ドビュッシー：シリンクス</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">第2部</h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• フォーレ：幻想曲</li>
                <li>• プーランク：フルートソナタ</li>
                <li>• 日本の歌メドレー</li>
              </ul>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            ※プログラムは変更になる場合がございます
          </p>
        </div>
      </div>
    </section>
  );
}
