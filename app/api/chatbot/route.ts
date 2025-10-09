import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface FAQ {
  id: string;
  question: string;
  answers: string[]; // Changed from single answer to multiple answers
  keywords: string[];
}

interface FAQData {
  faqs: FAQ[];
}

interface ConversationContext {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
}

type AIProvider = 'openai' | 'gemini' | 'faq';

interface GoogleGenerativeModel {
  generateContent: (prompt: string) => Promise<{
    response: {
      text: () => string;
    };
  }>;
  model?: string;
}

class HimasiAIBot {
  private faqs: FAQ[] = [];
  private openai: OpenAI | null = null;
  private gemini: GoogleGenerativeModel | null = null;
  private himasiContext: string = '';
  private aiProvider: AIProvider = 'faq';

  constructor() {
    this.loadFAQs();
    this.setupAIContext();
    this.initializeAI();
  }

  private setupAIContext() {
    // Create comprehensive knowledge base from FAQ data
    const faqKnowledge = this.faqs.map(faq => {
      const randomAnswer = this.getRandomAnswer(faq.answers);
      return `Q: ${faq.question}\nA: ${randomAnswer}`;
    }).join('\n\n');

    this.himasiContext = `You are an AI assistant for HIMASI UNAS (Himpunan Mahasiswa Sistem Informasi Universitas Nasional Jakarta), by the name of SIBot (Sistem Informasi Bot).

HIMASI UNAS Knowledge Base:
${faqKnowledge}

Additional Context:
- Organization: Student association for Information Systems program at Universitas Nasional Jakarta
- Purpose: Supporting Information Systems students in academic, professional, and social development
- Activities: Technology seminars, programming workshops, IT competitions, hackathons, social service, leadership training
- Membership: Open to all Information Systems students at UNAS, from freshmen to final year students
- Contact Methods: 
  - Email: himasiunas@gmail.com
  - WhatsApp: Available for quick communication
  - Physical: Secretariat at UNAS campus
  - Website: Complete information available on official website
- Events: Regular events throughout academic year including tech talks, coding workshops, competitions, and community service
- Community: Welcoming environment for students to learn, grow, and contribute to technology field
- Building website use modern technologies with Next.js, TypeScript, Tailwind CSS

Member of HIMASI UNAS:
- Executive board:
    - student association president: Omar Nur Rahmatsyah
    - student association vice president: Mohammad Fahreza Situmorang
    - student association secretary: Linda Isnaeni
    - student association treasurer: Kyla Nazwara Sofyan

- Division Public Relation (PR):
    - Leysa Regita Parhusip (Ketua Divisi)
    - Muhammad Arkan Zahy (Anggota)
    - Muhammad Evan Elua (Anggota)
    - Beatriks Maria (Anggota)

- Research and Development (R&D):
    - Raden Whisnu Arya Nugraha (Ketua Divisi)
    - Fadel Muhammad Yusuf (Anggota)
    - Muhammad Zidan (Anggota)
    - Aditya Saputra (Anggota)

- Creative Media (CM):
    - Azzahra Dara Febrianti (Ketua Divisi)
    - Galang Rispa'i (Anggota)
    - Gibran Hidayat Tullah (Anggota)
    - Shandy Shyarief Setiawan (Anggota)
    - Fadhil Alif (Anggota)

- Entrepreneurship (ENT):
    - Laili Salsabila (Ketua Divisi)
    - Cakrawangwa Ilmi Ciptadi (Anggota)
    - Kayla Melinda Nggule (Anggota)
    - Jihan Ainun Zalfa (Anggota)
    - Fiesda Sekar Prastica (Anggota)

Raden Whisnu Arya Nugraha is the person who created this chatbot system and website.
use Indonesian language for all responses.

Personality & Communication Style:
- Be helpful, friendly, and encouraging
- Use mix of Indonesian and casual language when appropriate (like "kami", "kamu", "banget", "kok", "ya")
- Show enthusiasm for technology and student development
- Encourage participation in HIMASI activities
- Be inclusive and welcoming to all students
- Provide practical, actionable advice
- Use emojis occasionally (😊 💻 🚀 🎉 🏆) to be friendly
- Be conversational and engaging like talking to a friend

Guidelines:
- Focus on HIMASI UNAS related topics
- Use the knowledge base above to answer questions accurately
- If you don't know specific details, suggest contacting HIMASI directly
- Encourage students to join activities and get involved
- Provide specific, useful information when possible
- Ask follow-up questions to better assist users
- Show genuine interest in helping students succeed
- Always be positive and supportive

Response Style Examples:
- Instead of formal "Anda dapat", use "Kamu bisa" or "Kamu dapat"
- Use casual expressions like "Wah, keren!", "Gampang banget!", "Seru banget!"
- End with engaging questions like "Mau tau lebih lanjut?", "Ada yang pengen ditanyain lagi?"
- Show enthusiasm with expressions like "Mantap!", "Keren banget!", "Pasti seru!"

FORMATTING REQUIREMENTS:
- Use **bold text** for important points, names, or emphasis
- Use bullet points (•) for lists of items or features
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Use line breaks for better readability between sections
- Keep paragraphs short and easy to read
- Structure information clearly with proper spacing

Remember: You're representing HIMASI UNAS brand as a friendly, tech-savvy, and supportive community for Information Systems students.`;
  }

