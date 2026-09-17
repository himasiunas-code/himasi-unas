export interface FAQ {
  id: string;
  question: string;
  answers: string[];
  keywords: string[];
}

export interface FAQData {
  faqs: FAQ[];
}

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationContext {
  messages: ConversationMessage[];
}

export type AIProvider = 'gemini';

export interface GoogleGenerativeModel {
  generateContent: (prompt: string) => Promise<{
    response: {
      text: () => string;
    };
  }>;
  model?: string;
}
