import { NextRequest, NextResponse } from 'next/server';
import { himasiBot } from '@/lib/chatbot-service';

// Handler POST untuk menerima pertanyaan pengguna ke Chatbot HIMASI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, conversationHistory } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const response = await himasiBot.getResponse(question, conversationHistory);

    return NextResponse.json({
      success: true,
      data: {
        question,
        answer: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}

// Handler GET untuk healthcheck API Chatbot
export async function GET() {
  return NextResponse.json({
    message: 'HIMASI UNAS Chatbot API',
    status: 'active',
    endpoints: {
      chat: 'POST /api/chatbot',
    },
  });
}