  private async initializeAI() {
    // Determine which AI provider to use
    const preferredProvider = process.env.AI_PROVIDER || 'auto';
    
    console.log(`🤖 Initializing AI with provider preference: ${preferredProvider}`);

    // Try to initialize providers based on available API keys
    const providersInitialized: string[] = [];

    // Initialize Google Gemini
    const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('🔍 Checking Gemini API Key:', geminiApiKey ? `${geminiApiKey.substring(0, 10)}...` : 'NOT SET');
    
    if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
      try {
        console.log('🚀 Initializing Google Gemini...');
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        this.gemini = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        providersInitialized.push('gemini');
        console.log('✅ Google Gemini initialized successfully with model: gemini-2.0-flash');
        
        if (preferredProvider === 'gemini' || preferredProvider === 'auto') {
          this.aiProvider = 'gemini';
        }
      } catch (error) {
        console.error('❌ Failed to initialize Google Gemini:', error);
      }
    } else {
      console.warn('⚠️ GOOGLE_AI_API_KEY not found or using placeholder');
    }

    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        providersInitialized.push('openai');
        console.log('✅ OpenAI initialized successfully');
        
        if (preferredProvider === 'openai') {
          this.aiProvider = 'openai';
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize OpenAI:', error);
      }
    }

    // Set provider priority: Gemini > OpenAI > FAQ
    if (this.aiProvider === 'faq' && providersInitialized.length > 0) {
      this.aiProvider = providersInitialized.includes('gemini') ? 'gemini' : 'openai';
    }

    console.log(`🎯 Active AI provider: ${this.aiProvider}`);
    console.log(`📋 Available providers: ${providersInitialized.join(', ') || 'FAQ only'}`);
  }

  private loadFAQs() {
    // FAQ Data - in production, this could be loaded from a database or external API
    const faqData: FAQData = {
      faqs: [
        {
          id: "1",
          question: "Apa itu HIMASI UNAS?",
          answers: [
            "HIMASI UNAS adalah Himpunan Mahasiswa Sistem Informasi Universitas Nasional Jakarta. Kami adalah organisasi kemahasiswaan yang menaungi mahasiswa Program Studi Sistem Informasi.",
            "HIMASI UNAS merupakan organisasi mahasiswa untuk Program Studi Sistem Informasi di Universitas Nasional Jakarta. Kami berkomitmen mengembangkan potensi mahasiswa di bidang teknologi informasi.",
            "Singkatan dari Himpunan Mahasiswa Sistem Informasi UNAS! Kami adalah wadah bagi mahasiswa SI untuk berkembang, berkreasi, dan berkolaborasi dalam dunia teknologi informasi.",
            "HIMASI UNAS adalah rumah bagi mahasiswa Sistem Informasi Universitas Nasional Jakarta. Di sini, kami belajar, bertumbuh, dan menciptakan dampak positif melalui teknologi.",
            "Kami adalah HIMASI UNAS - komunitas mahasiswa Sistem Informasi yang aktif di Universitas Nasional Jakarta. Bersama-sama membangun masa depan teknologi informasi Indonesia!"
          ],
          keywords: ["himasi", "unas", "himpunan", "mahasiswa", "sistem informasi", "organisasi", "apa", "apaan", "apa itu", "himasi unas", "definisi", "pengertian", "arti"]
        },
        {
          id: "2", 
          question: "Bagaimana cara mendaftar kegiatan HIMASI?",
          answers: [
            "Untuk mendaftar kegiatan HIMASI, Anda dapat mengunjungi halaman Kegiatan di website kami, pilih kegiatan yang diinginkan, dan klik tombol 'Daftar Sekarang'. Pastikan mengisi formulir pendaftaran dengan lengkap.",
            "Gampang banget! Buka website HIMASI UNAS, masuk ke menu Kegiatan, pilih event yang kamu minati, lalu klik 'Daftar Sekarang'. Jangan lupa isi data dengan benar ya!",
            "Caranya simple kok! Cek halaman Kegiatan di website kami, temukan acara yang cocok untukmu, dan langsung daftar dengan mengklik tombol pendaftaran. Semua prosesnya online!",
            "Mau ikut kegiatan HIMASI? Tinggal buka website resmi kami, browse ke section Kegiatan, pilih yang menarik, dan submit form pendaftarannya. Easy peasy!",
            "Prosesnya mudah! Kunjungi website HIMASI UNAS → Menu Kegiatan → Pilih event favorit → Klik 'Daftar Sekarang' → Isi form dengan lengkap. Done!"
          ],
          keywords: ["daftar", "kegiatan", "pendaftaran", "formulir", "mendaftar"]
        },
        {
          id: "3",
          question: "Kapan kegiatan HIMASI biasanya diadakan?",
          answers: [
            "Kegiatan HIMASI diadakan secara berkala sepanjang tahun akademik. Untuk informasi jadwal terbaru, silakan pantau website resmi kami atau follow media sosial HIMASI UNAS.",
            "Kami rutin mengadakan berbagai kegiatan setiap semester! Jadwal lengkapnya bisa kamu cek di website atau follow Instagram @himasi_unas untuk update terbaru.",
            "Sepanjang tahun akademik selalu ada kegiatan seru dari HIMASI! Stay tuned di website dan sosial media kami untuk info jadwal dan pendaftaran terbaru.",
            "Event HIMASI ada terus sepanjang tahun kuliah kok! Mulai dari workshop, seminar, sampai kompetisi. Pantau terus website dan IG kami ya biar gak ketinggalan info!",
            "Kegiatan kami berjalan konsisten setiap semester dengan berbagai macam acara menarik. Follow social media HIMASI UNAS untuk mendapat notifikasi jadwal kegiatan terbaru!"
          ],
          keywords: ["kapan", "jadwal", "kegiatan", "waktu", "tanggal"]
        },
        {
          id: "4",
          question: "Siapa saja yang bisa bergabung dengan HIMASI?",
          answers: [
            "Semua mahasiswa Program Studi Sistem Informasi Universitas Nasional Jakarta dapat bergabung dengan HIMASI UNAS. Kami terbuka untuk semua mahasiswa yang ingin berkontribusi dan mengembangkan diri.",
            "All welcome! Seluruh mahasiswa Sistem Informasi UNAS bisa join HIMASI. Gak peduli semester berapa, yang penting punya semangat untuk berkembang bersama!",
            "HIMASI terbuka untuk semua mahasiswa SI UNAS, dari yang baru masuk sampai yang mau lulus. Yang penting ada niat buat contribute dan grow together!",
            "Siapa aja boleh gabung asal mahasiswa Sistem Informasi UNAS! Kami welcome banget sama fresh blood yang pengen aktif dan berkontribusi untuk kemajuan organisasi.",
            "Pintu HIMASI UNAS terbuka lebar untuk seluruh mahasiswa Program Studi Sistem Informasi. Dari angkatan muda sampai senior, semua bisa jadi bagian dari keluarga besar kami!"
          ],
          keywords: ["siapa", "bergabung", "anggota", "member", "mahasiswa"]
        },
        {
          id: "5",
          question: "Bagaimana cara menghubungi HIMASI UNAS?",
          answers: [
            "Anda dapat menghubungi HIMASI UNAS melalui berbagai cara: email di himasi@unas.ac.id, WhatsApp, atau datang langsung ke sekretariat kami di kampus UNAS. Informasi kontak lengkap tersedia di halaman Hubungi Kami.",
            "Banyak cara buat contact kami! Bisa email ke himasi@unas.ac.id, chat WhatsApp, atau mampir langsung ke sekretariat HIMASI di kampus. Cek halaman 'Hubungi Kami' untuk info lengkap!",
            "Mau ngobrol sama HIMASI? Hit us up via email himasi@unas.ac.id, WhatsApp, atau dateng aja ke sekret kami di kampus UNAS. All contact details ada di website kami!",
            "Ada beberapa channel untuk reach out ke kami: email official di himasi@unas.ac.id, WhatsApp untuk chat cepat, atau visit langsung sekretariat HIMASI. Check our 'Contact Us' page ya!",
            "Connect with us mudah banget! Email: himasi@unas.ac.id, WhatsApp untuk urgent matters, atau drop by ke sekretariat HIMASI di kampus. Lengkapnya ada di halaman kontak website kami!"
          ],
          keywords: ["hubungi", "kontak", "email", "whatsapp", "sekretariat", "cara hubungi", "contact", "telepon", "alamat"]
        },
        {
          id: "6",
          question: "Apa saja kegiatan yang diselenggarakan HIMASI?",
          answers: [
            "HIMASI UNAS menyelenggarakan berbagai kegiatan seperti seminar teknologi, workshop programming, kompetisi IT, bakti sosial, dan kegiatan pengembangan soft skills lainnya.",
            "Banyak banget kegiatan seru di HIMASI! Ada tech seminar, coding workshop, IT competition, social service, leadership training, dan masih banyak lagi. Pokoknya lengkap deh!",
            "Event HIMASI itu variatif banget! Mulai dari seminar teknologi terkini, workshop programming hands-on, kompetisi IT tingkat nasional, baksos, sampai soft skills development. Always something for everyone!",
            "HIMASI punya agenda kegiatan yang super diverse! Tech talks dengan praktisi industri, intensive coding workshops, hackathon competitions, community service projects, dan program pengembangan diri lainnya.",
            "Ragam kegiatan HIMASI itu wow! Seminar dengan speaker expert, workshop programming dari basic sampai advanced, berbagai kompetisi IT, kegiatan sosial, dan training untuk upgrade skills. Join us dan rasakan pengalaman seru!"
          ],
          keywords: ["kegiatan", "seminar", "workshop", "kompetisi", "program", "acara"]
        }
      ]
    };
    
    this.faqs = faqData.faqs;
    console.log(`✅ Loaded ${this.faqs.length} FAQs`);
  }

  private similarity(a: string, b: string): number {
    const longer = a.length > b.length ? a : b;
    const shorter = a.length > b.length ? b : a;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private getRandomAnswer(answers: string[]): string {
    const randomIndex = Math.floor(Math.random() * answers.length);
    return answers[randomIndex];
  }

  // Format AI response for better display
  private formatResponse(response: string): string {
    let formatted = response;
    
    // First, normalize line breaks
    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Fix bullet points - handle various formats and ensure proper line breaks
    formatted = formatted.replace(/^[\s]*[\*\-\•]\s*/gm, '• ');
    formatted = formatted.replace(/(\w)[\s]*•/g, '$1\n• '); // Add line break before bullets if missing
    
    // Fix numbered lists - ensure proper format with line breaks
    formatted = formatted.replace(/^[\s]*(\d+)\.[\s]*/gm, '$1. ');
    formatted = formatted.replace(/(\w)[\s]*(\d+)\./g, '$1\n$2.'); // Add line break before numbers if missing
    
    // Fix markdown bold formatting - convert **text** to proper bold (keep for frontend processing)
    // No conversion needed as frontend will handle **text**
    
    // Ensure proper spacing around bullet points and numbered lists
    formatted = formatted.replace(/•[\s]*([^\n])/g, '• $1');
    formatted = formatted.replace(/(\d+)\.[\s]*([^\n])/g, '$1. $2');
    
    // Clean up multiple spaces but preserve line structure
    formatted = formatted.replace(/[ \t]+/g, ' ').trim();
    
    // Ensure each bullet/number is on its own line
    formatted = formatted.replace(/([^.\n])[\s]*\n[\s]*•/g, '$1\n\n•');
    formatted = formatted.replace(/([^.\n])[\s]*\n[\s]*(\d+\.)/g, '$1\n\n$2');
    
    // Clean up excessive line breaks while preserving structure
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
    
    return formatted;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // AI Generative Response (supports multiple providers)
  private async getAIResponse(question: string, conversationHistory?: ConversationContext): Promise<string> {
    console.log(`🤖 Using AI provider: ${this.aiProvider}`);

    switch (this.aiProvider) {
      case 'gemini':
        return await this.getGeminiResponse(question);
      case 'openai':
        return await this.getOpenAIResponse(question, conversationHistory);
      default:
        throw new Error('Tidak ada AI provider yang tersedia. Menggunakan FAQ system.');
    }
  }

  // Google Gemini Response
  private async getGeminiResponse(question: string): Promise<string> {
    if (!this.gemini) {
      throw new Error('Google Gemini belum siap. Silakan coba lagi nanti. 😊');
    }

    try {
      console.log('🟢 Generating Gemini response for:', question);
      console.log('🔧 Gemini model:', this.gemini.model);
      
      // Create enhanced prompt with formatting guidelines
      const prompt = `${this.himasiContext}

IMPORTANT FORMATTING GUIDELINES:
- Use **bold text** for important points or emphasis
- Use bullet points with • or - for lists
- Use numbered lists (1. 2. 3.) when showing steps
- Keep paragraphs short and readable
- Use emojis appropriately for friendly tone
- Structure information clearly with proper spacing

User Question: ${question}

Please respond in Indonesian with proper formatting and structure:`;
      
      console.log('📝 Sending prompt to Gemini...');
      const result = await this.gemini.generateContent(prompt);
      
      console.log('📦 Gemini raw result:', result);
      const geminiResponse = result.response.text().trim();
      console.log('📄 Gemini response text:', geminiResponse);
      
      if (geminiResponse && geminiResponse.length > 5) {
        console.log('✅ Gemini response generated successfully');
        // Process formatting for better display
        const formattedResponse = this.formatResponse(geminiResponse);
        return formattedResponse;
      } else {
        console.warn('⚠️ Gemini response too short or empty');
        throw new Error('Empty response from Gemini');
      }
    } catch (error: unknown) {
      const err = error as Error & { status?: number; message?: string; code?: string; name?: string; stack?: string };
      console.error('❌ Gemini Error Details:', {
        name: err.name,
        message: err.message,
        status: err.status,
        code: err.code,
        stack: err.stack?.substring(0, 500),
        error: error
      });
      
      // Check for specific Gemini errors
      if (err.message?.includes('API_KEY_INVALID')) {
        console.error('🔑 Invalid Gemini API Key');
        throw new Error('Gemini API Key tidak valid. Periksa konfigurasi GOOGLE_AI_API_KEY.');
      } else if (err.message?.includes('QUOTA_EXCEEDED')) {
        console.error('🚫 Gemini quota exceeded');
        throw new Error('Quota Gemini terlampaui. Coba lagi nanti.');
      }
      
      // For hybrid mode, throw error to allow fallback
      const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';
      if (chatbotMode === 'hybrid') throw error;
      
      return 'Maaf, sistem Gemini AI sedang mengalami kendala. Silakan coba lagi dalam beberapa saat! 🤖';
    }
  }

  // OpenAI Response (renamed from getAIResponse)
  private async getOpenAIResponse(question: string, conversationHistory?: ConversationContext): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI belum siap. Silakan coba lagi nanti. 😊');
    }

    try {
      console.log('🤖 Generating OpenAI response for:', question);
      
      const messages = [
        { role: 'system' as const, content: this.himasiContext },
        ...(conversationHistory?.messages || []),
        { role: 'user' as const, content: question }
      ];

      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 500,
        temperature: 0.8, // Slightly higher for more creative responses
      });

      const aiResponse = completion.choices[0]?.message?.content?.trim();
      
      if (aiResponse && aiResponse.length > 10) {
        console.log('✅ OpenAI response generated successfully');
        // Process formatting for better display
        const formattedResponse = this.formatResponse(aiResponse);
        return formattedResponse;
      } else {
        console.warn('⚠️ OpenAI response too short or empty');
        return 'Maaf, saya tidak bisa memberikan jawaban yang tepat untuk pertanyaan ini. Bisa coba tanya dengan cara yang berbeda? Atau hubungi langsung HIMASI UNAS ya! 😊';
      }
    } catch (error: unknown) {
      const err = error as Error & { status?: number; message?: string; code?: string; type?: string };
      console.error('❌ OpenAI Error Details:', {
        message: err.message,
        status: err.status,
        type: err.type,
        code: err.code,
        error: error
      });
      
      // For hybrid mode, throw error to allow fallback
      const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';
      
      // Check for specific error types
      if (err.status === 401) {
        console.error('🔑 Invalid API Key - Please check OPENAI_API_KEY');
        if (chatbotMode === 'hybrid') throw error;
        return 'API Key tidak valid. Silakan periksa konfigurasi OpenAI API key. 🔑';
      } else if (err.status === 429) {
        console.error('🚫 Rate limit exceeded or quota exceeded');
        if (chatbotMode === 'hybrid') throw error;
        return 'Quota OpenAI terlampaui. Silakan coba lagi nanti atau periksa billing account OpenAI. 💳';
      } else if (err.status === 500) {
        console.error('🔧 OpenAI server error');
        if (chatbotMode === 'hybrid') throw error;
        return 'Server OpenAI sedang bermasalah. Silakan coba beberapa saat lagi. 🔧';
      }
      
      // For other errors or pure AI mode
      if (chatbotMode === 'hybrid') throw error;
      return 'Maaf, sistem AI sedang mengalami kendala. Silakan coba lagi dalam beberapa saat, atau hubungi HIMASI UNAS untuk bantuan langsung! 💬';
    }
  }



  // Original FAQ-based response (renamed for clarity)
  public getFAQResponse(question: string): string {
    console.log(`🔍 Processing question: ${question}`);
    
    if (!question || !question.trim()) {
      return "Silakan ajukan pertanyaan kepada saya!";
    }

    const questionClean = question.toLowerCase().trim().replace(/[^\w\s]/g, '');
    let bestMatch: FAQ | null = null;
    let bestScore = 0;

    // Improved matching algorithm
    for (const faq of this.faqs) {
      const faqQuestion = faq.question.toLowerCase();
      const questionWords = questionClean.split(/\s+/);
      const faqWords = faqQuestion.replace(/[^\w\s]/g, '').split(/\s+/);
      const keyWords = faq.keywords.map(k => k.toLowerCase());
      
      let score = 0;
      
      // 1. Exact keyword matching with priority weights
      let keywordMatches = 0;
      let importantKeywordMatches = 0;
      
      for (const word of questionWords) {
        // Check if word matches any keyword
        const matchesKeyword = keyWords.some(k => k.includes(word) || word.includes(k));
        const matchesFaqWord = faqWords.includes(word);
        
        if (matchesKeyword || matchesFaqWord) {
          keywordMatches++;
          
          // Give extra weight to important keywords
          if (word === 'himasi' || word === 'unas' || word === 'apa' || word === 'apaan') {
            importantKeywordMatches++;
          }
        }
      }
      
      // 2. Calculate keyword match ratio
      const keywordRatio = keywordMatches / questionWords.length;
      
      // 3. Important keyword bonus
      const importantBonus = importantKeywordMatches * 0.3;
      
      // 4. Specific pattern matching for "apa itu" questions
      let patternBonus = 0;
      if ((questionClean.includes('apa') || questionClean.includes('apaan')) && 
          (questionClean.includes('himasi') || questionClean.includes('unas'))) {
        if (faq.id === "1") { // "Apa itu HIMASI UNAS?" FAQ
          patternBonus = 0.5; // Strong bonus for exact match
        }
      }
      
      // 5. Question type detection
      let questionTypeBonus = 0;
      if (questionClean.includes('daftar') || questionClean.includes('pendaftaran')) {
        if (faq.id === "2") questionTypeBonus = 0.4;
      } else if (questionClean.includes('kapan') || questionClean.includes('jadwal')) {
        if (faq.id === "3") questionTypeBonus = 0.4;
      } else if (questionClean.includes('siapa') || questionClean.includes('bergabung')) {
        if (faq.id === "4") questionTypeBonus = 0.4;
      } else if (questionClean.includes('hubungi') || questionClean.includes('kontak')) {
        if (faq.id === "5") questionTypeBonus = 0.4;
      } else if (questionClean.includes('kegiatan') || questionClean.includes('acara')) {
        if (faq.id === "6") questionTypeBonus = 0.4;
      }
      
      // 6. String similarity (lower weight)
      const similarityScore = this.similarity(questionClean, faqQuestion);
      
      // 7. Combined scoring with proper weights
      score = (keywordRatio * 0.4) + 
              (importantBonus * 0.3) + 
              (patternBonus * 0.2) + 
              (questionTypeBonus * 0.2) + 
              (similarityScore * 0.1);
      
      console.log(`📊 FAQ ${faq.id}: '${faq.question.substring(0, 40)}...' - Score: ${score.toFixed(3)} (keyword: ${keywordRatio.toFixed(2)}, important: ${importantBonus.toFixed(2)}, pattern: ${patternBonus.toFixed(2)}, type: ${questionTypeBonus.toFixed(2)}, similarity: ${similarityScore.toFixed(2)})`);
      
      if (score > bestScore && score > 0.3) { // Minimum threshold
        bestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch) {
      const selectedAnswer = this.getRandomAnswer(bestMatch.answers);
      console.log(`✅ Best match found: FAQ ${bestMatch.id} with score: ${bestScore.toFixed(3)}`);
      console.log(`🎲 Selected answer variant: ${selectedAnswer.substring(0, 50)}...`);
      return selectedAnswer;
    }
    
    console.log("❌ No suitable match found");
    return "Maaf, saya tidak menemukan jawaban untuk pertanyaan tersebut. Silakan coba dengan kata kunci yang berbeda atau hubungi tim support kami melalui halaman Hubungi Kami.";
  }

  // Main response method (supports multiple modes)
  public async getResponse(question: string, conversationHistory?: ConversationContext): Promise<string> {
    console.log(`🤖 Processing question: ${question}`);
    
    if (!question || !question.trim()) {
      return "Halo! Saya asisten HIMASI UNAS. Ada yang bisa saya bantu tentang organisasi kami? 😊";
    }

    const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';
    console.log(`🔧 Chatbot mode: ${chatbotMode}`);

    switch (chatbotMode) {
      case 'ai':
        // Pure AI mode
        return await this.getAIResponse(question, conversationHistory);
        
      case 'faq':
        // Pure FAQ mode
        return this.getFAQResponse(question);
        
      case 'hybrid':
      default:
        // Hybrid mode: Try AI first, fallback to FAQ
        try {
          return await this.getAIResponse(question, conversationHistory);
        } catch {
          console.log('🔄 AI failed, falling back to FAQ system');
          return this.getFAQResponse(question);
        }
    }
  }
}

// Initialize bot instance
const himasiBot = new HimasiAIBot();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const response = await himasiBot.getResponse(question);

    return NextResponse.json({
      success: true,
      data: {
        question,
        answer: response,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        success: false 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "HIMASI UNAS Chatbot API",
    status: "active",
    endpoints: {
      chat: "POST /api/chatbot"
    }
  });
}