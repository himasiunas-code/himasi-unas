import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ConversationContext,
  GoogleGenerativeModel,
} from '@/lib/type/Chatbot';
import {
  FAQ_DATA,
  HIMASI_ORGANIZATION_CONTEXT,
} from '@/constants/Chatbot/chatbotKnowledge';

export class HimasiAIBot {
  private gemini: GoogleGenerativeModel | null = null;
  private himasiContext: string = '';

  constructor() {
    this.setupAIContext();
    this.initializeAI();
  }

  private setupAIContext() {
    // Bangun basis pengetahuan dari FAQ_DATA dan HIMASI_ORGANIZATION_CONTEXT
    const faqKnowledge = FAQ_DATA
      .map((faq) => `Q: ${faq.question}\nA: ${faq.answers[0]}`)
      .join('\n\n');

    this.himasiContext = `You are an AI assistant for HIMASI UNAS (Himpunan Mahasiswa Sistem Informasi Universitas Nasional Jakarta), by the name of SIBot (Sistem Informasi Bot).

HIMASI UNAS Knowledge Base:
${faqKnowledge}
${HIMASI_ORGANIZATION_CONTEXT}`;
  }

  private async initializeAI() {
    const geminiApiKey = process.env.GOOGLE_AI_API_KEY;
    if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        this.gemini = genAI.getGenerativeModel({ model: modelName });
      } catch (error) {
        console.error('❌ Failed to initialize Google Gemini:', error);
      }
    }
  }

  // Format respons AI untuk tampilan rapi
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

  // Google Gemini Response
  private async getGeminiResponse(
    question: string,
    conversationHistory?: ConversationContext
  ): Promise<string> {
    if (!this.gemini) {
      // Coba inisialisasi ulang jika env baru saja dimuat
      await this.initializeAI();
      if (!this.gemini) {
        return 'Maaf, layanan Gemini AI belum terkonfigurasi dengan benar. Silakan hubungi admin HIMASI UNAS. 😊';
      }
    }

    try {
      let historyContext = '';
      if (conversationHistory?.messages && conversationHistory.messages.length > 0) {
        historyContext = `\nRecent Conversation History:\n${conversationHistory.messages
          .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n')}\n`;
      }

      const prompt = `${this.himasiContext}
${historyContext}
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
        return 'Maaf, saya belum bisa memproses pertanyaan tersebut saat ini. Bisa tolong ulangi pertanyaanmu? 😊';
      }
    } catch (error: unknown) {
      console.error('Gemini error:', error);
      const err = error as Error & { message?: string };
      if (err.message?.includes('API_KEY_INVALID')) {
        return 'Konfigurasi Gemini API Key tidak valid. Silakan periksa kunci API pada server.';
      } else if (err.message?.includes('QUOTA_EXCEEDED')) {
        return 'Batas kuota Gemini AI saat ini sedang terlampaui. Silakan coba kembali dalam beberapa saat! ⏳';
      }

      return 'Maaf, sistem Gemini AI sedang mengalami kendala. Silakan coba lagi dalam beberapa saat! 🤖';
    }
  }

  // Metode utama untuk mendapatkan jawaban bot (Murni AI Generative Gemini)
  public async getResponse(
    question: string,
    conversationHistory?: ConversationContext
  ): Promise<string> {
    if (!question || !question.trim()) {
      return 'Halo! Saya asisten HIMASI UNAS (SIBot). Ada yang bisa saya bantu tentang organisasi kami? 😊';
    }

    return await this.getGeminiResponse(question, conversationHistory);
  }
}

// Export singleton instance
export const himasiBot = new HimasiAIBot();
