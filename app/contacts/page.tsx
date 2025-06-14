
'use client'

import Link from 'next/link'
import { 
  MapPin, 
  Mail, 
  Phone, 
  Clock,
  ArrowLeft,
  MessageCircle
} from 'lucide-react'

export default function ContactsPage() {
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
            <Phone className="w-10 h-10" />
            Контакты
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Свяжитесь с нами любым удобным способом
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Контактная информация
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Адрес
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      г. Москва, Россия<br />
                      ул. Примерная, д. 123, оф. 456
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Телефон
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      <a href="tel:+78001234567" className="hover:text-[var(--accent-primary)] transition-colors">
                        +7 (800) 123-45-67
                      </a><br />
                      <span className="text-sm text-[var(--text-muted)]">Бесплатный звонок по России</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Email
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      <a href="mailto:support@keyshop.ru" className="hover:text-[var(--accent-primary)] transition-colors">
                        support@keyshop.ru
                      </a><br />
                      <span className="text-sm text-[var(--text-muted)]">Техническая поддержка</span>
                    </p>
                    <p className="text-[var(--text-secondary)] mt-2">
                      <a href="mailto:sales@keyshop.ru" className="hover:text-[var(--accent-primary)] transition-colors">
                        sales@keyshop.ru
                      </a><br />
                      <span className="text-sm text-[var(--text-muted)]">Отдел продаж</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                      Время работы
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      <strong>Понедельник - Пятница:</strong><br />
                      9:00 - 18:00 (МСК)<br /><br />
                      <strong>Суббота - Воскресенье:</strong><br />
                      10:00 - 16:00 (МСК)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Быстрая связь
              </h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors">
                  <MessageCircle className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div className="text-left">
                    <div className="font-semibold text-[var(--text-primary)]">
                      Онлайн-чат
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      Мгновенные ответы на вопросы
                    </div>
                  </div>
                </button>

                <a 
                  href="tel:+78001234567"
                  className="w-full flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <Phone className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div className="text-left">
                    <div className="font-semibold text-[var(--text-primary)]">
                      Позвонить
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      +7 (800) 123-45-67
                    </div>
                  </div>
                </a>

                <a 
                  href="mailto:support@keyshop.ru"
                  className="w-full flex items-center gap-4 p-4 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <Mail className="w-6 h-6 text-[var(--accent-primary)]" />
                  <div className="text-left">
                    <div className="font-semibold text-[var(--text-primary)]">
                      Написать email
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      support@keyshop.ru
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                Часто задаваемые вопросы
              </h3>
              
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                Возможно, ответ на ваш вопрос уже есть в нашем разделе FAQ.
              </p>
              
              <Link
                href="/faq"
                className="btn-secondary w-full py-3 rounded-lg text-center font-semibold"
              >
                Посмотреть FAQ
              </Link>
            </div>

            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                Социальные сети
              </h3>
              
              <p className="text-[var(--text-secondary)] text-sm mb-4">
                Следите за новостями и акциями в наших социальных сетях.
              </p>
              
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer">
                  <span className="text-sm font-bold">VK</span>
                </div>
                <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer">
                  <span className="text-sm font-bold">TG</span>
                </div>
                <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors cursor-pointer">
                  <span className="text-sm font-bold">YT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
