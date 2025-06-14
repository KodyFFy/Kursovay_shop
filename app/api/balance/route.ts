
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить баланс пользователя
export async function GET(request: NextRequest) {
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

    return NextResponse.json({ balance: user.balance })
  } catch (error) {
    console.error('Get balance error:', error)
    return NextResponse.json(
      { error: 'Ошибка получения баланса' },
      { status: 500 }
    )
  }
}

// POST - пополнить баланс
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

    const { amount, paymentMethod } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Сумма должна быть больше 0' },
        { status: 400 }
      )
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: 'Метод оплаты обязателен' },
        { status: 400 }
      )
    }

    // В реальном приложении здесь была бы интеграция с платежной системой
    // Для демо просто добавляем средства на баланс

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount
        }
      }
    })

    // Создаем запись о транзакции
    await prisma.balanceTransaction.create({
      data: {
        userId,
        amount,
        type: 'DEPOSIT',
        description: `Пополнение баланса через ${paymentMethod}`
      }
    })

    return NextResponse.json({ 
      message: 'Баланс успешно пополнен',
      balance: user.balance
    })
  } catch (error) {
    console.error('Add balance error:', error)
    return NextResponse.json(
      { error: 'Ошибка пополнения баланса' },
      { status: 500 }
    )
  }
}
