import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAchievements() {
  console.log('🏆 Seeding achievements...');

  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first lesson',
      icon: '🔥',
      requirement: { type: 'lessons_completed', value: 1 },
      xpReward: 10,
    },
    {
      name: 'Bookworm',
      description: 'Complete 10 lessons',
      icon: '📚',
      requirement: { type: 'lessons_completed', value: 10 },
      xpReward: 25,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: {
        ...achievement,
        requirement: JSON.stringify(achievement.requirement),
      },
    });
  }

  console.log('✅ Achievements ready');
}

async function seedLessons() {
  console.log('📚 Seeding lessons and exercises...');

  const lessons = [
    {
      title: 'Привітання та знайомство',
      description: 'Основні фрази для привітання та знайомства',
      category: 'GREETINGS',
      level: 'A1',
      order: 1,
      xpReward: 10,
      exercises: [
        {
          type: 'MULTIPLE_CHOICE',
          question: 'Як українською сказати "Hello"?',
          options: ['Привіт', 'До побачення', 'Дякую', 'Вибачте'],
          correctAnswer: 'Привіт',
          order: 1,
          xpReward: 2,
        },
        {
          type: 'TEXT_INPUT',
          question: 'Перекладіть: "My name is..."',
          correctAnswer: 'Мене звати',
          order: 2,
          xpReward: 3,
        },
      ],
    },
    {
      title: 'Ввічливі фрази',
      description: 'Дякую, будь ласка, вибачте',
      category: 'GREETINGS',
      level: 'A1',
      order: 2,
      xpReward: 10,
      exercises: [
        {
          type: 'MULTIPLE_CHOICE',
          question: 'Як сказати "Please" українською?',
          options: ['Будь ласка', 'Дякую', 'Вибачте', 'Привіт'],
          correctAnswer: 'Будь ласка',
          order: 1,
          xpReward: 2,
        },
      ],
    },
    {
      title: 'Основна їжа',
      description: 'Назви основних продуктів харчування',
      category: 'FOOD',
      level: 'A1',
      order: 1,
      xpReward: 12,
      exercises: [
        {
          type: 'MULTIPLE_CHOICE',
          question: 'Як українською "bread"?',
          options: ['хліб', 'молоко', "м'ясо", 'риба'],
          correctAnswer: 'хліб',
          order: 1,
          xpReward: 2,
        },
      ],
    },
  ];

  for (const lesson of lessons) {
    const savedLesson = await prisma.lesson.upsert({
      where: { title: lesson.title },
      update: {
        description: lesson.description,
        category: lesson.category as any,
        level: lesson.level as any,
        order: lesson.order,
        xpReward: lesson.xpReward,
      },
      create: {
        title: lesson.title,
        description: lesson.description,
        category: lesson.category as any,
        level: lesson.level as any,
        order: lesson.order,
        xpReward: lesson.xpReward,
      },
    });

    for (const exercise of lesson.exercises) {
      await prisma.exercise.upsert({
        where: {
          lessonId_order: {
            lessonId: savedLesson.id,
            order: exercise.order,
          },
        },
        update: {
          type: exercise.type as any,
          question: exercise.question,
          options: exercise.options ? JSON.stringify(exercise.options) : undefined,
          correctAnswer: exercise.correctAnswer,
          xpReward: exercise.xpReward,
        },
        create: {
          lessonId: savedLesson.id,
          type: exercise.type as any,
          question: exercise.question,
          options: exercise.options ? JSON.stringify(exercise.options) : undefined,
          correctAnswer: exercise.correctAnswer,
          order: exercise.order,
          xpReward: exercise.xpReward,
        },
      });
    }
  }

  console.log('✅ Lessons ready');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    await seedAchievements();
    await seedLessons();

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
