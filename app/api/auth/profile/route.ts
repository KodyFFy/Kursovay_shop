
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить профиль пользователя
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isAdmin: true,
        balance: true,
        createdAt: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Ошибка получения профиля' },
      { status: 500 }
    )
  }
}
