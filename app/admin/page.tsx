
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  LogOut,
  Shield,
  Users,
  ShoppingCart,
  TrendingUp
} from 'lucide-react'

interface Product {
  id: string
  title: string
  description: string
  price: number
  imageUrl?: string
  category: {
    name: string
  }
  isFeatured: boolean
  isActive: boolean
  createdAt: string
}

interface AdminUser {
  id: string
  email: string
  username: string
  isAdmin: boolean
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchProducts()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('admin-token')
        document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/admin/login')
    }
  }

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-token')
    document.cookie = 'admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    router.push('/admin/login')
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
      } else {
        alert('Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Ошибка при удалении товара')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           product.category.name.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Admin Header */}
      <header className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Админ-панель KeyShop</h1>
                <p className="text-sm text-[var(--text-secondary)]">Добро пожаловать, {user?.username}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
              >
                Перейти на сайт
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Всего товаров</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Активные товары</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {products.filter(p => p.isActive).length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Рекомендуемые</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {products.filter(p => p.isFeatured).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Категории</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {new Set(products.map(p => p.category.name)).size}
                </p>
              </div>
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Products Management */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Управление товарами</h2>
            <Link 
              href="/admin/products/new"
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Добавить товар
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-full md:w-48"
            >
              <option value="all">Все категории</option>
              <option value="games">Игры</option>
              <option value="software">ПО</option>
              <option value="antivirus">Антивирусы</option>
              <option value="windows">Windows</option>
            </select>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-primary)]">
                  <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Товар</th>
                  <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Категория</th>
                  <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Цена</th>
                  <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Статус</th>
                  <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-[var(--accent-primary)]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-[var(--text-primary)]">{product.title}</h3>
                          <p className="text-sm text-[var(--text-secondary)] truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-1 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] rounded-full text-xs">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {product.price.toLocaleString()} ₽
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {product.isActive && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Активен
                          </span>
                        )}
                        {product.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                            Рекомендуемый
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">Товары не найдены</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
