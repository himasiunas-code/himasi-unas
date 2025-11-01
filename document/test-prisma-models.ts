// Test Prisma Client models
console.log('Testing Prisma Client...')

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testModels() {
  try {
    console.log('Available Prisma methods:')
    
    // Test if models exist by checking their methods
    const prismaKeys = Object.getOwnPropertyNames(prisma)
      .filter(key => !key.startsWith('$') && !key.startsWith('_'))
    
    console.log('Prisma keys:', prismaKeys)
    
    // Try to access models
    console.log('\nTesting model access:')
    
    try {
      console.log('activity methods:', Object.getOwnPropertyNames(prisma.activity))
    } catch (e) {
      console.log('❌ activity model not found')
    }
    
    // Check if Registration exists with different case
    const possibleNames = ['registration', 'Registration', 'registrations']
    for (const name of possibleNames) {
      try {
        if (prisma[name as keyof typeof prisma]) {
          console.log(`✅ Found model: ${name}`)
        }
      } catch (e) {
        console.log(`❌ ${name} not found`)
      }
    }
    
  } catch (error) {
    console.error('Error testing models:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testModels()