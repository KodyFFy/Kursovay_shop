
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Key, 
  Shield, 
  Menu, 
  X,
  ShoppingCart, 
  User, 
  LogOut,
  Wallet,
  ShoppingBag
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

interface UserProfile {
  username: string
  balance: number
  role?: string
  isAdmin?: boolean
}

export default function Header() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Expose refresh function globally for testing
  useEffect(() => {
    // @ts-ignore
    window.refreshHeader = () => {
      console.log('Header: Manual refresh triggered')
      setForceUpdate(prev => prev + 1)
      checkAuth()
      fetchCartCount()
    }
    
    checkAuth()
    fetchCartCount()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      console.log('Header: localStorage change detected')
      setForceUpdate(prev => prev + 1)
      checkAuth()
      fetchCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom login event
    const handleLoginEvent = () => {
      console.log('Header: userLogin event received')
      setForceUpdate(prev => prev + 1)
      setTimeout(() => {
        checkAuth()
        fetchCartCount()
      }, 100) // Small delay to ensure localStorage is updated
    }
    
    window.addEventListener('userLogin', handleLoginEvent)
    
    // Also listen for focus event (when user returns to tab)
    const handleFocus = () => {
      console.log('Header: window focus event')
      setForceUpdate(prev => prev + 1)
      checkAuth()
      fetchCartCount()
    }
    
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('userLogin', handleLoginEvent)
      window.removeEventListener('focus', handleFocus)
    }
  }, [forceUpdate])

  const checkAuth = async () => {
    try {
      console.log('Header: Checking auth...')
      const token = localStorage.getItem('token')
      console.log('Header: Token from localStorage:', token ? 'EXISTS' : 'NOT_FOUND')
      
      if (!token) {
        console.log('Header: No token found, setting loading to false')
        setLoading(false)
        return
      }

      console.log('Header: Making profile API request...')
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Header: Profile API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Header: Profile data received:', data.user)
        setUser(data.user)
      } else {
        console.log('Header: Profile API failed, removing token')
        localStorage.removeItem('token')
      }
    } catch (error) {
      console.error('Header: Auth check error:', error)
      localStorage.removeItem('token')
    } finally {
      console.log('Header: Setting loading to false')
      setLoading(false)
    }
  }

  const fetchCartCount = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCartCount(data.count || 0)
      }
    } catch (error) {
      console.error('Cart count error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setCartCount(0)
    setShowUserMenu(false)
    setIsMobileMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-[var(--border-primary)]">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity">
            <Key className="w-6 h-6 text-[var(--accent-primary)]" />
            <span className="gradient-text">KeyShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative">
              Главная
            </Link>
            <Link href="/products" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative">
              Каталог
            </Link>
            
            {!loading && (
              <>
                {user ? (
                  <>
                    {/* Cart */}
                    <Link href="/cart" className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                          {cartCount}
                        </span>
                      )}
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                      >
                        <User className="w-4 h-4" />
                        {user.username}
                      </button>

                      {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg shadow-lg py-2 z-50">
                          <div className="px-4 py-2 border-b border-[var(--border-primary)]">
                            <div className="text-sm text-[var(--text-secondary)]">Баланс:</div>
                            <div className="text-lg font-bold text-[var(--accent-primary)]">
                              {user.balance.toLocaleString('ru-RU')} ₽
                            </div>
                          </div>
                          
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            Профиль
                          </Link>
                          
                          <Link
                            href="/profile/balance"
                            className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Wallet className="w-4 h-4" />
                            Баланс
                          </Link>
                          
                          <Link
                            href="/profile/orders"
                            className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Заказы
                          </Link>
                          
                          {(user.role === 'ADMIN' || user.isAdmin) && (
                            <Link
                              href="/profile/admin"
                              className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Shield className="w-4 h-4" />
                              Админ-панель
                            </Link>
                          )}
                          
                          <div className="border-t border-[var(--border-primary)] mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-[var(--bg-tertiary)] transition-colors w-full text-left"
                            >
                              <LogOut className="w-4 h-4" />
                              Выйти
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative">
                      Вход
                    </Link>
                    <Link href="/register" className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative">
                      Регистрация
                    </Link>
                  </>
                )}
              </>
            )}

            <Link href="/admin/login" className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors relative">
              <Shield className="w-4 h-4" />
              Админ
            </Link>
            <ThemeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <Link href="/cart" className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--accent-primary)] text-[var(--bg-primary)] text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <ThemeToggle />
            <Link href="/admin/login" className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors">
              <Shield className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-primary)] py-4">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Главная
              </Link>
              <Link 
                href="/products" 
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Каталог
              </Link>
              
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Профиль ({user.username})
                      </Link>
                      <Link 
                        href="/profile/balance" 
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        Баланс: {user.balance.toLocaleString('ru-RU')} ₽
                      </Link>
                      <Link 
                        href="/profile/orders" 
                        className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Заказы
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/login" 
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Вход
                      </Link>
                      <Link 
                        href="/register" 
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Регистрация
                      </Link>
                    </>
                  )}
                </>
              )}
              
              <Link 
                href="/admin/login" 
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-4 h-4" />
                Админ-панель
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
