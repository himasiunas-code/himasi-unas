<?php
/**
 * AI-Powered HIMASI Chatbot with OpenAI Integration
 * File: chatbot-ai.php (Requires API Key)
 */

// Configuration
$OPENAI_API_KEY = 'your-openai-api-key-here'; // Set your API key
$OPENAI_MODEL = 'gpt-3.5-turbo';

// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

// HIMASI Knowledge Base for AI Context
$himasi_context = "
Anda adalah asisten virtual untuk HIMASI UNAS (Himpunan Mahasiswa Sistem Informasi Universitas Nasional).

Informasi tentang HIMASI UNAS:
- Organisasi mahasiswa Program Studi Sistem Informasi
- Berlokasi di Universitas Nasional
- Mengadakan kegiatan: seminar teknologi, workshop programming, bakti sosial, study tour
- Open recruitment biasanya di awal semester
- Media sosial: Instagram @himasi.unas
- Fokus pada pengembangan akademik, profesional, dan sosial

Jawab dengan ramah, informatif, dan sesuai konteks HIMASI UNAS. Jika ditanya di luar topik HIMASI, arahkan kembali ke topik organisasi.
";

function callOpenAI($message, $context) {
    global $OPENAI_API_KEY, $OPENAI_MODEL;
    
    $data = [
        'model' => $OPENAI_MODEL,
        'messages' => [
            [
                'role' => 'system',
                'content' => $context
            ],
            [
                'role' => 'user', 
                'content' => $message
            ]
        ],
        'max_tokens' => 500,
        'temperature' => 0.7
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $OPENAI_API_KEY
    ]);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($http_code === 200) {
        $result = json_decode($response, true);
        return $result['choices'][0]['message']['content'] ?? 'Maaf, terjadi kesalahan.';
    }
    
    return null;
}

try {
    // Try AI response first
    if (!empty($OPENAI_API_KEY) && $OPENAI_API_KEY !== 'your-openai-api-key-here') {
        $ai_response = callOpenAI($message, $himasi_context);
        
        if ($ai_response) {
            echo json_encode([
                'answer' => $ai_response,
                'confidence' => 'ai-powered',
                'type' => 'AI Response'
            ]);
            exit;
        }
    }
    
    // Fallback to static FAQ if AI fails
    // Include your existing FAQ logic here as backup
    echo json_encode([
        'answer' => 'Maaf, sistem AI sedang tidak tersedia. Silakan coba lagi nanti atau hubungi admin HIMASI.',
        'confidence' => 'fallback'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => 'Service temporarily unavailable',
        'message' => 'Silakan coba lagi dalam beberapa saat.'
    ]);
}
?>