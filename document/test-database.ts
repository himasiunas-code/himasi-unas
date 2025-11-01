import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test activity data
    const activity = await prisma.activity.findFirst({
      include: {
        registrations: true
      }
    })
    
    if (activity) {
      console.log('✅ Activity found:')
      console.log(`   - Title: ${activity.title}`)
      console.log(`   - Description: ${activity.description}`)
      console.log(`   - Max Participants: ${activity.maxParticipants}`)
      console.log(`   - Registration Open: ${activity.registrationOpen}`)
      console.log(`   - Registration Deadline: ${activity.registrationDeadline}`)
      console.log(`   - Current Registrations: ${activity.registrations.length}`)
    } else {
      console.log('❌ No activity found')
    }
    
    // Test registrations
    const registrations = await prisma.registration.findMany({
      include: {
        activity: true
      }
    })
    
    console.log(`\n📝 Total registrations: ${registrations.length}`)
    registrations.forEach((reg: any, index: number) => {
      console.log(`   ${index + 1}. ${reg.fullName} (${reg.email})`)
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()