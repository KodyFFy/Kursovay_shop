
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { requireAdmin } from '@/lib/auth-middleware'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// PUT - обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    const body = await request.json()
    const { title, description, price, imageUrl, categoryId, isFeatured, licenseKey, isActive } = body

    const updateData: any = {}
    
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (price !== undefined) updateData.price = parseFloat(price)
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null
    if (categoryId !== undefined) updateData.categoryId = categoryId
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured)
    if (licenseKey !== undefined) updateData.licenseKey = licenseKey || null
    if (isActive !== undefined) updateData.isActive = Boolean(isActive)

    const product = await prisma.product.update({
      where: { id: params.id },
      data: updateData,
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
    console.error('Admin update product error:', error)
    if (error instanceof Error && error.message.includes('права')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка обновления товара' },
      { status: 500 }
    )
  }
}

// DELETE - удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin(request)

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin delete product error:', error)
    if (error instanceof Error && error.message.includes('права')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { error: 'Ошибка удаления товара' },
      { status: 500 }
    )
  }
}
