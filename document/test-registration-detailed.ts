// Test registration endpoint dengan logging yang lebih detail
async function testRegistrationDetailed() {
  try {
    console.log('🧪 Testing Registration API...')
    
    const testData = {
      email: 'test.user@example.com',
      fullName: 'Test User Registration',
      phone: '081234567890',
      yearClass: '2024',
      faculty: 'FTKI',
      major: 'Sistem Informasi',
      instagramHandle: '@testuser',
      motivation: 'Ingin belajar web development dengan Next.js'
    }

    console.log('📤 Sending request to /api/registrations with data:', JSON.stringify(testData, null, 2))

    const response = await fetch('http://localhost:3000/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    console.log('📥 Response status:', response.status)
    console.log('📥 Response headers:', [...response.headers.entries()])
    
    const result = await response.json()
    
    console.log('📥 Response body:', JSON.stringify(result, null, 2))
    
    if (response.ok) {
      console.log('✅ Registration API working!')
      if (result.success) {
        console.log('✅ Success flag is true')
      } else {
        console.log('❌ Success flag is false:', result.message)
      }
    } else {
      console.log('❌ Registration API failed!')
      console.log('Error details:', result)
    }
  } catch (error) {
    console.error('❌ Network/Parse error:', error)
  }
}

testRegistrationDetailed()