
'use client'

import Link from 'next/link'
import { 
  FileText, 
  ArrowLeft,
  Shield,
  CreditCard,
  Key,
  AlertTriangle
} from 'lucide-react'

export default function TermsPage() {
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
            <FileText className="w-10 h-10" />
            Условия использования
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Правила и условия использования сервиса KeyShop
          </p>
        </div>

        <div className="space-y-8">
          {/* General Terms */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                1. Общие положения
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Настоящие Условия использования регулируют отношения между пользователем 
                и сервисом KeyShop при использовании платформы для покупки лицензионных 
                ключей программного обеспечения и игр.
              </p>
              <p>
                Используя наш сервис, вы соглашаетесь с данными условиями. Если вы не 
                согласны с какими-либо условиями, пожалуйста, не используйте наш сервис.
              </p>
              <p>
                Мы оставляем за собой право изменять данные условия в любое время. 
                Изменения вступают в силу с момента их публикации на сайте.
              </p>
            </div>
          </div>

          {/* Account Terms */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                2. Регистрация и аккаунт
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Для совершения покупок необходимо создать аккаунт, предоставив достоверную 
                информацию. Вы несете ответственность за сохранность данных для входа.
              </p>
              <p>
                Запрещается создание нескольких аккаунтов одним лицом, передача аккаунта 
                третьим лицам, а также использование аккаунта в мошеннических целях.
              </p>
              <p>
                Мы оставляем за собой право заблокировать аккаунт при нарушении условий 
                использования или подозрении в мошеннической деятельности.
              </p>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                3. Оплата и возврат средств
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Оплата производится через пополнение баланса аккаунта с использованием 
                банковских карт МИР или криптовалюты Bitcoin. Все цены указаны в рублях.
              </p>
              <p>
                Цифровые товары (лицензионные ключи) возврату не подлежат согласно 
                действующему законодательству РФ, за исключением случаев предоставления 
                нерабочего ключа.
              </p>
              <p>
                В случае технических проблем с ключом мы предоставим замену или вернем 
                средства на баланс аккаунта в течение 24 часов после обращения.
              </p>
            </div>
          </div>

          {/* Product Terms */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                4. Лицензионные ключи
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Все продаваемые ключи являются лицензионными и приобретены у официальных 
                дистрибьюторов. Мы гарантируем их подлинность и работоспособность.
              </p>
              <p>
                Ключи предоставляются в цифровом виде и доступны в личном кабинете 
                сразу после успешной оплаты. Физическая доставка не осуществляется.
              </p>
              <p>
                Покупатель обязуется использовать ключи в соответствии с лицензионным 
                соглашением правообладателя программного обеспечения.
              </p>
            </div>
          </div>

          {/* Liability */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                5. Ответственность
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Сервис предоставляется "как есть". Мы не несем ответственности за 
                косвенные убытки, возникшие в результате использования наших услуг.
              </p>
              <p>
                Пользователь несет полную ответственность за соблюдение авторских прав 
                и лицензионных соглашений при использовании приобретенного ПО.
              </p>
              <p>
                Максимальная ответственность сервиса ограничивается суммой, уплаченной 
                пользователем за конкретный товар.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              6. Контактная информация
            </h2>
            <div className="text-[var(--text-secondary)] space-y-2">
              <p>По вопросам, связанным с условиями использования, обращайтесь:</p>
              <p><strong>Email:</strong> legal@keyshop.ru</p>
              <p><strong>Телефон:</strong> +7 (800) 123-45-67</p>
              <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-[var(--text-muted)] text-sm animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <p>Последнее обновление: 14 июня 2025 года</p>
          </div>
        </div>
      </div>
    </div>
  )
}
