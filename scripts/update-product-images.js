
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const productImages = {
  'Windows': '{https://c8.alamy.com/comp/2JFWY19/konskie-poland-july-05-2022-microsoft-windows-11-operating-system-logo-displayed-on-laptop-computer-screen-2JFWY19.jpg}',
  'Office': '{https://i.ytimg.com/vi/qNbX1qIz1uQ/maxresdefault.jpg}',
  'Antivirus': '{https://thumbs.dreamstime.com/b/hud-ui-abstract-virtual-graphic-touch-user-interface-cyber-security-concept-shield-icon-digital-data-hud-ui-abstract-173057825.jpg}',
  'Games': '{https://i.ytimg.com/vi/NglWYhdM_OQ/maxresdefault.jpg}',
  'Software': '{https://img.freepik.com/premium-photo/software-developer-focusing-code-displayed-multiple-monitors-modern-workspace-software-development-programming-process_210545-24072.jpg}'
}

async function updateProductImages() {
  try {
    console.log('Updating product images...')

    // Get all products
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })

    for (const product of products) {
      let imageUrl = productImages['Software'] // default

      // Assign images based on category or product name
      if (product.category.name.toLowerCase().includes('windows')) {
        imageUrl = productImages['Windows']
      } else if (product.category.name.toLowerCase().includes('office') || 
                 product.title.toLowerCase().includes('office')) {
        imageUrl = productImages['Office']
      } else if (product.category.name.toLowerCase().includes('антивирус') || 
                 product.title.toLowerCase().includes('kaspersky') ||
                 product.title.toLowerCase().includes('антивирус')) {
        imageUrl = productImages['Antivirus']
      } else if (product.category.name.toLowerCase().includes('игр') || 
                 product.title.toLowerCase().includes('cyberpunk') ||
                 product.title.toLowerCase().includes('steam')) {
        imageUrl = productImages['Games']
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl }
      })

      console.log(`Updated ${product.title} with image`)
    }

    console.log('All product images updated successfully!')
  } catch (error) {
    console.error('Error updating product images:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductImages()
