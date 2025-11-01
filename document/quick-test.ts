import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickTest() {
  try {
    // Test with the exact same query that our API uses
    const activity = await prisma.activity.findFirst({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        maxParticipants: true,
        registrationOpen: true,
        registrationDeadline: true,
        _count: {
          select: { registrations: true }
        }
      }
    })

    console.log('🔍 Activity data from database:')
    console.log(JSON.stringify(activity, null, 2))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

quickTest()