// Test file untuk WhatsApp service dengan Fonnte
import { whatsappService } from '../lib/whatsapp-service'

async function testWhatsAppService() {
  console.log('🧪 Testing WhatsApp Service with Fonnte...')
  
  // Test data
  const testPhone = '08123456789' // Ganti dengan nomor test Anda
  const testName = 'John Doe'
  const testActivity = 'Workshop React JS'
  const testReason = 'Dokumen tidak lengkap'
  
  try {
    console.log('\n📱 Test 1: Basic WhatsApp Message')
    const basicTest = await whatsappService.sendMessage(testPhone, 'Test message from HIMASI UNAS system!')
    console.log('Basic message result:', basicTest ? '✅ Success' : '❌ Failed')
    
    console.log('\n🎉 Test 2: Approval Message')
    const approvalTest = await whatsappService.sendApprovalMessage(testPhone, testName, testActivity)
    console.log('Approval message result:', approvalTest ? '✅ Success' : '❌ Failed')
    
    console.log('\n❌ Test 3: Rejection Message')
    const rejectionTest = await whatsappService.sendRejectionMessage(testPhone, testName, testActivity, testReason)
    console.log('Rejection message result:', rejectionTest ? '✅ Success' : '❌ Failed')
    
    console.log('\n🏁 WhatsApp Service Test Complete!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Run test
testWhatsAppService()