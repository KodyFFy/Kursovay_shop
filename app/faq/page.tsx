
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  HelpCircle, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  ShoppingCart,
  CreditCard,
  Key,
  Shield,
  RefreshCw
} from 'lucide-react'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  icon: React.ReactNode
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'Как создать аккаунт?',
    answer: 'Нажмите кнопку "Регистрация" в верхнем меню, заполните форму с email, именем пользователя и паролем. После регистрации вы сможете добавлять товары в корзину и совершать покупки.',
    category: 'account',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '2',
    question: 'Как найти нужный товар?',
    answer: 'Используйте поиск по названию в каталоге товаров, выберите нужную категорию (Игры, ПО, Антивирусы, Windows) или примените фильтры по цене. Также можете воспользоваться сортировкой по цене или рейтингу.',
    category: 'shopping',
    icon: <Search className="w-5 h-5" />
  },
  {
    id: '3',
    question: 'Как добавить товар в корзину?',
    answer: 'Найдите нужный товар в каталоге и нажмите кнопку "В корзину". Товар будет добавлен в вашу корзину. Для этого необходимо быть авторизованным в системе.',
    category: 'shopping',
    icon: <ShoppingCart className="w-5 h-5" />
  },
  {
    id: '4',
    question: 'Как пополнить баланс?',
    answer: 'Перейдите в раздел "Баланс" в вашем профиле, введите сумму пополнения и выберите способ оплаты (банковская карта МИР или Bitcoin). После подтверждения платежа средства поступят на ваш баланс.',
    category: 'payment',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: '5',
    question: 'Как оплатить заказ?',
    answer: 'Добавьте товары в корзину, перейдите к оформлению заказа и выберите оплату с баланса аккаунта. Убедитесь, что на балансе достаточно средств для покупки.',
    category: 'payment',
    icon: <CreditCard className="w-5 h-5" />
  },
  {
    id: '6',
    question: 'Где найти лицензионный ключ после покупки?',
    answer: 'После успешной оплаты лицензионный ключ появится в разделе "Мои заказы" в вашем профиле. Вы сможете скопировать ключ одним кликом.',
    category: 'orders',
    icon: <Key className="w-5 h-5" />
  },
  {
    id: '7',
    question: 'Что делать, если ключ не работает?',
    answer: 'Обратитесь в службу поддержки через раздел "Помощь" или напишите на support@keyshop.ru. Мы проверим ключ и предоставим замену или вернем средства.',
    category: 'support',
    icon: <RefreshCw className="w-5 h-5" />
  },
  {
    id: '8',
    question: 'Можно ли вернуть товар?',
    answer: 'Цифровые товары (лицензионные ключи) возврату не подлежат согласно законодательству. Однако если ключ оказался нерабочим, мы предоставим замену.',
    category: 'support',
    icon: <RefreshCw className="w-5 h-5" />
  },
  {
    id: '9',
    question: 'Безопасны ли платежи?',
    answer: 'Да, все платежи защищены современными методами шифрования. Мы не храним данные банковских карт и используем проверенные платежные системы.',
    category: 'security',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: '10',
    question: 'Как связаться с поддержкой?',
    answer: 'Вы можете связаться с нами через онлайн-чат, email (support@keyshop.ru) или телефон +7 (800) 123-45-67. Время работы: Пн-Пт 9:00-18:00, Сб-Вс 10:00-16:00 (МСК).',
    category: 'support',
    icon: <HelpCircle className="w-5 h-5" />
  }
]

const categories = [
  { id: 'all', name: 'Все вопросы', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'account', name: 'Аккаунт', icon: <Shield className="w-4 h-4" /> },
  { id: 'shopping', name: 'Покупки', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'payment', name: 'Оплата', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'orders', name: 'Заказы', icon: <Key className="w-4 h-4" /> },
  { id: 'support', name: 'Поддержка', icon: <HelpCircle className="w-4 h-4" /> },
  { id: 'security', name: 'Безопасность', icon: <Shield className="w-4 h-4" /> }
]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

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
            FAQ
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Часто задаваемые вопросы и ответы
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark w-full pl-10 pr-4 py-3 rounded-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-16 animate-fadeInUp">
              <HelpCircle className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
                Вопросы не найдены
              </h3>
              <p className="text-[var(--text-secondary)]">
                Попробуйте изменить поисковый запрос или выбрать другую категорию
              </p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <div
                key={item.id}
                className="card-dark rounded-xl overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[var(--accent-primary)]">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {item.question}
                    </h3>
                  </div>
                  <div className="text-[var(--text-secondary)]">
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>
                
                {openItems.includes(item.id) && (
                  <div className="px-6 pb-6">
                    <div className="pl-8 text-[var(--text-secondary)] leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 card-dark rounded-xl p-6 text-center animate-fadeInUp">
          <h3 className="text-xl font-bold mb-4 text-[var(--text-primary)]">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Обратитесь в службу поддержки, и мы поможем решить вашу проблему
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="btn-primary px-6 py-3 rounded-lg font-semibold"
            >
              Связаться с поддержкой
            </Link>
            <Link
              href="/contacts"
              className="btn-secondary px-6 py-3 rounded-lg font-semibold"
            >
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
