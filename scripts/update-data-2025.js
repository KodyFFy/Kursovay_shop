
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Реалистичные отзывы для товаров
const reviewsData = [
  {
    productTitle: 'Windows 11 Pro',
    reviews: [
      { rating: 4.8, comment: 'Отличная операционная система! Быстрая установка, ключ активировался без проблем.' },
      { rating: 4.9, comment: 'Все работает идеально. Рекомендую этого продавца!' },
      { rating: 4.7, comment: 'Лицензионный ключ, активация прошла успешно. Спасибо!' },
      { rating: 5.0, comment: 'Мгновенная доставка ключа, все отлично работает!' }
    ]
  },
  {
    productTitle: 'Microsoft Office 2021',
    reviews: [
      { rating: 4.9, comment: 'Полный пакет Office работает отлично. Ключ активировался сразу.' },
      { rating: 4.8, comment: 'Качественный продукт, быстрая доставка ключа.' },
      { rating: 4.6, comment: 'Все приложения Office работают стабильно. Рекомендую!' }
    ]
  },
  {
    productTitle: 'Cyberpunk 2077',
    reviews: [
      { rating: 4.7, comment: 'Отличная игра! Steam ключ активировался без проблем.' },
      { rating: 4.8, comment: 'Быстрая доставка, игра запустилась сразу. Спасибо!' },
      { rating: 4.9, comment: 'Лицензионный ключ, все работает идеально!' },
      { rating: 4.5, comment: 'Хорошая цена за такую игру. Рекомендую!' },
      { rating: 4.6, comment: 'Steam ключ пришел моментально, активация прошла успешно.' }
    ]
  },
  {
    productTitle: 'Kaspersky Internet Security',
    reviews: [
      { rating: 4.9, comment: 'Надежная защита! Ключ активировался на всех устройствах.' },
      { rating: 4.8, comment: 'Отличный антивирус, быстрая доставка лицензии.' },
      { rating: 4.7, comment: 'Kaspersky работает стабильно, защита на высоте!' }
    ]
  },
  {
    productTitle: 'Adobe Photoshop 2024',
    reviews: [
      { rating: 4.8, comment: 'Профессиональный инструмент! Лицензия активировалась без проблем.' },
      { rating: 4.9, comment: 'Отличная программа для дизайна. Рекомендую!' }
    ]
  },
  {
    productTitle: 'Grand Theft Auto V',
    reviews: [
      { rating: 4.6, comment: 'Легендарная игра! Steam ключ работает отлично.' },
      { rating: 4.7, comment: 'GTA V и GTA Online - все доступно. Спасибо!' },
      { rating: 4.8, comment: 'Быстрая доставка ключа, игра запустилась сразу.' }
    ]
  }
];

async function updateDataTo2025() {
  try {
    console.log('🔄 Начинаем обновление данных на 2025 год...');
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    const products = await prisma.product.findMany();
    
    if (users.length === 0) {
      console.log('❌ Пользователи не найдены');
      return;
    }
    
    // Удаляем старые отзывы
    await prisma.review.deleteMany({});
    console.log('🗑️ Удалены старые отзывы');
    
    // Создаем новые отзывы с датами 2025 года
    for (const reviewGroup of reviewsData) {
      const product = products.find(p => p.title === reviewGroup.productTitle);
      if (!product) continue;
      
      for (let i = 0; i < reviewGroup.reviews.length; i++) {
        const review = reviewGroup.reviews[i];
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        // Генерируем случайную дату в 2025 году
        const startDate = new Date('2025-01-01');
        const endDate = new Date('2025-06-14');
        const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        
        try {
          await prisma.review.create({
            data: {
              userId: randomUser.id,
              productId: product.id,
              rating: review.rating,
              comment: review.comment,
              createdAt: randomDate,
              updatedAt: randomDate
            }
          });
        } catch (error) {
          // Пропускаем дубликаты (один пользователь - один отзыв на товар)
          continue;
        }
      }
    }
    
    console.log('✅ Добавлены новые отзывы с датами 2025 года');
    
    // Обновляем даты заказов на 2025 год
    const orders = await prisma.order.findMany();
    for (const order of orders) {
      const randomDate = new Date('2025-01-01');
      randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 164)); // До 14 июня 2025
      
      await prisma.order.update({
        where: { id: order.id },
        data: {
          createdAt: randomDate,
          updatedAt: randomDate
        }
      });
    }
    
    console.log('✅ Обновлены даты заказов на 2025 год');
    
    // Обновляем даты транзакций баланса на 2025 год
    const transactions = await prisma.balanceTransaction.findMany();
    for (const transaction of transactions) {
      const randomDate = new Date('2025-01-01');
      randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 164));
      
      await prisma.balanceTransaction.update({
        where: { id: transaction.id },
        data: {
          createdAt: randomDate
        }
      });
    }
    
    console.log('✅ Обновлены даты транзакций на 2025 год');
    
    // Статистика
    const reviewCount = await prisma.review.count();
    console.log(`📊 Создано отзывов: ${reviewCount}`);
    
    const avgRatings = await prisma.review.groupBy({
      by: ['productId'],
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });
    
    console.log('📈 Средние оценки товаров:');
    for (const stat of avgRatings) {
      const product = products.find(p => p.id === stat.productId);
      if (product) {
        console.log(`   ${product.title}: ${stat._avg.rating?.toFixed(1)} (${stat._count.rating} отзывов)`);
      }
    }
    
    console.log('🎉 Обновление данных завершено!');
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении данных:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDataTo2025();
