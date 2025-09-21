export function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* プロフィール画像 */}
          <div className="order-2 lg:order-1">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg shadow-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-32 h-32 bg-slate-300 rounded-full mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">フルーティスト 吉原りえ</p>
              </div>
            </div>
          </div>

          {/* プロフィールテキスト */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-8">
              Profile
            </h2>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                岡山県笠岡市出身。上野学園大学音楽学部器楽学科フルート専門卒業。
                フルートを青木明、遠藤剛史の各氏に師事。
              </p>

              <p>
                ソロ、室内楽、スタジオなどで活躍中。美しい音色と表現豊かな演奏で、
                多くの聴衆を魅了し続けている。
              </p>

              <p>
                現在は「Lieto
                Posto」を拠点に、コンサート活動や音楽教育に力を注いでいる。
                「Lieto Posto」はイタリア語で「楽しい場所」という意味で、
                音楽を通じて人々に喜びを届けることを信念としている。
              </p>
            </div>

            {/* 実績 */}
            <div className="mt-8 p-6 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Recent Activities
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 西武鉄道「旅するレストラン 52席の至福」車内ライヴ出演</li>
                <li>• ふえねこアンサンブル主宰</li>
                <li>• 定期リサイタル開催（年2回）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
