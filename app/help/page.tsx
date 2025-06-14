
'use client'

import Link from 'next/link'
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ArrowLeft,
  Search,
  ShoppingCart,
  CreditCard,
  Key
} from 'lucide-react'

export default function HelpPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              На главную
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <HelpCircle className="w-10 h-10" />
            Помощь
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Ответы на часто задаваемые вопросы и руководства
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Help */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Быстрая помощь
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <Search className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Как найти товар?
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Используйте поиск по названию или выберите категорию в каталоге. 
                      Также можно применить фильтры по цене.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Как добавить товар в корзину?
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Нажмите кнопку "В корзину" на странице товара. 
                      Для этого необходимо быть авторизованным.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <CreditCard className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Как оплатить заказ?
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm">
                      Пополните баланс аккаунта и оплачивайте покупки с него. 
                      Поддерживаются карты МИР и Bitcoin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg">
                  <Key className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Где найти лицензионный ключ?
                    </h4>
                    <p className="text-[var(--text-secondary)] text-sm">
                      После успешной оплаты ключ появится в разделе "Мои заказы" 
                      в вашем профиле.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Связаться с поддержкой
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer">
                  <MessageCircle className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      Онлайн-чат
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Быстрые ответы на вопросы
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer">
                  <Mail className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      Email поддержка
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      support@keyshop.ru
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer">
                  <Phone className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">
                      Телефон
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      +7 (800) 123-45-67
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 text-sm">
                  <strong>Время работы поддержки:</strong><br />
                  Пн-Пт: 9:00 - 18:00 (МСК)<br />
                  Сб-Вс: 10:00 - 16:00 (МСК)
                </div>
              </div>
            </div>

            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                Полезные ссылки
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/faq"
                  className="block p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <div className="font-medium text-[var(--text-primary)]">FAQ</div>
                  <div className="text-sm text-[var(--text-secondary)]">Часто задаваемые вопросы</div>
                </Link>
                
                <Link
                  href="/terms"
                  className="block p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <div className="font-medium text-[var(--text-primary)]">Условия использования</div>
                  <div className="text-sm text-[var(--text-secondary)]">Правила и условия</div>
                </Link>
                
                <Link
                  href="/contacts"
                  className="block p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <div className="font-medium text-[var(--text-primary)]">Контакты</div>
                  <div className="text-sm text-[var(--text-secondary)]">Наши контактные данные</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
