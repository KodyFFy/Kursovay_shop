
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// POST - оформить заказ
export async function POST(request: NextRequest) {
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

    const { paymentMethod } = await request.json()

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Метод оплаты обязателен' },
        { status: 400 }
      )
    }

    // Получаем корзину пользователя
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      )
    }

    // Вычисляем общую сумму
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    // Получаем текущий баланс пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (paymentMethod === 'balance' && user.balance < totalAmount) {
      return NextResponse.json(
        { error: 'Недостаточно средств на балансе' },
        { status: 400 }
      )
    }

    // Создаем заказы для каждого товара
    const orders = []
    for (const cartItem of cartItems) {
      const order = await prisma.order.create({
        data: {
          userId,
          productId: cartItem.productId,
          amount: cartItem.product.price * cartItem.quantity,
          status: 'PENDING',
          paymentMethod,
          licenseKey: cartItem.product.licenseKey
        },
        include: {
          product: {
            include: {
              category: true
            }
          }
        }
      })
      orders.push(order)
    }

    // Если оплата с баланса, списываем средства
    if (paymentMethod === 'balance') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          balance: {
            decrement: totalAmount
          }
        }
      })

      // Создаем запись о транзакции
      await prisma.balanceTransaction.create({
        data: {
          userId,
          amount: -totalAmount,
          type: 'PURCHASE',
          description: `Покупка товаров (${cartItems.length} шт.)`
        }
      })

      // Обновляем статус заказов на завершенный
      for (const order of orders) {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: 'COMPLETED' }
        })
      }

      // Помечаем товары как проданные (для цифровых товаров)
      for (const cartItem of cartItems) {
        await prisma.product.update({
          where: { id: cartItem.productId },
          data: { isSold: true }
        })
      }
    }

    // Очищаем корзину
    await prisma.cartItem.deleteMany({
      where: { userId }
    })

    return NextResponse.json({ 
      message: 'Заказ успешно оформлен',
      orders,
      totalAmount
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Ошибка оформления заказа' },
      { status: 500 }
    )
  }
}
