// Simple Gemini API Test
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...');
  
  // Get API key from environment
  const apiKey = process.env.GOOGLE_AI_API_KEY || 'AIzaSyCCVJt7lrqk38w-20UvoWOYDOnM012OJDo';
  
  console.log('🔑 API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT SET');
  
  if (!apiKey) {
    console.error('❌ No API key provided');
    return;
  }
  
  try {
    // Initialize Gemini
    console.log('🚀 Initializing Gemini...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try to list available models first
    console.log('📋 Listing available models...');
    try {
      const models = await genAI.listModels();
      console.log('Available models:', models.map(m => m.name));
    } catch (listError) {
      console.log('Could not list models:', listError.message);
    }
    
    // Try different model names
    const modelNames = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro', 'text-bison-001'];
    
    for (const modelName of modelNames) {
      try {
        console.log(`🧪 Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = "Say hello in Indonesian";
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        console.log(`✅ SUCCESS with ${modelName}! Response:`, response);
        break; // Exit loop on success
        
      } catch (modelError) {
        console.log(`❌ ${modelName} failed:`, modelError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ ERROR:', {
      name: error.name,
      message: error.message,
      status: error.status,
      code: error.code
    });
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('🔑 The API key is invalid');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.error('🚫 Permission denied - API key might not have access');
    } else if (error.message.includes('QUOTA_EXCEEDED')) {
      console.error('📊 Quota exceeded');
    }
  }
}

// Run test
testGeminiAPI().catch(console.error);