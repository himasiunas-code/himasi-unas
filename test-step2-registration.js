// Test script untuk mengecek Step 2 registration
const testData = {
  registrationId: "test-id", // Ganti dengan ID registrasi yang valid
  instagramHandle: "@test_user",
  instagramProof: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFMjiLEjMgjL/wK/H/2Q==",
  paymentMethod: "bca",
  paymentProof: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejFMjiLEjMgjL/wK/H/2Q==",
  motivation: "Test motivation",
  specialRequest: "Test special request"
};

async function testStep2Registration() {
  try {
    console.log('🧪 Testing Step 2 Registration API...');
    console.log('📦 Request data:', {
      ...testData,
      instagramProof: testData.instagramProof ? `Data URL (${testData.instagramProof.length} chars)` : null,
      paymentProof: testData.paymentProof ? `Data URL (${testData.paymentProof.length} chars)` : null
    });

    const response = await fetch('http://localhost:3000/api/registrations/step2', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

    const result = await response.json();
    console.log('📋 Response data:', result);

    if (response.ok) {
      console.log('✅ Step 2 registration test PASSED');
    } else {
      console.log('❌ Step 2 registration test FAILED');
      console.log('Error message:', result.message);
    }

  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

// Jalankan test jika dipanggil langsung
if (typeof window === 'undefined') {
  testStep2Registration();
}