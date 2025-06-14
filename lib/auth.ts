
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AdminUser {
  id: string
  email: string
  username: string
  isAdmin: boolean
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, isAdmin: true }
    })
    
    if (!user || !user.isAdmin) {
      return null
    }
    
    return user
  } catch (error) {
    return null
  }
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string; user: AdminUser } | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, password: true, isAdmin: true }
    })

    if (!user || !user.isAdmin) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' })
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isAdmin: user.isAdmin
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check cookies
  const token = request.cookies.get('admin-token')?.value
  return token || null
}
