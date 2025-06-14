
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Key, ArrowRight, Check } from 'lucide-react'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Пароли не совпадают')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (response.ok) {
        // Success - redirect to login
        alert('Регистрация успешна! Теперь вы можете войти в систему.')
        window.location.href = '/login'
      } else {
        // Show error message
        alert(data.error || 'Ошибка при регистрации')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Ошибка подключения к серверу')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Calculate password strength
    if (name === 'password') {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[a-z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^A-Za-z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-blue-500'
      case 5: return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1: return 'Слабый'
      case 2: return 'Удовлетворительный'
      case 3: return 'Хороший'
      case 4: return 'Сильный'
      case 5: return 'Очень сильный'
      default: return ''
    }
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
              Создать аккаунт
            </h1>
            <p className="text-[var(--text-secondary)]">
              Присоединяйтесь к KeyShop уже сегодня
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Имя пользователя
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  className="input-dark w-full pl-10 pr-4 py-3 rounded-lg"
                  required
                />
              </div>
            </div>

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
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-[var(--bg-tertiary)] rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                Подтвердите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-dark w-full pl-10 pr-12 py-3 rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Пароли не совпадают</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 text-[var(--accent-primary)] bg-[var(--bg-tertiary)] border-[var(--border-secondary)] rounded focus:ring-[var(--accent-primary)] focus:ring-2"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Я согласен с{' '}
                <Link href="/terms" className="text-[var(--accent-primary)] hover:underline">
                  условиями использования
                </Link>
                {' '}и{' '}
                <Link href="/privacy" className="text-[var(--accent-primary)] hover:underline">
                  политикой конфиденциальности
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms || formData.password !== formData.confirmPassword}
              className="btn-primary w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5"></div>
                  Создание аккаунта...
                </>
              ) : (
                <>
                  Создать аккаунт
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-[var(--border-primary)]"></div>
            <span className="px-4 text-sm text-[var(--text-muted)]">или</span>
            <div className="flex-1 border-t border-[var(--border-primary)]"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[var(--text-secondary)]">
              Уже есть аккаунт?{' '}
              <Link
                href="/login"
                className="text-[var(--accent-primary)] hover:underline font-semibold"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <div className="card-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
              Преимущества регистрации:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">Мгновенное получение ключей</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">История покупок</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">Персональные скидки</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[var(--accent-primary)]" />
                <span className="text-[var(--text-secondary)]">Приоритетная поддержка</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
