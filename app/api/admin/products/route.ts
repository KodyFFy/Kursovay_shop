
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить все товары для админа
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Admin get products error:', error)
    if (error instanceof Error && error.message.includes('права')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - создать новый товар
export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { title, description, price, imageUrl, categoryId, isFeatured, licenseKey } = body

    if (!title || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        categoryId,
        isFeatured: Boolean(isFeatured),
        licenseKey: licenseKey || null,
        isActive: true,
        isSold: false
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Admin create product error:', error)
    if (error instanceof Error && error.message.includes('права')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка создания товара' },
      { status: 500 }
    )
  }
}
