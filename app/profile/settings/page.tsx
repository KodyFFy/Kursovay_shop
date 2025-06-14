
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Shield,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  username: string
  createdAt: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [notifications, setNotifications] = useState({
    emailOrders: true,
    emailPromotions: false,
    emailNews: false
  })

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
        setFormData({
          username: data.user.username,
          email: data.user.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      const token = localStorage.getItem('token')

      // Здесь был бы API call для обновления профиля
      // Для демо просто показываем успешное сообщение
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Настройки успешно сохранены')
    } catch (error) {
      console.error('Save profile error:', error)
      setError('Ошибка сохранения настроек')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('Пароли не совпадают')
        return
      }
      
      if (formData.newPassword.length < 6) {
        setError('Пароль должен содержать минимум 6 символов')
        return
      }

      setSaving(true)
      setError('')
      setSuccess('')
      
      // Здесь был бы API call для смены пароля
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('Пароль успешно изменен')
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (error) {
      console.error('Change password error:', error)
      setError('Ошибка смены пароля')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка настроек...</p>
        </div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
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
            <Settings className="w-10 h-10" />
            Настройки
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Управление аккаунтом и предпочтениями
          </p>
        </div>

        <div className="space-y-8">
          {/* Profile Settings */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[var(--accent-primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Информация профиля
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="input-dark w-full px-4 py-3 rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="input-dark w-full px-4 py-3 rounded-lg"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Сохранение...
                  </div>
                ) : (
                  'Сохранить изменения'
                )}
              </button>
            </div>
          </div>

          {/* Password Settings */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-6 h-6 text-[var(--accent-primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Смена пароля
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="input-dark w-full px-4 py-3 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Новый пароль
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-lg"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-dark w-full px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving || !formData.currentPassword || !formData.newPassword}
                className="btn-secondary px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Изменение...
                  </div>
                ) : (
                  'Изменить пароль'
                )}
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[var(--accent-primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Уведомления
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Уведомления о заказах
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Получать email о статусе заказов
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailOrders}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailOrders: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Рекламные предложения
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Получать информацию о скидках и акциях
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailPromotions}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailPromotions: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-[var(--text-primary)]">
                    Новости и обновления
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">
                    Получать новости о новых товарах
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.emailNews}
                    onChange={(e) => setNotifications(prev => ({ ...prev, emailNews: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[var(--bg-tertiary)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="card-dark rounded-xl p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-[var(--accent-primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                Безопасность
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                <div className="font-medium text-[var(--text-primary)] mb-2">
                  Дата регистрации
                </div>
                <div className="text-[var(--text-secondary)]">
                  {user ? new Date(user.createdAt).toLocaleDateString('ru-RU') : ''}
                </div>
              </div>
              
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="text-blue-400 text-sm">
                  <strong>Совет по безопасности:</strong> Используйте надежный пароль и не передавайте данные для входа третьим лицам.
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-fadeInUp">
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg animate-fadeInUp">
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
