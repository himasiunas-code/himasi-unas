// Test admin registration approval/rejection dengan WhatsApp
const testAdminRegistrationFlow = async () => {
  console.log('🧪 Testing Admin Registration Flow with WhatsApp...')
  
  try {
    // Pastikan ada registrations untuk di-test
    const baseUrl = 'http://localhost:3000'
    
    // Ambil registrations yang ada
    console.log('\n📋 Fetching existing registrations...')
    const registrationsResponse = await fetch(`${baseUrl}/api/admin/registrations`)
    
    if (!registrationsResponse.ok) {
      throw new Error('Failed to fetch registrations')
    }
    
    const registrationsData = await registrationsResponse.json()
    console.log(`Found ${registrationsData.data?.length || 0} registrations`)
    
    if (!registrationsData.data || registrationsData.data.length === 0) {
      console.log('❌ No registrations found for testing. Please create a registration first.')
      return
    }
    
    // Ambil registration pertama yang statusnya PENDING
    const pendingRegistration = registrationsData.data.find(reg => reg.status === 'PENDING')
    
    if (!pendingRegistration) {
      console.log('❌ No pending registrations found for testing.')
      return
    }
    
    console.log(`\n✅ Found pending registration: ${pendingRegistration.fullName} (${pendingRegistration.phone})`)
    
    // Test 1: Approve registration
    console.log('\n🎉 Test 1: Approving registration...')
    const approvalResponse = await fetch(`${baseUrl}/api/admin/registrations/${pendingRegistration.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'APPROVED',
        approvedBy: 'Test Admin'
      })
    })
    
    const approvalResult = await approvalResponse.json()
    console.log('Approval result:', approvalResult.success ? '✅ Success' : '❌ Failed')
    
    if (approvalResult.success) {
      console.log('✅ Email and WhatsApp approval notifications should be sent!')
    }
    
    // Wait a bit then test rejection (untuk registration lain jika ada)
    const anotherPendingReg = registrationsData.data.find(reg => 
      reg.status === 'PENDING' && reg.id !== pendingRegistration.id
    )
    
    if (anotherPendingReg) {
      console.log('\n❌ Test 2: Rejecting another registration...')
      const rejectionResponse = await fetch(`${baseUrl}/api/admin/registrations/${anotherPendingReg.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'REJECTED',
          reason: 'Dokumen pendukung tidak lengkap. Silakan lengkapi dokumen dan daftar kembali.'
        })
      })
      
      const rejectionResult = await rejectionResponse.json()
      console.log('Rejection result:', rejectionResult.success ? '✅ Success' : '❌ Failed')
      
      if (rejectionResult.success) {
        console.log('✅ Email and WhatsApp rejection notifications should be sent!')
      }
    } else {
      console.log('\n⚠️ No other pending registration found for rejection test')
    }
    
    console.log('\n🏁 Admin Registration Flow Test Complete!')
    console.log('\n📱 Check your WhatsApp for test messages!')
    
  } catch (error) {
    console.error('❌ Test failed with error:', error)
  }
}

// Jalankan test jika file dijalankan langsung
if (typeof window === 'undefined') {
  testAdminRegistrationFlow()
}

export { testAdminRegistrationFlow }