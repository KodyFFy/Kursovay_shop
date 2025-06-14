
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Users, 
  ShoppingCart,
  DollarSign,
  Eye,
  EyeOff,
  Save,
  X,
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
  licenseKey?: string
  isSold: boolean
  createdAt: string
}

interface Category {
  id: string
  name: string
}

interface Stats {
  totalProducts: number
  totalUsers: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalUsers: 0, totalOrders: 0, totalRevenue: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    isFeatured: false,
    licenseKey: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.isAdmin)) {
      fetchData()
    }
  }, [user])

  const checkAuth = async () => {
    try {
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
        
        if (data.user.role !== 'ADMIN' && !data.user.isAdmin) {
          router.push('/profile')
          return
        }
      } else {
        router.push('/login')
        return
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch products
      const productsResponse = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setProducts(productsData.products)
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories')
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories)
      }

      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price)
        })
      })

      if (response.ok) {
        setShowAddForm(false)
        setEditingProduct(null)
        setFormData({
          title: '',
          description: '',
          price: '',
          imageUrl: '',
          categoryId: '',
          isFeatured: false,
          licenseKey: ''
        })
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Ошибка подключения к серверу')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || '',
      categoryId: product.category.id,
      isFeatured: product.isFeatured,
      licenseKey: product.licenseKey || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchData()
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Ошибка подключения к серверу')
    }
  }

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Toggle status error:', error)
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 gradient-text">
            Админ-панель
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Управление товарами и системой
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--accent-primary)] rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-[var(--bg-primary)]" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Товары</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Пользователи</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Заказы</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="card-dark rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Выручка</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stats.totalRevenue.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Management */}
        <div className="card-dark rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Управление товарами
            </h2>
            <button
              onClick={() => {
                setShowAddForm(true)
                setEditingProduct(null)
                setFormData({
                  title: '',
                  description: '',
                  price: '',
                  imageUrl: '',
                  categoryId: '',
                  isFeatured: false,
                  licenseKey: ''
                })
              }}
              className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Добавить товар
            </button>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="mb-6 p-6 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-primary)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                  }}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Название
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Цена (₽)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg h-24"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Категория
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Лицензионный ключ
                  </label>
                  <input
                    type="text"
                    value={formData.licenseKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, licenseKey: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                    placeholder="XXXXX-XXXXX-XXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    URL изображения
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isFeatured" className="text-sm text-[var(--text-primary)]">
                    Рекомендуемый товар
                  </label>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingProduct ? 'Обновить' : 'Создать'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                    }}
                    className="btn-secondary px-6 py-2 rounded-lg"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-primary)]">
                  <th className="text-left py-3 px-4 text-[var(--text-primary)]">Товар</th>
                  <th className="text-left py-3 px-4 text-[var(--text-primary)]">Категория</th>
                  <th className="text-left py-3 px-4 text-[var(--text-primary)]">Цена</th>
                  <th className="text-left py-3 px-4 text-[var(--text-primary)]">Статус</th>
                  <th className="text-left py-3 px-4 text-[var(--text-primary)]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-[var(--border-primary)]">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">{product.title}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {product.description.substring(0, 50)}...
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[var(--text-secondary)]">
                      {product.category.name}
                    </td>
                    <td className="py-3 px-4 text-[var(--text-primary)] font-medium">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                        {product.isFeatured && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]">
                            ХИТ
                          </span>
                        )}
                        {product.isSold && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
                            Продан
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleProductStatus(product.id, product.isActive)}
                          className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
                          title={product.isActive ? 'Скрыть' : 'Показать'}
                        >
                          {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-[var(--text-secondary)] hover:text-blue-400 transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-[var(--text-secondary)] hover:text-red-400 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
