
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить корзину пользователя
export async function GET(request: NextRequest) {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const userId = decoded.userId

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    return NextResponse.json({ 
      cartItems,
      total,
      count: cartItems.length
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка получения корзины' },
      { status: 500 }
    )
  }
}

// POST - добавить товар в корзину
export async function POST(request: NextRequest) {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const userId = decoded.userId

    const { productId, quantity = 1 } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем, что товар существует и активен
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
        isSold: false
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден или недоступен' },
        { status: 404 }
      )
    }

    // Проверяем, есть ли товар уже в корзине
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    let cartItem
    if (existingCartItem) {
      // Обновляем количество
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    } else {
      // Создаем новый элемент корзины
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
    }

    return NextResponse.json({ 
      message: 'Товар добавлен в корзину',
      cartItem
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { error: 'Ошибка добавления в корзину' },
      { status: 500 }
    )
  }
}
