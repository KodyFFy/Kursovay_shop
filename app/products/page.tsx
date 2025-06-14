
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Key,
  SlidersHorizontal,
  ArrowUpDown,
  Loader2
} from 'lucide-react'

interface Category {
  id: string
  name: string
}

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
  avgRating: number
  reviewCount: number
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    fetchCategories()
    fetchProducts()
    
    // Читаем URL параметры для инициализации фильтров
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    const searchParam = urlParams.get('search')
    
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    if (searchParam) {
      setSearchQuery(searchParam)
    }
  }, [])

  // Фильтрация и сортировка при изменении параметров
  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchQuery, selectedCategory, sortBy, priceRange])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        const allCategories = [
          { id: 'all', name: 'Все категории' },
          ...data.categories
        ]
        setCategories(allCategories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      } else {
        setError('Ошибка при загрузке товаров')
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
      setError('Ошибка подключения к серверу')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || 
                             product.category.id === selectedCategory
      const matchesPrice = (!priceRange.min || product.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || product.price <= parseInt(priceRange.max))
      
      return matchesSearch && matchesCategory && matchesPrice
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'rating':
        // Sort by rating (using a mock rating for now)
        filtered.sort((a, b) => 4.8 - 4.8) // All products have same rating for now
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
        break
    }

    setFilteredProducts(filtered)
  }

  const addToCart = async (productId: string) => {
    try {
      setAddingToCart(productId)
      const token = localStorage.getItem('token')
      
      if (!token) {
        // Перенаправляем на страницу входа если не авторизован
        window.location.href = '/login'
        return
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      })

      if (response.ok) {
        // Показываем уведомление об успешном добавлении
        alert('Товар добавлен в корзину!')
      } else {
        const data = await response.json()
        alert(data.error || 'Ошибка добавления в корзину')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Ошибка подключения к серверу')
    } finally {
      setAddingToCart(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[var(--accent-primary)] mx-auto mb-4 animate-spin" />
          <p className="text-[var(--text-secondary)]">Загрузка товаров...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Key className="w-12 h-12 text-[var(--text-secondary)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
            Ошибка загрузки
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="btn-primary px-6 py-3 rounded-lg"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Каталог товаров
          </h1>
          <p className="text-xl text-[var(--text-secondary)]">
            Найдите идеальный продукт из нашего ассортимента
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card-dark rounded-xl p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-3 rounded-lg"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-dark px-4 py-3 rounded-lg min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-dark px-4 py-3 rounded-lg min-w-[200px]"
            >
              <option value="featured">Рекомендуемые</option>
              <option value="name">По названию</option>
              <option value="price-low">Цена: по возрастанию</option>
              <option value="price-high">Цена: по убыванию</option>
              <option value="rating">По рейтингу</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' 
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]' 
                    : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--accent-primary)]'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Фильтры
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-[var(--border-primary)] animate-fadeInUp">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Минимальная цена
                  </label>
                  <input
                    type="number"
                    placeholder="От"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                    Максимальная цена
                  </label>
                  <input
                    type="number"
                    placeholder="До"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="input-dark w-full px-4 py-2 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <p className="text-[var(--text-secondary)]">
            Найдено товаров: <span className="text-[var(--accent-primary)] font-semibold">{filteredProducts.length}</span>
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={`animate-fadeInUp ${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
        }`} style={{ animationDelay: '0.3s' }}>
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`animate-fadeInUp hover-lift group ${
                viewMode === 'grid'
                  ? 'card-dark rounded-xl overflow-hidden'
                  : 'card-dark rounded-xl p-6 flex gap-6'
              }`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative h-48 overflow-hidden">
                    {product.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <Key className="w-12 h-12 text-[var(--text-muted)]" />
                      </div>
                    )}
                    {product.isFeatured && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          ХИТ
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="bg-[var(--accent-primary)] text-[var(--bg-primary)] px-3 py-1 rounded-full text-xs font-semibold">
                        {product.category.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-[var(--accent-warning)] fill-current" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {product.avgRating > 0 ? product.avgRating.toFixed(1) : 'Нет оценок'}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        ({product.reviewCount} {product.reviewCount === 1 ? 'отзыв' : product.reviewCount < 5 ? 'отзыва' : 'отзывов'})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[var(--accent-primary)]">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={addingToCart === product.id}
                        className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {addingToCart === product.id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Добавление...
                          </div>
                        ) : (
                          'В корзину'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden rounded-lg">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.title}
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
                          {product.category.name}
                        </span>
                        {product.isFeatured && (
                          <span className="ml-2 bg-[var(--accent-warning)] text-[var(--bg-primary)] px-2 py-1 rounded-full text-xs font-semibold">
                            ХИТ
                          </span>
                        )}
                      </div>
                      <span className="text-2xl font-bold text-[var(--accent-primary)]">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[var(--accent-warning)] fill-current" />
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {product.avgRating > 0 ? product.avgRating.toFixed(1) : 'Нет оценок'}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-muted)]">
                          ({product.reviewCount} {product.reviewCount === 1 ? 'отзыв' : product.reviewCount < 5 ? 'отзыва' : 'отзывов'})
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={addingToCart === product.id}
                        className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
                      >
                        {addingToCart === product.id ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Добавление...
                          </div>
                        ) : (
                          'В корзину'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fadeInUp">
            <Key className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">
              Товары не найдены
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Попробуйте изменить параметры поиска или фильтры
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
                setPriceRange({ min: '', max: '' })
              }}
              className="btn-primary px-6 py-3 rounded-lg"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
