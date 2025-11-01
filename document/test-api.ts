// Test API endpoints untuk memastikan integrasi dengan Neon database berjalan
// Jalankan dengan: npx tsx test-api.ts

console.log('🧪 Testing HIMASI Registration API with Neon Database...\n')

const API_BASE = 'http://localhost:3000/api'

// Test 1: Get Activities
async function testGetActivities() {
  console.log('1️⃣ Testing GET /api/activities...')
  try {
    const response = await fetch(`${API_BASE}/activities?published=true`)
    const data = await response.json()
    
    if (data.success && data.data.length > 0) {
      console.log('✅ Activities API working!')
      console.log(`   Found ${data.data.length} activities`)
      console.log(`   Sample: ${data.data[0].title}`)
      return data.data[0] // Return first activity for testing
    } else {
      console.log('❌ No activities found')
      return null
    }
  } catch (error) {
    console.log('❌ Activities API error:', error instanceof Error ? error.message : String(error))
    return null
  }
}

// Test 2: Submit Registration  
async function testSubmitRegistration(activity: any) {
  console.log('\n2️⃣ Testing POST /api/registrations...')
  
  if (!activity) {
    console.log('❌ Cannot test registration - no activity available')
    return
  }

  const testRegistration = {
    activityId: activity.id,
    email: `test-${Date.now()}@example.com`, // Unique email
    fullName: 'Test User Registration',
    phone: '08123456789',
    yearClass: '2020',
    faculty: 'FTKI',
    major: 'Sistem Informasi',
    instagramHandle: '@testuser',
    motivation: 'Testing registration system',
    specialRequest: 'No special request',
    instagramProof: 'test-screenshot.jpg'
  }

  try {
    const response = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRegistration)
    })

    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Registration API working!')
      console.log(`   Registration ID: ${data.data.id}`)
      console.log(`   Activity: ${data.data.activity.title}`)
      console.log('   ✅ Data tersimpan ke Neon database!')
    } else {
      console.log('❌ Registration failed:', data.message)
    }
  } catch (error) {
    console.log('❌ Registration API error:', error instanceof Error ? error.message : String(error))
  }
}

// Test 3: Get Registrations
async function testGetRegistrations() {
  console.log('\n3️⃣ Testing GET /api/registrations...')
  try {
    const response = await fetch(`${API_BASE}/registrations`)
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ Get registrations API working!')
      console.log(`   Found ${data.data.length} registrations in database`)
      if (data.data.length > 0) {
        console.log(`   Latest: ${data.data[0].fullName} - ${data.data[0].email}`)
      }
    } else {
      console.log('❌ Get registrations failed:', data.message)
    }
  } catch (error) {
    console.log('❌ Get registrations API error:', error instanceof Error ? error.message : String(error))
  }
}

// Run all tests
async function runTests() {
  const activity = await testGetActivities()
  await testSubmitRegistration(activity)
  await testGetRegistrations()
  
  console.log('\n🎉 Testing completed!')
  console.log('\n📝 Next steps:')
  console.log('   1. Open http://localhost:3000/kegiatan')
  console.log('   2. Click "Daftar Sekarang" when status is open')
  console.log('   3. Fill the registration form at /pendaftaran')
  console.log('   4. Submit and check if data appears in Neon database')
  console.log('   5. Use Prisma Studio to view data: npm run db:studio')
}

// Run tests
runTests().catch(console.error)