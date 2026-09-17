import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  FAQ,
  ConversationContext,
  AIProvider,
  GoogleGenerativeModel,
} from '@/lib/type/Chatbot';
import {
  FAQ_DATA,
  HIMASI_ORGANIZATION_CONTEXT,
} from '@/constants/Chatbot/chatbotKnowledge';

export class HimasiAIBot {
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
    // Buat knowledge base gabungan dari data FAQ
    const faqKnowledge = this.faqs
      .map((faq) => {
        const randomAnswer = this.getRandomAnswer(faq.answers);
        return `Q: ${faq.question}\nA: ${randomAnswer}`;
      })
      .join('\n\n');

    this.himasiContext = `You are an AI assistant for HIMASI UNAS (Himpunan Mahasiswa Sistem Informasi Universitas Nasional Jakarta), by the name of SIBot (Sistem Informasi Bot).

HIMASI UNAS Knowledge Base:
${faqKnowledge}
${HIMASI_ORGANIZATION_CONTEXT}`;
  }

  private async initializeAI() {
    const preferredProvider = process.env.AI_PROVIDER || 'auto';
    const providersInitialized: string[] = [];

    // Inisialisasi Google Gemini
    const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
    if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        this.gemini = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        providersInitialized.push('gemini');

        if (preferredProvider === 'gemini' || preferredProvider === 'auto') {
          this.aiProvider = 'gemini';
        }
      } catch (error) {
        console.error('❌ Failed to initialize Google Gemini:', error);
      }
    }

    // Inisialisasi OpenAI
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        providersInitialized.push('openai');

        if (preferredProvider === 'openai') {
          this.aiProvider = 'openai';
        }
      } catch (error) {
        console.warn('⚠️ Failed to initialize OpenAI:', error);
      }
    }

    // Prioritas provider: Gemini > OpenAI > FAQ
    if (this.aiProvider === 'faq' && providersInitialized.length > 0) {
      this.aiProvider = providersInitialized.includes('gemini') ? 'gemini' : 'openai';
    }
  }

  private loadFAQs() {
    this.faqs = FAQ_DATA;
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

  // Format AI response untuk tampilan yang optimal
  private formatResponse(response: string): string {
    let formatted = response;

    formatted = formatted.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    formatted = formatted.replace(/^[\s]*[\*\-\•]\s*/gm, '• ');
    formatted = formatted.replace(/(\w)[\s]*•/g, '$1\n• ');
    formatted = formatted.replace(/^[\s]*(\d+)\.[\s]*/gm, '$1. ');
    formatted = formatted.replace(/(\w)[\s]*(\d+)\./g, '$1\n$2.');
    formatted = formatted.replace(/•[\s]*([^\n])/g, '• $1');
    formatted = formatted.replace(/(\d+)\.[\s]*([^\n])/g, '$1. $2');
    formatted = formatted.replace(/[ \t]+/g, ' ').trim();
    formatted = formatted.replace(/([^.\n])[\s]*\n[\s]*•/g, '$1\n\n•');
    formatted = formatted.replace(/([^.\n])[\s]*\n[\s]*(\d+\.)/g, '$1\n\n$2');
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

  // Generative AI Response
  private async getAIResponse(
    question: string,
    conversationHistory?: ConversationContext
  ): Promise<string> {
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

      const result = await this.gemini.generateContent(prompt);
      const geminiResponse = result.response.text().trim();

      if (geminiResponse && geminiResponse.length > 5) {
        return this.formatResponse(geminiResponse);
      } else {
        throw new Error('Empty response from Gemini');
      }
    } catch (error: unknown) {
      const err = error as Error & { message?: string };
      if (err.message?.includes('API_KEY_INVALID')) {
        throw new Error('Gemini API Key tidak valid. Periksa konfigurasi GOOGLE_AI_API_KEY.');
      } else if (err.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('Quota Gemini terlampaui. Coba lagi nanti.');
      }

      const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';
      if (chatbotMode === 'hybrid') throw error;

      return 'Maaf, sistem Gemini AI sedang mengalami kendala. Silakan coba lagi dalam beberapa saat! 🤖';
    }
  }

  // OpenAI Response
  private async getOpenAIResponse(
    question: string,
    conversationHistory?: ConversationContext
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI belum siap. Silakan coba lagi nanti. 😊');
    }

    try {
      const messages = [
        { role: 'system' as const, content: this.himasiContext },
        ...(conversationHistory?.messages || []),
        { role: 'user' as const, content: question },
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 500,
        temperature: 0.8,
      });

      const aiResponse = completion.choices[0]?.message?.content?.trim();

      if (aiResponse && aiResponse.length > 10) {
        return this.formatResponse(aiResponse);
      } else {
        return 'Maaf, saya tidak bisa memberikan jawaban yang tepat untuk pertanyaan ini. Bisa coba tanya dengan cara yang berbeda? Atau hubungi langsung HIMASI UNAS ya! 😊';
      }
    } catch (error: unknown) {
      const err = error as Error & { status?: number };
      const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';

      if (err.status === 401) {
        if (chatbotMode === 'hybrid') throw error;
        return 'API Key tidak valid. Silakan periksa konfigurasi OpenAI API key. 🔑';
      } else if (err.status === 429) {
        if (chatbotMode === 'hybrid') throw error;
        return 'Quota OpenAI terlampaui. Silakan coba lagi nanti atau periksa billing account OpenAI. 💳';
      } else if (err.status === 500) {
        if (chatbotMode === 'hybrid') throw error;
        return 'Server OpenAI sedang bermasalah. Silakan coba beberapa saat lagi. 🔧';
      }

      if (chatbotMode === 'hybrid') throw error;
      return 'Maaf, sistem AI sedang mengalami kendala. Silakan coba lagi dalam beberapa saat, atau hubungi HIMASI UNAS untuk bantuan langsung! 💬';
    }
  }

  // Respon berbasis pencocokan FAQ lokal
  public getFAQResponse(question: string): string {
    if (!question || !question.trim()) {
      return 'Silakan ajukan pertanyaan kepada saya!';
    }

    const questionClean = question.toLowerCase().trim().replace(/[^\w\s]/g, '');
    let bestMatch: FAQ | null = null;
    let bestScore = 0;

    for (const faq of this.faqs) {
      const faqQuestion = faq.question.toLowerCase();
      const questionWords = questionClean.split(/\s+/);
      const faqWords = faqQuestion.replace(/[^\w\s]/g, '').split(/\s+/);
      const keyWords = faq.keywords.map((k) => k.toLowerCase());

      let keywordMatches = 0;
      let importantKeywordMatches = 0;

      for (const word of questionWords) {
        const matchesKeyword = keyWords.some((k) => k.includes(word) || word.includes(k));
        const matchesFaqWord = faqWords.includes(word);

        if (matchesKeyword || matchesFaqWord) {
          keywordMatches++;
          if (word === 'himasi' || word === 'unas' || word === 'apa' || word === 'apaan') {
            importantKeywordMatches++;
          }
        }
      }

      const keywordRatio = keywordMatches / questionWords.length;
      const importantBonus = importantKeywordMatches * 0.3;

      let patternBonus = 0;
      if (
        (questionClean.includes('apa') || questionClean.includes('apaan')) &&
        (questionClean.includes('himasi') || questionClean.includes('unas'))
      ) {
        if (faq.id === '1') {
          patternBonus = 0.5;
        }
      }

      let questionTypeBonus = 0;
      if (questionClean.includes('daftar') || questionClean.includes('pendaftaran')) {
        if (faq.id === '2') questionTypeBonus = 0.4;
      } else if (questionClean.includes('kapan') || questionClean.includes('jadwal')) {
        if (faq.id === '3') questionTypeBonus = 0.4;
      } else if (questionClean.includes('siapa') || questionClean.includes('bergabung')) {
        if (faq.id === '4') questionTypeBonus = 0.4;
      } else if (questionClean.includes('hubungi') || questionClean.includes('kontak')) {
        if (faq.id === '5') questionTypeBonus = 0.4;
      } else if (questionClean.includes('kegiatan') || questionClean.includes('acara')) {
        if (faq.id === '6') questionTypeBonus = 0.4;
      }

      const similarityScore = this.similarity(questionClean, faqQuestion);

      const score =
        keywordRatio * 0.4 +
        importantBonus * 0.3 +
        patternBonus * 0.2 +
        questionTypeBonus * 0.2 +
        similarityScore * 0.1;

      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch) {
      return this.getRandomAnswer(bestMatch.answers);
    }

    return 'Maaf, saya tidak menemukan jawaban untuk pertanyaan tersebut. Silakan coba dengan kata kunci yang berbeda atau hubungi tim support kami melalui halaman Hubungi Kami.';
  }

  // Metode utama untuk mendapatkan jawaban bot (Hybrid, AI, atau FAQ)
  public async getResponse(
    question: string,
    conversationHistory?: ConversationContext
  ): Promise<string> {
    if (!question || !question.trim()) {
      return 'Halo! Saya asisten HIMASI UNAS. Ada yang bisa saya bantu tentang organisasi kami? 😊';
    }

    const chatbotMode = process.env.CHATBOT_MODE || 'hybrid';

    switch (chatbotMode) {
      case 'ai':
        return await this.getAIResponse(question, conversationHistory);
      case 'faq':
        return this.getFAQResponse(question);
      case 'hybrid':
      default:
        try {
          return await this.getAIResponse(question, conversationHistory);
        } catch {
          return this.getFAQResponse(question);
        }
    }
  }
}

// Export singleton instance
export const himasiBot = new HimasiAIBot();
