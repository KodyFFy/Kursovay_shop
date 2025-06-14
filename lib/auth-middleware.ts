
import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export interface AuthUser {
  id: string
  email: string
  username: string
  role: 'USER' | 'ADMIN'
  isAdmin: boolean
}

export async function verifyAuth(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Try to get token from Authorization header first, then from cookies
    let token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      token = request.cookies.get('auth-token')?.value
    }
    
    if (!token) {
      return null
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
        isAdmin: true
      }
    })

    if (!user) {
      return null
    }

    return user as AuthUser
  } catch (error) {
    console.error('Auth verification error:', error)
    return null
  }
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await verifyAuth(request)
  if (!user) {
    throw new Error('Требуется авторизация')
  }
  return user
}

export async function requireAdmin(request: NextRequest): Promise<AuthUser> {
  const user = await requireAuth(request)
  if (user.role !== 'ADMIN' && !user.isAdmin) {
    throw new Error('Требуются права администратора')
  }
  return user
}
