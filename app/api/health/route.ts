import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Simple query to test connectivity
    const activityCount = await prisma.activity.count()
    const registrationCount = await prisma.registration.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        activities: activityCount,
        registrations: registrationCount,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}