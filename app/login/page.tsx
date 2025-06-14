
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Key, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo('Отправка запроса...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()
      setDebugInfo(`Ответ сервера: ${JSON.stringify(data, null, 2)}`)

      if (response.ok) {
        // Save token to localStorage
        if (data.token) {
          localStorage.setItem('token', data.token)
          setDebugInfo(prev => prev + '\nТокен сохранен в localStorage')
          // Dispatch custom event to notify header about login
          window.dispatchEvent(new Event('userLogin'))
          setDebugInfo(prev => prev + '\nСобытие userLogin отправлено')
        }
        // Success - redirect to home or dashboard
        setTimeout(() => {
          window.location.href = '/'
        }, 2000) // Delay to see debug info
      } else {
        // Show error message
        alert(data.error || 'Ошибка при входе в систему')
      }
    } catch (error) {
      console.error('Login error:', error)
      setDebugInfo(`Ошибка: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`)
      alert('Ошибка подключения к серверу')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-transparent to-[var(--bg-secondary)]"></div>
      
      <div className="relative z-10 w-full max-w-md animate-fadeInUp">
        <div className="card-dark rounded-2xl p-8 glass">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--accent-primary)] to-[#00cc6a] rounded-xl flex items-center justify-center animate-glow">
              <Key className="w-8 h-8 text-[var(--bg-primary)]" />
            </div>
            <h1 className="text-3xl font-bold mb-2 gradient-text">
              Добро пожаловать
            </h1>
            <p className="text-[var(--text-secondary)]">
              Войдите в свой аккаунт KeyShop
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Email адрес
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-dark w-full pl-10 pr-12 py-3 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[var(--accent-primary)] bg-[var(--bg-tertiary)] border-[var(--border-secondary)] rounded focus:ring-[var(--accent-primary)] focus:ring-2"
                />
                <span className="ml-2 text-sm text-[var(--text-secondary)]">
                  Запомнить меня
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--accent-primary)] hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Вход...
                </>
              ) : (
                <>
                  Войти
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Debug Info */}
            {debugInfo && (
              <div className="mt-4 p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
                <h3 className="text-sm font-semibold mb-2 text-[var(--text-primary)]">Отладочная информация:</h3>
                <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </form>

          {/* Test Button */}
          <button
            type="button"
            onClick={() => {
              setFormData({ email: 'test@example.com', password: 'password123' })
              setDebugInfo('Тестовые данные заполнены')
            }}
            className="w-full mt-4 py-2 px-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
          >
            Заполнить тестовые данные
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-[var(--border-primary)]"></div>
            <span className="px-4 text-sm text-[var(--text-muted)]">или</span>
            <div className="flex-1 border-t border-[var(--border-primary)]"></div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-[var(--text-secondary)]">
              Нет аккаунта?{' '}
              <Link
                href="/register"
                className="text-[var(--accent-primary)] hover:underline font-semibold"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="w-8 h-8 mx-auto mb-2 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-sm">1</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Быстрая регистрация</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 mx-auto mb-2 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-sm">2</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Мгновенная покупка</p>
            </div>
            <div className="p-4">
              <div className="w-8 h-8 mx-auto mb-2 bg-[var(--accent-primary)] rounded-full flex items-center justify-center">
                <span className="text-[var(--bg-primary)] font-bold text-sm">3</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">Получение ключа</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
