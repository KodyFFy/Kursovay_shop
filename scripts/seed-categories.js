
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Create categories
    const categories = [
      {
        name: 'Игры',
        slug: 'games',
        description: 'Лицензионные ключи для игр Steam, Origin, Epic Games и других платформ'
      },
      {
        name: 'ПО',
        slug: 'software',
        description: 'Программное обеспечение для работы и творчества'
      },
      {
        name: 'Антивирусы',
        slug: 'antivirus',
        description: 'Антивирусные программы для защиты компьютера'
      },
      {
        name: 'Windows',
        slug: 'windows',
        description: 'Операционные системы Windows и Office'
      }
    ]

    for (const categoryData of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: categoryData.slug }
      })

      if (!existingCategory) {
        const category = await prisma.category.create({
          data: categoryData
        })
        console.log(`Created category: ${category.name}`)
      } else {
        console.log(`Category already exists: ${categoryData.name}`)
      }
    }

    // Get categories for products
    const gamesCategory = await prisma.category.findUnique({ where: { slug: 'games' } })
    const softwareCategory = await prisma.category.findUnique({ where: { slug: 'software' } })
    const antivirusCategory = await prisma.category.findUnique({ where: { slug: 'antivirus' } })
    const windowsCategory = await prisma.category.findUnique({ where: { slug: 'windows' } })

    // Create sample products
    const products = [
      {
        title: 'Windows 11 Pro',
        description: 'Лицензионный ключ Windows 11 Professional для домашнего и офисного использования. Включает все функции для продуктивной работы.',
        price: 2999,
        imageUrl: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=400&h=300&fit=crop',
        categoryId: windowsCategory.id,
        isFeatured: true,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
      },
      {
        title: 'Microsoft Office 2021',
        description: 'Полный пакет Office 2021 Professional Plus с Word, Excel, PowerPoint, Outlook и другими приложениями.',
        price: 4999,
        imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
        categoryId: softwareCategory.id,
        isFeatured: true,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
      },
      {
        title: 'Cyberpunk 2077',
        description: 'Steam ключ для популярной RPG игры в жанре киберпанк от CD Projekt RED.',
        price: 1999,
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        categoryId: gamesCategory.id,
        isFeatured: true,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX'
      },
      {
        title: 'Kaspersky Internet Security',
        description: 'Комплексная защита для 3 устройств на 1 год. Антивирус, файрвол и защита от интернет-угроз.',
        price: 1499,
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop',
        categoryId: antivirusCategory.id,
        isFeatured: true,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX'
      },
      {
        title: 'Adobe Photoshop 2024',
        description: 'Профессиональный редактор изображений для дизайнеров и фотографов.',
        price: 3999,
        imageUrl: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=300&fit=crop',
        categoryId: softwareCategory.id,
        isFeatured: false,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX'
      },
      {
        title: 'Grand Theft Auto V',
        description: 'Steam ключ для легендарной игры GTA V с возможностью игры в GTA Online.',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
        categoryId: gamesCategory.id,
        isFeatured: false,
        isActive: true,
        licenseKey: 'XXXXX-XXXXX-XXXXX'
      }
    ]

    for (const productData of products) {
      const existingProduct = await prisma.product.findFirst({
        where: { title: productData.title }
      })

      if (!existingProduct) {
        const product = await prisma.product.create({
          data: productData
        })
        console.log(`Created product: ${product.title}`)
      } else {
        console.log(`Product already exists: ${productData.title}`)
      }
    }

    console.log('Database seeding completed successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
