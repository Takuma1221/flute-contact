import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-light text-gray-900 text-center mb-12">
          プライバシーポリシー
        </h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">
            この予約フォームを通じてご提供いただく氏名・メールアドレスなどの個人情報は、以下の目的にのみ使用いたします。
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              1. 利用目的
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>本コンサートの予約受付・確認のご連絡</li>
              <li>当日のご案内や緊急時のご連絡</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              2. 管理体制
            </h2>
            <p className="text-gray-600 leading-relaxed">
              取得した個人情報は、適切な管理のもと、漏洩などが起こらないよう努めます。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              3. 第三者提供について
            </h2>
            <p className="text-gray-600 leading-relaxed">
              法令に基づく場合を除き、取得した個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              4. お問い合わせ
            </h2>
            <p className="text-gray-600 leading-relaxed">
              ご提供いただいた情報の開示・訂正・削除等をご希望される場合は、以下の連絡先までご連絡ください。
            </p>
          </section>

          <section className="mb-8 bg-amber-50 p-6 rounded-lg border border-amber-100">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              【お問い合わせ先】
            </h3>
            <p className="text-gray-900 font-medium">吉原りえ</p>
            <p className="text-gray-600 mt-2">
              Email:{" "}
              <a
                href="mailto:fueneko5656@gmail.com"
                className="text-amber-600 hover:text-amber-700 underline"
              >
                fueneko5656@gmail.com
              </a>
            </p>
          </section>

          <div className="text-center mt-12">
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full transition-colors duration-200"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
