
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  CreditCard, 
  Wallet, 
  Bitcoin,
  ArrowLeft,
  Key,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface CartItem {
  id: string
  quantity: number
  product: {
    id: string
    title: string
    description: string
    price: number
    imageUrl?: string
    category: {
      name: string
    }
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [balance, setBalance] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('balance')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      // Загружаем корзину и баланс параллельно
      const [cartResponse, balanceResponse] = await Promise.all([
        fetch('/api/cart', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/balance', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (cartResponse.ok) {
        const cartData = await cartResponse.json()
        setCartItems(cartData.cartItems)
        setTotal(cartData.total)
        
        if (cartData.cartItems.length === 0) {
          router.push('/cart')
          return
        }
      }

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json()
        setBalance(balanceData.balance)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckout = async () => {
    try {
      setProcessing(true)
      setError('')
      
      const token = localStorage.getItem('token')

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentMethod })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile/orders')
        }, 3000)
      } else {
        setError(data.error || 'Ошибка оформления заказа')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeInUp">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-[var(--text-primary)]">
            Заказ успешно оформлен!
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Лицензионные ключи отправлены в ваш профиль
          </p>
          <div className="text-sm text-[var(--text-muted)]">
            Перенаправление через 3 секунды...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/cart"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к корзине
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <CreditCard className="w-10 h-10" />
            Оформление заказа
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Способ оплаты
              </h3>
              
              <div className="space-y-4">
                {/* Balance Payment */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'balance'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                  }`}
                  onClick={() => setPaymentMethod('balance')}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-[var(--accent-primary)]" />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        Баланс аккаунта
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Доступно: {balance.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'balance'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                        : 'border-[var(--border-primary)]'
                    }`} />
                  </div>
                  {balance < total && (
                    <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Недостаточно средств. Нужно пополнить на {(total - balance).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Payment */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-[var(--accent-primary)]" />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        Банковская карта МИР
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Visa, MasterCard, МИР
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'card'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                        : 'border-[var(--border-primary)]'
                    }`} />
                  </div>
                </div>

                {/* Bitcoin Payment */}
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    paymentMethod === 'bitcoin'
                      ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                      : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'
                  }`}
                  onClick={() => setPaymentMethod('bitcoin')}
                >
                  <div className="flex items-center gap-3">
                    <Bitcoin className="w-6 h-6 text-[var(--accent-primary)]" />
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)]">
                        Bitcoin
                      </div>
                      <div className="text-sm text-[var(--text-secondary)]">
                        Криптовалютная оплата
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'bitcoin'
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]'
                        : 'border-[var(--border-primary)]'
                    }`} />
                  </div>
                </div>
              </div>

              {paymentMethod === 'balance' && balance >= total && (
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="btn-primary w-full py-4 rounded-lg font-semibold text-lg disabled:opacity-50"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Обработка...
                      </div>
                    ) : (
                      `Оплатить ${total.toLocaleString('ru-RU')} ₽`
                    )}
                  </button>
                </div>
              )}

              {paymentMethod !== 'balance' && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="text-blue-400 text-sm text-center">
                    Интеграция с платежными системами будет добавлена в следующих версиях
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Ваш заказ
              </h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-lg">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--bg-tertiary)] flex items-center justify-center">
                          <Key className="w-6 h-6 text-[var(--text-muted)]" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] text-sm">
                        {item.product.title}
                      </h4>
                      <div className="text-xs text-[var(--text-secondary)] mt-1">
                        {item.quantity} × {item.product.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-[var(--accent-primary)]">
                        {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-[var(--border-primary)] pt-4">
                <div className="flex justify-between text-xl font-bold text-[var(--text-primary)]">
                  <span>Итого:</span>
                  <span className="text-[var(--accent-primary)]">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </div>

            {paymentMethod === 'balance' && balance < total && (
              <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                  Пополнить баланс
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4">
                  Для оплаты заказа необходимо пополнить баланс на {(total - balance).toLocaleString('ru-RU')} ₽
                </p>
                <Link
                  href="/profile/balance"
                  className="btn-secondary w-full py-3 rounded-lg text-center font-semibold"
                >
                  Пополнить баланс
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
