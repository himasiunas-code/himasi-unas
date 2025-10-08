"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ChatMessage from './ChatMessage';

type Message = { 
    sender: 'user' | 'bot'; 
    content: string;
    confidence?: string;
    suggestions?: string[];
    type?: string;
};

const ChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);

    // Auto-scroll ke pesan terbaru
    useEffect(() => {
        if (chatWindowRef.current) {
            setTimeout(() => {
                if (chatWindowRef.current) {
                    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
                }
            }, 100);
        }
    }, [messages]);



    const handleSend = useCallback(async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { sender: 'user' as const, content: input.trim() };
        setMessages((prev) => [...prev, userMessage]);
        
        const currentInput = input.trim();
        setInput('');
        setIsLoading(true);

        // Add loading message
        const loadingMessage = { sender: 'bot' as const, content: '🤔 Sedang berpikir...' };
        setMessages((prev) => [...prev, loadingMessage]);

        try {
            // Use new TypeScript chatbot API endpoint
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: currentInput }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Remove loading message and add actual response
            setMessages((prev) => {
                const messagesWithoutLoading = prev.slice(0, -1);
                const botMessage = { 
                    sender: 'bot' as const, 
                    content: data.success ? data.data.answer : (data.error || 'Maaf, terjadi kesalahan dalam memproses pertanyaan Anda.'),
                    confidence: 'medium',
                    suggestions: []
                };
                return [...messagesWithoutLoading, botMessage];
            });

        } catch {
            // Remove loading message and show error
            setMessages((prev) => {
                const messagesWithoutLoading = prev.slice(0, -1);
                const errorMessage = { 
                    sender: 'bot' as const, 
                    content: '❌ Maaf, chatbot sedang tidak tersedia. Silakan coba lagi atau hubungi admin.'
                };
                return [...messagesWithoutLoading, errorMessage];
            });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading]);

    const handleFeedback = useCallback(async (messageIndex: number, isHelpful: boolean) => {
        try {
            // For now, just show confirmation message
            // In the future, this could be connected to a feedback API
            console.log('Feedback received:', { messageIndex, isHelpful });
            
            // Show confirmation message
            setMessages((prev) => [
                ...prev,
                { 
                    sender: 'bot' as const, 
                    content: '✅ Terima kasih atas feedback Anda! Saya akan terus belajar untuk memberikan jawaban yang lebih baik.' 
                }
            ]);
            
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    }, []);

    return (
        <div className="chatbot">
            <div className="chat-window" ref={chatWindowRef}>
                {messages.length === 0 && (
                    <div className="welcome-message">
                        <div className="welcome-icon">🤖</div>
                        <h4>Halo! Saya Asisten HIMASI UNAS</h4>
                        <p>Tanya saya tentang HIMASI UNAS, kegiatan organisasi, atau hal-hal seputar Sistem Informasi. Saya siap membantu!</p>
                        <div className="suggested-questions">
                            <button onClick={() => setInput("Apa itu HIMASI UNAS?")}>
                                Apa itu HIMASI UNAS?
                            </button>
                            <button onClick={() => setInput("Bagaimana cara bergabung dengan HIMASI?")}>
                                Cara bergabung HIMASI?
                            </button>
                            <button onClick={() => setInput("Apa saja kegiatan HIMASI?")}>
                                Kegiatan apa saja yang ada?
                            </button>
                        </div>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={`${msg.sender}-${index}`}>
                        <ChatMessage sender={msg.sender} message={msg.content} />
                        {msg.sender === 'bot' && msg.confidence === 'low' && !msg.type && (
                            <div className="feedback-buttons">
                                <button 
                                    onClick={() => handleFeedback(index, true)}
                                    className="feedback-btn helpful"
                                >
                                    👍 Membantu
                                </button>
                                <button 
                                    onClick={() => handleFeedback(index, false)}
                                    className="feedback-btn not-helpful"
                                >
                                    👎 Tidak membantu
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                

            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="Type your message..."
                    className="chat-input"
                    disabled={isLoading}
                />
                <button onClick={handleSend} className="send-button" disabled={!input.trim() || isLoading}>
                    {isLoading ? (
                        <div className="loading-spinner"></div>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                        </svg>
                    )}
                </button>
            </div>

            <style jsx>{`
                .chatbot {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .chat-window {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    background: #4B061A;
                    scroll-behavior: smooth;
                }

                .welcome-message {
                    text-align: center;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    margin-bottom: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    border: 1px solid rgba(148, 0, 2, 0.2);
                }

                .welcome-icon {
                    font-size: 32px;
                    margin-bottom: 12px;
                }

                .welcome-message h4 {
                    margin: 0 0 8px 0;
                    color: #940002;
                    font-size: 18px;
                    font-weight: 600;
                }

                .welcome-message p {
                    margin: 0 0 16px 0;
                    color: #4B061A;
                    font-size: 14px;
                }

                .suggested-questions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .suggested-questions button {
                    padding: 8px 12px;
                    background: rgba(148, 0, 2, 0.1);
                    border: 1px solid #940002;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    color: #940002;
                    transition: all 0.2s ease;
                }

                .suggested-questions button:hover {
                    background: #940002;
                    color: white;
                    border-color: #ccc;
                }

                .chat-input-container {
                    display: flex;
                    padding: 16px;
                    background: #FFE8DB;
                    border-top: 2px solid #940002;
                    gap: 8px;
                    align-items: center;
                }

                .chat-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #940002;
                    border-radius: 24px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.2s ease;
                    background: white;
                    color: #4B061A;
                }

                .chat-input::placeholder {
                    color: #999;
                }

                .chat-input:focus {
                    border-color: #4B061A;
                    box-shadow: 0 0 0 2px rgba(148, 0, 2, 0.2);
                    color: #4B061A;
                    outline: none;
                }

                .chat-input:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    background: #f5f5f5;
                }

                .send-button {
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #940002 0%, #4B061A 100%);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 8px rgba(148, 0, 2, 0.3);
                }

                .send-button:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(148, 0, 2, 0.4);
                }

                .send-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Scrollbar styling */
                .chat-window::-webkit-scrollbar {
                    width: 4px;
                }

                .chat-window::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chat-window::-webkit-scrollbar-thumb {
                    background: #ccc;
                    border-radius: 2px;
                }

                .chat-window::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }

                /* Feedback buttons styling */
                .feedback-buttons {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                    margin-left: 50px;
                    margin-bottom: 8px;
                }

                .feedback-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 16px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .feedback-btn.helpful {
                    background: rgba(34, 197, 94, 0.1);
                    color: #16a34a;
                    border: 1px solid #16a34a;
                }

                .feedback-btn.helpful:hover {
                    background: #16a34a;
                    color: white;
                }

                .feedback-btn.not-helpful {
                    background: rgba(239, 68, 68, 0.1);
                    color: #dc2626;
                    border: 1px solid #dc2626;
                }

                .feedback-btn.not-helpful:hover {
                    background: #dc2626;
                    color: white;
                }

                /* Loading spinner */
                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default ChatBot;