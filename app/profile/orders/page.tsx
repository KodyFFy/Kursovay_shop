
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  ShoppingBag, 
  ArrowLeft,
  Key,
  Loader2,
  Copy,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'

interface Order {
  id: string
  amount: number
  status: string
  paymentMethod: string
  licenseKey?: string
  createdAt: string
  product: {
    id: string
    title: string
    description: string
    imageUrl?: string
    category: {
      name: string
    }
  }
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
      } else {
        setError('Ошибка загрузки заказов')
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const copyLicenseKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch (error) {
      console.error('Copy error:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-[var(--text-muted)]" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Завершен'
      case 'PENDING':
        return 'В обработке'
      case 'FAILED':
        return 'Отклонен'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-400'
      case 'PENDING':
        return 'text-yellow-400'
      case 'FAILED':
        return 'text-red-400'
      default:
        return 'text-[var(--text-muted)]'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка заказов...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
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
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад к профилю
            </Link>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <ShoppingBag className="w-10 h-10" />
            Мои заказы
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            {orders.length > 0 
              ? `${orders.length} заказ${orders.length > 1 ? 'а' : ''}`
              : 'У вас пока нет заказов'
            }
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 animate-fadeInUp">
            <ShoppingBag className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              Заказы отсутствуют
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Оформите первый заказ в нашем каталоге
            </p>
            <Link
              href="/products"
              className="btn-primary px-6 py-3 rounded-lg"
            >
              Перейти к каталогу
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={order.id}
                className="card-dark rounded-xl p-6 animate-fadeInUp hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex gap-6">
                  <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-lg">
                    {order.product.imageUrl ? (
                      <Image
                        src={order.product.imageUrl}
                        alt={order.product.title}
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
                          {order.product.category.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(order.status)}
                          <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(order.createdAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">
                      {order.product.title}
                    </h3>
                    
                    <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed">
                      {order.product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[var(--accent-primary)]">
                        {order.amount.toLocaleString('ru-RU')} ₽
                      </div>
                      
                      {order.status === 'COMPLETED' && order.licenseKey && (
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-sm text-[var(--text-secondary)] mb-1">
                              Лицензионный ключ:
                            </div>
                            <div className="font-mono text-sm bg-[var(--bg-tertiary)] px-3 py-2 rounded border">
                              {order.licenseKey}
                            </div>
                          </div>
                          <button
                            onClick={() => copyLicenseKey(order.licenseKey!)}
                            className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                            title="Скопировать ключ"
                          >
                            {copiedKey === order.licenseKey ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <Copy className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
