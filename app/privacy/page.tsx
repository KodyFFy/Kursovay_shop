
'use client'

import Link from 'next/link'
import { 
  Shield, 
  ArrowLeft,
  Eye,
  Lock,
  Database,
  UserCheck
} from 'lucide-react'

export default function PrivacyPage() {
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
            <Shield className="w-10 h-10" />
            Политика конфиденциальности
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Как мы собираем, используем и защищаем ваши данные
          </p>
        </div>

        <div className="space-y-8">
          {/* Data Collection */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                1. Сбор информации
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Мы собираем информацию, которую вы предоставляете нам при регистрации 
                и использовании нашего сервиса:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email адрес и имя пользователя при регистрации</li>
                <li>Информация о платежах и транзакциях</li>
                <li>История покупок и предпочтения</li>
                <li>Техническая информация о вашем устройстве и браузере</li>
                <li>IP-адрес и данные о местоположении</li>
              </ul>
            </div>
          </div>

          {/* Data Usage */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                2. Использование данных
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Мы используем собранную информацию для следующих целей:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Предоставление и улучшение наших услуг</li>
                <li>Обработка платежей и доставка лицензионных ключей</li>
                <li>Связь с вами по вопросам поддержки</li>
                <li>Персонализация контента и рекомендаций</li>
                <li>Предотвращение мошенничества и обеспечение безопасности</li>
                <li>Соблюдение правовых требований</li>
              </ul>
            </div>
          </div>

          {/* Data Protection */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                3. Защита данных
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Мы принимаем серьезные меры для защиты ваших персональных данных:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Шифрование данных при передаче и хранении</li>
                <li>Регулярные аудиты безопасности</li>
                <li>Ограниченный доступ к данным только для авторизованного персонала</li>
                <li>Использование безопасных платежных систем</li>
                <li>Регулярное обновление систем безопасности</li>
              </ul>
              <p>
                Мы не храним данные банковских карт на наших серверах. Вся платежная 
                информация обрабатывается через сертифицированные платежные системы.
              </p>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                4. Передача данных третьим лицам
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Мы не продаем и не передаем ваши персональные данные третьим лицам, 
                за исключением следующих случаев:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Платежные системы для обработки транзакций</li>
                <li>Поставщики технических услуг (хостинг, аналитика)</li>
                <li>Правоохранительные органы при наличии законных требований</li>
                <li>При слиянии или продаже компании (с уведомлением пользователей)</li>
              </ul>
              <p>
                Все третьи лица обязаны соблюдать конфиденциальность и использовать 
                данные только для указанных целей.
              </p>
            </div>
          </div>

          {/* User Rights */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                5. Ваши права
              </h2>
            </div>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                В соответствии с законодательством о защите персональных данных, 
                вы имеете право:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Получать информацию о том, какие данные мы о вас храним</li>
                <li>Запрашивать исправление неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Ограничивать обработку ваших данных</li>
                <li>Получать копию ваших данных в машиночитаемом формате</li>
                <li>Отзывать согласие на обработку данных</li>
              </ul>
              <p>
                Для реализации этих прав обращайтесь к нам по адресу privacy@keyshop.ru
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              6. Файлы cookie
            </h2>
            <div className="text-[var(--text-secondary)] space-y-4 leading-relaxed">
              <p>
                Мы используем файлы cookie для улучшения работы сайта и персонализации 
                вашего опыта. Cookie помогают нам:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Запоминать ваши предпочтения и настройки</li>
                <li>Анализировать использование сайта</li>
                <li>Обеспечивать безопасность аккаунта</li>
                <li>Показывать релевантную рекламу</li>
              </ul>
              <p>
                Вы можете управлять cookie через настройки браузера, но это может 
                повлиять на функциональность сайта.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              7. Контактная информация
            </h2>
            <div className="text-[var(--text-secondary)] space-y-2">
              <p>По вопросам конфиденциальности обращайтесь:</p>
              <p><strong>Email:</strong> privacy@keyshop.ru</p>
              <p><strong>Телефон:</strong> +7 (800) 123-45-67</p>
              <p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123</p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center text-[var(--text-muted)] text-sm animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
            <p>Последнее обновление: 14 июня 2025 года</p>
            <p className="mt-2">
              Мы можем обновлять эту политику конфиденциальности. Изменения будут 
              опубликованы на этой странице с указанием даты последнего обновления.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
