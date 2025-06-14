
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Лицензионные ключи
            </span>
            <br />
            <span className="text-white">для игр и программ</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Быстро, надежно, выгодно
          </p>
          <Link href="/products" className="bg-green-500 text-black px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center gap-3 hover:bg-green-400 transition-colors">
            Перейти в каталог
          </Link>
        </section>

        {/* Categories */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Категории товаров
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Игры</h3>
              <p className="text-gray-300 mb-6">Steam, Origin, Epic Games и другие платформы</p>
              <Link href="/products?category=games" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                Смотреть товары
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Программное обеспечение</h3>
              <p className="text-gray-300 mb-6">Office, Adobe, разработка и дизайн</p>
              <Link href="/products?category=software" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                Смотреть товары
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Антивирусы</h3>
              <p className="text-gray-300 mb-6">Kaspersky, ESET, Norton и другие</p>
              <Link href="/products?category=antivirus" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                Смотреть товары
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-8 text-center hover:bg-gray-700 transition-colors">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">OS</h3>
              <p className="text-gray-300 mb-6">Операционные системы и сборки</p>
              <Link href="/products?category=windows" className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-green-500 hover:text-black transition-colors">
                Смотреть товары
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-20 bg-gray-900 rounded-2xl p-8">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Рекомендуемые товары
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="p-6">
                <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold">Windows</span>
                <h3 className="text-lg font-bold mt-3 mb-2 text-white">Windows 11 Pro</h3>
                <p className="text-gray-300 text-sm mb-4">Лицензионный ключ Windows 11 Professional</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">2,999 ₽</span>
                  <Link href="/products" className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors">
                    В каталог
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="p-6">
                <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold">ПО</span>
                <h3 className="text-lg font-bold mt-3 mb-2 text-white">Microsoft Office 2021</h3>
                <p className="text-gray-300 text-sm mb-4">Полный пакет Office 2021 Professional Plus</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">4,999 ₽</span>
                  <Link href="/products" className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors">
                    В каталог
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="p-6">
                <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold">Игры</span>
                <h3 className="text-lg font-bold mt-3 mb-2 text-white">Cyberpunk 2077</h3>
                <p className="text-gray-300 text-sm mb-4">Steam ключ для популярной RPG игры</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">1,999 ₽</span>
                  <Link href="/products" className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors">
                    В каталог
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors">
              <div className="h-48 bg-gray-700 flex items-center justify-center">
                <span className="text-4xl">🔑</span>
              </div>
              <div className="p-6">
                <span className="bg-green-500 text-black px-3 py-1 rounded-full text-xs font-semibold">Антивирусы</span>
                <h3 className="text-lg font-bold mt-3 mb-2 text-white">Kaspersky Internet Security</h3>
                <p className="text-gray-300 text-sm mb-4">Защита для 3 устройств на 1 год</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">1,499 ₽</span>
                  <Link href="/products" className="bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition-colors">
                    В каталог
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Мгновенная доставка</h3>
              <p className="text-gray-300">Получите ключ сразу после оплаты</p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">100% лицензионные ключи</h3>
              <p className="text-gray-300">Только официальные лицензии</p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Удобная оплата</h3>
              <p className="text-gray-300">МИР и Bitcoin</p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎧</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Поддержка 24/7</h3>
              <p className="text-gray-300">Всегда готовы помочь</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
