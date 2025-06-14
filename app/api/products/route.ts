
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить все активные товары для публичного каталога
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'featured'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    // Строим условия фильтрации
    const where: any = {
      isActive: true
    }

    // Фильтр по категории
    if (category && category !== 'all') {
      where.category = {
        name: {
          equals: category,
          mode: 'insensitive'
        }
      }
    }

    // Поиск по названию и описанию
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Фильтр по цене
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    // Определяем сортировку
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy
    })

    // Добавляем рейтинг и количество отзывов к каждому товару
    const productsWithRating = products.map(product => {
      const reviews = product.reviews
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0
      
      return {
        ...product,
        avgRating: Math.round(avgRating * 10) / 10, // Округляем до 1 знака после запятой
        reviewCount: reviews.length,
        reviews: undefined // Убираем детали отзывов из ответа
      }
    })

    return NextResponse.json({ products: productsWithRating })
  } catch (error) {
    console.error('Fetch products error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
