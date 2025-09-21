import Image from "next/image";

export function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 animate-slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* プロフィール画像 */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="aspect-square rounded-lg shadow-lg overflow-hidden">
                <Image
                  src="/images/flutist-profile.png"
                  alt="フルーティスト 吉原りえ"
                  width={358}
                  height={540}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              {/* フルートの装飾画像 */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 md:w-36 md:h-36 rounded-full bg-white shadow-lg p-3">
                <Image
                  src="/images/flute-instrument.png"
                  alt="フルート"
                  width={1920}
                  height={819}
                  className="w-full h-full object-cover rounded-full"
                />
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
