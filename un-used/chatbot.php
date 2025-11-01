<?php
/**
 * HIMASI UNAS FAQ Chatbot - Alternative endpoint to avoid firewall
 * File: chatbot.php (di root public_html)
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

// FAQ Database
$faqs = [
    [
        'question' => 'Apa itu HIMASI UNAS?',
        'keywords' => ['himasi', 'apa itu', 'tentang'],
        'answer' => 'HIMASI UNAS adalah Himpunan Mahasiswa Sistem Informasi Universitas Nasional. Kami merupakan organisasi mahasiswa yang berdedikasi untuk mengembangkan potensi akademik, profesional, dan sosial di bidang Sistem Informasi.'
    ],
    [
        'question' => 'Apa visi dan misi HIMASI UNAS?',
        'keywords' => ['visi', 'misi', 'tujuan'],
        'answer' => 'Visi: Menjadi wadah pengembangan mahasiswa Sistem Informasi yang unggul, kreatif, dan berkarakter. Misi: Mengembangkan potensi akademik dan profesional mahasiswa, membangun jejaring yang solid, dan menciptakan lingkungan belajar yang inspiratif.'
    ],
    [
        'question' => 'Bagaimana cara bergabung dengan HIMASI?',
        'keywords' => ['bergabung', 'gabung', 'join', 'masuk', 'daftar'],
        'answer' => 'Untuk bergabung dengan HIMASI UNAS, Anda bisa mengikuti open recruitment yang biasanya diadakan di awal semester. Pantau terus media sosial kami untuk informasi terbaru tentang penerimaan anggota baru.'
    ],
    [
        'question' => 'Apa saja kegiatan yang dilakukan HIMASI?',
        'keywords' => ['kegiatan', 'aktivitas', 'program', 'event'],
        'answer' => 'HIMASI UNAS mengadakan berbagai kegiatan seperti seminar teknologi, workshop programming, pelatihan soft skills, study tour, bakti sosial, dan proyek kolaboratif. Kami juga aktif dalam kompetisi IT dan kegiatan kemahasiswaan.'
    ],
    [
        'question' => 'Siapa pengurus HIMASI UNAS saat ini?',
        'keywords' => ['pengurus', 'struktur', 'organisasi', 'ketua'],
        'answer' => 'Struktur keorganisasian HIMASI UNAS dipimpin oleh Ketua Umum beserta jajarannya. Untuk informasi lengkap tentang struktur organisasi terkini, silakan kunjungi halaman Struktur di website kami.'
    ],
    [
        'question' => 'Bagaimana cara menghubungi HIMASI?',
        'keywords' => ['kontak', 'hubungi', 'contact', 'telepon'],
        'answer' => 'Anda dapat menghubungi kami melalui media sosial Instagram @himasi.unas, email resmi, atau datang langsung ke sekretariat HIMASI di kampus Universitas Nasional.'
    ],
    [
        'question' => 'Apakah ada biaya untuk bergabung?',
        'keywords' => ['biaya', 'bayar', 'iuran', 'gratis'],
        'answer' => 'Informasi mengenai biaya keanggotaan akan dijelaskan saat proses recruitment. HIMASI berkomitmen untuk memberikan nilai lebih kepada setiap anggotanya melalui berbagai program pengembangan.'
    ],
    [
        'question' => 'Apa benefit menjadi anggota HIMASI?',
        'keywords' => ['manfaat', 'benefit', 'keuntungan', 'untung'],
        'answer' => 'Sebagai anggota HIMASI, Anda akan mendapat akses ke workshop eksklusif, networking dengan alumni dan profesional IT, sertifikat kegiatan, pengembangan soft skills, dan kesempatan magang di perusahaan partner.'
    ],
    [
        'question' => 'Apa program kerja unggulan HIMASI?',
        'keywords' => ['program kerja', 'unggulan', 'favorit', 'utama'],
        'answer' => 'Program kerja unggulan HIMASI UNAS meliputi: Program pengembangan akademik mahasiswa SI, Pelatihan teknologi terkini, Kompetisi internal dan eksternal, Kegiatan pengabdian masyarakat, Event networking dengan industri IT, Program mentoring untuk mahasiswa baru.'
    ],
    [
        'question' => 'Dimana lokasi sekretariat HIMASI?',
        'keywords' => ['lokasi', 'tempat', 'alamat', 'sekretariat', 'kantor'],
        'answer' => 'Sekretariat HIMASI UNAS berada di lingkungan kampus Universitas Nasional. Untuk informasi lokasi yang lebih detail, Anda bisa menghubungi pengurus aktif atau mengecek media sosial resmi HIMASI UNAS.'
    ]
];

/**
 * Find best matching FAQ based on keywords
 */
function findBestMatch($message, $faqs) {
    $message_lower = strtolower($message);
    $best_match = null;
    $best_score = 0;
    
    foreach ($faqs as $faq) {
        $score = 0;
        
        // Check keywords
        foreach ($faq['keywords'] as $keyword) {
            if (strpos($message_lower, strtolower($keyword)) !== false) {
                $score += 2; // Higher weight for exact keyword match
            }
        }
        
        // Check question similarity
        $question_words = explode(' ', strtolower($faq['question']));
        $message_words = explode(' ', $message_lower);
        
        foreach ($message_words as $word) {
            if (strlen($word) > 2) { // Ignore short words
                foreach ($question_words as $qword) {
                    if (strpos($qword, $word) !== false || strpos($word, $qword) !== false) {
                        $score += 1;
                    }
                }
            }
        }
        
        if ($score > $best_score && $score > 0) {
            $best_score = $score;
            $best_match = $faq;
        }
    }
    
    return $best_match;
}

try {
    // Find best matching FAQ
    $match = findBestMatch($message, $faqs);
    
    if ($match) {
        $response = [
            'answer' => $match['answer'],
            'confidence' => 'high'
        ];
    } else {
        $response = [
            'answer' => 'Maaf, saya belum memahami pertanyaan Anda. Silakan tanyakan tentang HIMASI UNAS, cara bergabung, kegiatan yang ada, atau hal-hal terkait organisasi mahasiswa Sistem Informasi UNAS. Anda juga bisa menggunakan kata kunci yang lebih spesifik.',
            'confidence' => 'low',
            'suggestions' => [
                'Apa itu HIMASI UNAS?',
                'Bagaimana cara bergabung?',
                'Apa saja kegiatan HIMASI?'
            ]
        ];
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => 'Terjadi kesalahan dalam memproses permintaan Anda.'
    ]);
}
?>