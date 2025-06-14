
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Key,
  Loader2
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        setError('Требуется авторизация')
        return
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.cartItems)
        setTotal(data.total)
      } else {
        setError('Ошибка загрузки корзины')
      }
    } catch (error) {
      console.error('Fetch cart error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdating(itemId)
      const token = localStorage.getItem('token')

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        await fetchCart() // Перезагружаем корзину
      } else {
        setError('Ошибка обновления количества')
      }
    } catch (error) {
      console.error('Update quantity error:', error)
      setError('Ошибка обновления количества')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      setUpdating(itemId)
      const token = localStorage.getItem('token')

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchCart() // Перезагружаем корзину
      } else {
        setError('Ошибка удаления товара')
      }
    } catch (error) {
      console.error('Remove item error:', error)
      setError('Ошибка удаления товара')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка корзины...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
            Ошибка загрузки
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <Link
            href="/login"
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Войти в аккаунт
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/products"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к каталогу
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <ShoppingCart className="w-10 h-10" />
            Корзина
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            {cartItems.length > 0 
              ? `${cartItems.length} товар${cartItems.length > 1 ? 'а' : ''} в корзине`
              : 'Ваша корзина пуста'
            }
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp">
            <ShoppingCart className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              Корзина пуста
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Link
              href="/products"
              className="btn-primary px-6 py-3 rounded-lg"
            >
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className="card-dark rounded-xl p-6 animate-fadeInUp hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-lg">
                      {item.product.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[var(--bg-tertiary)] flex items-center justify-center">
                          <Key className="w-8 h-8 text-[var(--text-muted)]" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                            {item.product.category.name}
                          </span>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {updating === item.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">
                        {item.product.title}
                      </h3>
                      
                      <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                        {item.product.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || updating === item.id}
                            className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="text-lg font-semibold text-[var(--text-primary)] min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--accent-primary)] hover:text-[var(--bg-primary)] transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[var(--accent-primary)]">
                            {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-[var(--text-secondary)]">
                              {item.product.price.toLocaleString('ru-RU')} ₽ за шт.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card-dark rounded-xl p-6 sticky top-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                  Итого к оплате
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Товары ({cartItems.length})</span>
                    <span>{total.toLocaleString('ru-RU')} ₽</span>
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
                
                <Link
                  href="/checkout"
                  className="btn-primary w-full py-4 rounded-lg text-center font-semibold text-lg"
                >
                  Оформить заказ
                </Link>
                
                <div className="mt-4 text-center">
                  <Link
                    href="/products"
                    className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors text-sm"
                  >
                    Продолжить покупки
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
