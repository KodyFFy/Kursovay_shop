
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Wallet, 
  ShoppingBag, 
  Settings,
  LogOut,
  Loader2
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  username: string
  balance: number
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setError('Ошибка загрузки профиля')
      }
    } catch (error) {
      console.error('Fetch profile error:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка профиля...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text flex items-center gap-3">
            <User className="w-10 h-10" />
            Профиль
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Управление аккаунтом и заказами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="card-dark rounded-xl p-6 animate-fadeInUp">
              <h3 className="text-xl font-bold mb-6 text-[var(--text-primary)]">
                Информация об аккаунте
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                    Имя пользователя
                  </label>
                  <div className="input-dark px-4 py-3 rounded-lg bg-[var(--bg-tertiary)]">
                    {user.username}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                    Email
                  </label>
                  <div className="input-dark px-4 py-3 rounded-lg bg-[var(--bg-tertiary)]">
                    {user.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                    Дата регистрации
                  </label>
                  <div className="input-dark px-4 py-3 rounded-lg bg-[var(--bg-tertiary)]">
                    {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-[var(--accent-primary)]" />
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Баланс
                </h3>
              </div>
              
              <div className="text-3xl font-bold text-[var(--accent-primary)] mb-4">
                {user.balance.toLocaleString('ru-RU')} ₽
              </div>
              
              <Link
                href="/profile/balance"
                className="btn-primary w-full py-3 rounded-lg text-center font-semibold"
              >
                Пополнить
              </Link>
            </div>

            {/* Quick Links */}
            <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-bold mb-4 text-[var(--text-primary)]">
                Быстрые действия
              </h3>
              
              <div className="space-y-3">
                <Link
                  href="/profile/orders"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-[var(--text-primary)]">Мои заказы</span>
                </Link>
                
                <Link
                  href="/profile/settings"
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
                >
                  <Settings className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span className="text-[var(--text-primary)]">Настройки</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-tertiary)] hover:bg-red-500/10 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-red-400" />
                  <span className="text-red-400">Выйти</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
