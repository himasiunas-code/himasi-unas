<?php
/**
 * Enhanced HIMASI UNAS Chatbot dengan Learning Capability
 * File: chatbot-smart.php
 */

// Set CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);
$message = isset($input['message']) ? trim($input['message']) : '';

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

// Log all conversations for learning
function logConversation($question, $answer, $matched = true) {
    $log_entry = [
        'timestamp' => date('Y-m-d H:i:s'),
        'question' => $question,
        'answer' => $answer,
        'matched' => $matched,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ];
    
    $log_file = 'chat_logs.txt';
    file_put_contents($log_file, json_encode($log_entry) . "\n", FILE_APPEND | LOCK_EX);
}

// Enhanced FAQ with learning indicators
$faqs = [
    [
        'question' => 'Apa itu HIMASI UNAS?',
        'keywords' => ['himasi', 'apa itu', 'tentang', 'unas'],
        'answer' => 'HIMASI UNAS adalah Himpunan Mahasiswa Sistem Informasi Universitas Nasional. Kami merupakan organisasi mahasiswa yang berdedikasi untuk mengembangkan potensi akademik, profesional, dan sosial di bidang Sistem Informasi.',
        'usage_count' => 0
    ],
    [
        'question' => 'Bagaimana cara bergabung dengan HIMASI?',
        'keywords' => ['bergabung', 'gabung', 'join', 'masuk', 'daftar', 'recruitment'],
        'answer' => 'Untuk bergabung dengan HIMASI UNAS, Anda bisa mengikuti open recruitment yang biasanya diadakan di awal semester. Pantau terus media sosial kami untuk informasi terbaru tentang penerimaan anggota baru.',
        'usage_count' => 0
    ],
    [
        'question' => 'Apa saja kegiatan yang dilakukan HIMASI?',
        'keywords' => ['kegiatan', 'aktivitas', 'program', 'event', 'acara'],
        'answer' => 'HIMASI UNAS mengadakan berbagai kegiatan seperti seminar teknologi, workshop programming, pelatihan soft skills, study tour, bakti sosial, dan proyek kolaboratif. Kami juga aktif dalam kompetisi IT dan kegiatan kemahasiswaan.',
        'usage_count' => 0
    ],
    [
        'question' => 'Bagaimana cara menghubungi HIMASI?',
        'keywords' => ['kontak', 'hubungi', 'contact', 'telepon', 'wa', 'whatsapp'],
        'answer' => 'Anda dapat menghubungi kami melalui media sosial Instagram @himasi.unas, email resmi, atau datang langsung ke sekretariat HIMASI di kampus Universitas Nasional.',
        'usage_count' => 0
    ],
    // Add more FAQs...
];

// Enhanced matching with learning
function findBestMatch($message, &$faqs) {
    $message_lower = strtolower($message);
    $best_match = null;
    $best_score = 0;
    $best_index = -1;
    
    foreach ($faqs as $index => $faq) {
        $score = 0;
        
        // Check keywords with weighted scoring
        foreach ($faq['keywords'] as $keyword) {
            if (strpos($message_lower, strtolower($keyword)) !== false) {
                $score += 3; // Higher weight for exact keyword match
            }
            
            // Fuzzy matching (simple similarity)
            $similarity = similar_text($message_lower, strtolower($keyword));
            if ($similarity > 3) {
                $score += $similarity * 0.1;
            }
        }
        
        // Boost popular questions
        $popularity_boost = min($faq['usage_count'] * 0.1, 1);
        $score += $popularity_boost;
        
        if ($score > $best_score && $score > 1.5) {
            $best_score = $score;
            $best_match = $faq;
            $best_index = $index;
        }
    }
    
    // Update usage count for learning
    if ($best_index >= 0) {
        $faqs[$best_index]['usage_count']++;
        // Save updated FAQ data (in real implementation, save to database)
    }
    
    return $best_match;
}

// Generate smart fallback responses
function generateSmartFallback($message) {
    $suggestions = [];
    $keywords = explode(' ', strtolower($message));
    
    // Analyze keywords and suggest related topics
    foreach ($keywords as $word) {
        if (strlen($word) > 3) {
            if (in_array($word, ['mahasiswa', 'student', 'kampus', 'universitas'])) {
                $suggestions[] = 'Tentang HIMASI UNAS';
            }
            if (in_array($word, ['kegiatan', 'event', 'program', 'acara'])) {
                $suggestions[] = 'Kegiatan HIMASI';
            }
            if (in_array($word, ['gabung', 'join', 'daftar', 'masuk'])) {
                $suggestions[] = 'Cara bergabung dengan HIMASI';
            }
        }
    }
    
    $response = 'Maaf, saya belum memahami pertanyaan Anda. ';
    
    if (!empty($suggestions)) {
        $response .= 'Mungkin Anda ingin bertanya tentang: ' . implode(', ', array_unique($suggestions)) . '? ';
    }
    
    $response .= 'Atau coba gunakan kata kunci yang lebih spesifik seperti "HIMASI", "kegiatan", atau "bergabung".';
    
    return $response;
}

try {
    // Find best matching FAQ
    $match = findBestMatch($message, $faqs);
    
    if ($match) {
        $response = [
            'answer' => $match['answer'],
            'confidence' => 'high',
            'learned' => true
        ];
        
        // Log successful match
        logConversation($message, $match['answer'], true);
        
    } else {
        $smart_fallback = generateSmartFallback($message);
        $response = [
            'answer' => $smart_fallback,
            'confidence' => 'low',
            'learned' => false,
            'suggestions' => [
                'Apa itu HIMASI UNAS?',
                'Bagaimana cara bergabung?',
                'Apa saja kegiatan HIMASI?',
                'Bagaimana cara menghubungi HIMASI?'
            ]
        ];
        
        // Log missed question for learning
        logConversation($message, $smart_fallback, false);
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'Terjadi kesalahan dalam memproses permintaan Anda.'
    ]);
    
    // Log error
    error_log("Smart Chatbot Error: " . $e->getMessage());
}
?>