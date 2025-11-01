// Test registration endpoint
async function testRegistration() {
  try {
    const testData = {
      email: 'test@example.com',
      fullName: 'Test User',
      phone: '081234567890',
      yearClass: '2024',
      faculty: 'FTKI',
      major: 'Sistem Informasi',
      instagramHandle: '@testuser',
      motivation: 'Ingin belajar web development'
    }

    const response = await fetch('http://localhost:3000/api/registrations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()
    
    if (response.ok) {
      console.log('✅ Registration successful!')
      console.log('Response:', JSON.stringify(result, null, 2))
    } else {
      console.log('❌ Registration failed!')
      console.log('Error:', JSON.stringify(result, null, 2))
    }
  } catch (error) {
    console.error('❌ Network error:', error)
  }
}

testRegistration()