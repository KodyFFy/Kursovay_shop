
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// PUT - обновить количество товара в корзине
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const userId = decoded.userId

    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Количество должно быть больше 0' },
        { status: 400 }
      )
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        userId
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Элемент корзины не найден' },
        { status: 404 }
      )
    }

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: params.id },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'Количество обновлено',
      cartItem: updatedCartItem
    })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления корзины' },
      { status: 500 }
    )
  }
}

// DELETE - удалить товар из корзины
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any
    const userId = decoded.userId

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: params.id,
        userId
      }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Элемент корзины не найден' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ 
      message: 'Товар удален из корзины'
    })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Ошибка удаления из корзины' },
      { status: 500 }
    )
  }
}
