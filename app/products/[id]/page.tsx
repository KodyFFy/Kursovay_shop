
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Star, 
  Key, 
  Shield, 
  Clock, 
  Download, 
  CreditCard,
  ArrowLeft,
  Check,
  Copy,
  Heart,
  Share2,
  MessageCircle,
  Loader2
} from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string
  category: {
    id: string
    name: string
  }
  isFeatured: boolean
  isActive: boolean
}

const reviews = [
  {
    id: '1',
    user: 'Алексей К.',
    rating: 5,
    date: '2024-01-15',
    comment: 'Отличный ключ, активировался без проблем. Быстрая доставка, рекомендую!'
  },
  {
    id: '2',
    user: 'Мария С.',
    rating: 5,
    date: '2024-01-10',
    comment: 'Все работает идеально. Купила для офиса, очень довольна покупкой.'
  },
  {
    id: '3',
    user: 'Дмитрий В.',
    rating: 4,
    date: '2024-01-08',
    comment: 'Хороший продукт, активация прошла успешно. Цена приемлемая.'
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('description')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Default product data for features and specifications
  const defaultFeatures = [
    'Пожизненная лицензия',
    'Официальный ключ',
    'Поддержка всех языков',
    'Техническая поддержка',
    'Мгновенная доставка',
    'Гарантия активации'
  ]

  const defaultSpecifications = {
    'Тип лицензии': 'Retail (BOX)',
    'Количество устройств': '1 ПК',
    'Срок действия': 'Пожизненно',
    'Языки': 'Все языки'
  }

  const defaultSystemRequirements = [
    'Современная операционная система',
    'Подключение к интернету для активации',
    'Свободное место на диске'
  ]

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        setError('Товар не найден')
      }
    } catch (error) {
      console.error('Failed to fetch product:', error)
      setError('Ошибка при загрузке товара')
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = () => {
    if (product) {
      console.log('Purchase product:', product.id, 'quantity:', quantity)
    }
  }

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка товара...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Key className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
            Товар не найден
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link
            href="/products"
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Вернуться к каталогу
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Breadcrumb */}
        <div className="mb-8 animate-fadeInUp">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Link href="/" className="hover:text-[var(--accent-primary)] transition-colors">
              Главная
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--accent-primary)] transition-colors">
              Каталог
            </Link>
            <span>/</span>
            <Link href={`/products?category=${product.category.name}`} className="hover:text-[var(--accent-primary)] transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)]">{product.title}</span>
          </nav>
        </div>

        {/* Back Button */}
        <div className="mb-8 animate-fadeInLeft">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Назад к каталогу
          </Link>
        </div>

        {/* Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="animate-fadeInLeft" style={{ animationDelay: '0.2s' }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-tertiary)] flex items-center justify-center">
              {product.imageUrl ? (
                <div className="relative w-full h-full">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Key className="w-24 h-24 text-[var(--text-muted)]" />
              )}
              {product.isFeatured && (
                <div className="absolute top-4 right-4">
                  <div className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    ХИТ
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 animate-fadeInRight" style={{ animationDelay: '0.3s' }}>
            <div>
              <span className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-sm font-semibold">
                {product.category.name}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              {product.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4
                        ? 'text-[var(--accent-warning)] fill-current'
                        : 'text-[var(--text-muted)]'
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-semibold text-[var(--text-primary)]">
                  4.8
                </span>
              </div>
              <span className="text-[var(--text-secondary)]">
                (отзывы)
              </span>
            </div>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[var(--accent-primary)]">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3">
              {defaultFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-[var(--text-secondary)]">{feature}</span>
                </div>
              ))}
            </div>

            {/* Purchase Section */}
            <div className="card-dark rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-[var(--text-primary)] font-medium">
                  Количество:
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="input-dark px-3 py-2 rounded-lg"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePurchase}
                  className="btn-primary flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Купить сейчас
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`p-4 rounded-xl transition-colors ${
                    isWishlisted
                      ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)] rounded-xl transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--accent-primary)]" />
                  Мгновенная доставка
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
                  Гарантия активации
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-[var(--accent-primary)]" />
                  Цифровая доставка
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="border-b border-[var(--border-primary)] mb-8">
            <nav className="flex gap-8">
              {[
                { id: 'description', label: 'Описание' },
                { id: 'specifications', label: 'Характеристики' },
                { id: 'requirements', label: 'Системные требования' },
                { id: 'reviews', label: 'Отзывы' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'description' && (
              <div className="animate-fadeInUp">
                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">
                  Подробное описание
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                  {product.description}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Windows 11 Pro предлагает все функции Windows 11 Home плюс важные бизнес-функции для шифрования, удаленного входа в систему, создания виртуальных машин и многого другого. Получите быстрый запуск, знакомое, но улучшенное меню "Пуск" и отличные новые способы быстрого выполнения задач, а также инновационные функции, такие как совершенно новый браузер Microsoft Edge и голосовой помощник Cortana.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="animate-fadeInUp">
                <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                  Технические характеристики
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(defaultSpecifications).map(([key, value]) => (
                    <div key={key} className="card-dark rounded-lg p-4">
                      <div className="font-semibold text-[var(--text-primary)] mb-1">
                        {key}
                      </div>
                      <div className="text-[var(--text-secondary)]">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requirements' && (
              <div className="animate-fadeInUp">
                <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                  Системные требования
                </h3>
                <div className="space-y-3">
                  {defaultSystemRequirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[var(--accent-primary)] mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--text-secondary)]">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="animate-fadeInUp">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    Отзывы покупателей
                  </h3>
                  <button className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Написать отзыв
                  </button>
                </div>
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="card-dark rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[var(--accent-primary)] rounded-full flex items-center justify-center text-[var(--bg-primary)] font-semibold">
                            {review.user.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-[var(--text-primary)]">
                              {review.user}
                            </div>
                            <div className="text-sm text-[var(--text-muted)]">
                              {new Date(review.date).toLocaleDateString('ru-RU')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-[var(--accent-warning)] fill-current'
                                  : 'text-[var(--text-muted)]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
