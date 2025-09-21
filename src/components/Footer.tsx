import { Instagram, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 講師情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">吉原りえ</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              フルーティスト
              <br />
              上野学園大学音楽学部器楽学科フルート専門卒業
              <br />
              Lieto Posto主宰
            </p>
          </div>

          {/* 会場情報 */}
          <div>
            <h3 className="text-lg font-medium mb-4">Lieto Posto</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              岡山県笠岡市
              <br />
              ※詳細住所は予約後にご案内いたします
            </p>
          </div>

          {/* 連絡先 */}
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <a
                  href="mailto:contact@lietoposto.com"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  contact@lietoposto.com
                </a>
              </div>

              <div className="flex items-center space-x-3">
                <Instagram className="h-4 w-4 text-gray-400" />
                <a
                  href="https://www.instagram.com/lieto_posto/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  @lieto_posto
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Rie Yoshihara All Rights Reserved.
            </p>

            <div className="mt-4 md:mt-0">
              <a
                href="https://lietoposto.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 text-sm hover:text-white transition-colors"
              >
                lietoposto.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
