// Test script untuk email service
// Jalankan dengan: npx tsx test-email-service.ts

import { EmailService } from './lib/email-service'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function testEmailService() {
  console.log('🧪 Testing Email Service...')
  
  try {
    const emailService = new EmailService()
    
    // Test connection
    console.log('📡 Testing SMTP connection...')
    const isConnected = await emailService.verifyConnection()
    
    if (!isConnected) {
      console.error('❌ SMTP connection failed!')
      console.log('Check your environment variables:')
      console.log('- SMTP_HOST:', process.env.SMTP_HOST)
      console.log('- SMTP_PORT:', process.env.SMTP_PORT)
      console.log('- SMTP_USER:', process.env.SMTP_USER)
      console.log('- SMTP_PASS:', process.env.SMTP_PASS ? '***set***' : 'NOT SET')
      return
    }
    
    console.log('✅ SMTP connection successful!')
    
    // Test data
    const testData = {
      fullName: 'John Doe (Test)',
      email: process.env.SMTP_USER || 'test@example.com', // Kirim ke diri sendiri untuk testing
      activityTitle: 'Workshop Web Development',
      activitySlug: 'workshop-web-development',
      activityStartDate: new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      activityLocation: 'Lab Komputer UNAS',
      reason: 'Dokumen persyaratan belum lengkap. Silakan melengkapi bukti pembayaran dan foto KTM yang jelas.'
    }
    
    console.log('📧 Testing Approval Email...')
    await emailService.sendApprovalEmail(testData)
    console.log('✅ Approval email sent successfully!')
    
    console.log('📧 Testing Rejection Email...')
    await emailService.sendRejectionEmail(testData)
    console.log('✅ Rejection email sent successfully!')
    
    console.log('\n🎉 All tests passed!')
    console.log('Check your email inbox for the test emails.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name
      })
    }
  }
}

// Run the test
testEmailService()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Unhandled error:', error)
    process.exit(1)
  })