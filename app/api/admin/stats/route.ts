
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// GET - получить статистику для админа
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const [totalProducts, totalUsers, totalOrders, revenueData] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      })
    ])

    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue: revenueData._sum.amount || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Admin get stats error:', error)
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
