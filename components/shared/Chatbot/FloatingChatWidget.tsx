"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ChatBot from './ChatBot';

const FloatingChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const animatedTexts = useMemo(() => [
        "Butuh Bantuan?",
        "Ada Pertanyaan?", 
        "Yuk Tanya SIBot!"
    ], []);

    useEffect(() => {
        if (isOpen) return;

        const currentText = animatedTexts[currentTextIndex];
        
        if (!isDeleting && displayedText !== currentText) {
            // Typing animation
            setIsTyping(true);
            const typingTimeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, displayedText.length + 1));
            }, 100);
            return () => clearTimeout(typingTimeout);
        } else if (!isDeleting && displayedText === currentText) {
            // Pause before deleting
            setIsTyping(false);
            const pauseTimeout = setTimeout(() => {
                setIsDeleting(true);
            }, 2500);
            return () => clearTimeout(pauseTimeout);
        } else if (isDeleting && displayedText !== '') {
            // Deleting animation
            const deletingTimeout = setTimeout(() => {
                setDisplayedText(currentText.slice(0, displayedText.length - 1));
            }, 50);
            return () => clearTimeout(deletingTimeout);
        } else if (isDeleting && displayedText === '') {
            // Move to next text
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
        }
    }, [currentTextIndex, displayedText, isDeleting, isOpen, animatedTexts]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Animated Text */}
            {!isOpen && (
                <div className="floating-text">
                    {displayedText}
                    {isTyping && <span className="cursor">|</span>}
                </div>
            )}

            {/* Floating Chat Button */}
            <div 
                className={`floating-chat-button ${isOpen ? 'open' : ''}`}
                onClick={toggleChat}
            >
                {isOpen ? (
                    // Close Icon (X)
                    <svg 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                    >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                ) : (
                    // Robot Icon
                    <svg 
                        width="28" 
                        height="28" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                    >
                        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C1.9 7 1 7.9 1 9V16C1 17.1 1.9 18 3 18V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V18C22.1 18 23 17.1 23 16V9C23 7.9 22.1 7 21 7V9ZM19 16H5V9H19V16ZM7.5 13.5C7.5 14.3 6.8 15 6 15S4.5 14.3 4.5 13.5S5.2 12 6 12S7.5 12.7 7.5 13.5ZM19.5 13.5C19.5 14.3 18.8 15 18 15S16.5 14.3 16.5 13.5S17.2 12 18 12S19.5 12.7 19.5 13.5ZM16 17.5H8C8 16.1 9.3 15 11 15H13C14.7 15 16 16.1 16 17.5Z"/>
                    </svg>
                )}
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="floating-chat-window">
                    <div className="chat-window-header">
                        <div className="header-content">
                            <div className="robot-avatar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C1.9 7 1 7.9 1 9V16C1 17.1 1.9 18 3 18V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V18C22.1 18 23 17.1 23 16V9C23 7.9 22.1 7 21 7V9ZM19 16H5V9H19V16ZM7.5 13.5C7.5 14.3 6.8 15 6 15S4.5 14.3 4.5 13.5S5.2 12 6 12S7.5 12.7 7.5 13.5ZM19.5 13.5C19.5 14.3 18.8 15 18 15S16.5 14.3 16.5 13.5S17.2 12 18 12S19.5 12.7 19.5 13.5Z"/>
                                </svg>
                            </div>
                            <div className="header-text">
                                <h3>SIBot | Asisten</h3>
                                <p>Siap membantu Anda Selalu</p>
                            </div>
                        </div>
                    </div>
                    <div className="chat-window-body">
                        <ChatBot />
                    </div>
                </div>
            )}

            <style jsx>{`
                .floating-text {
                    position: fixed;
                    bottom: 30px;
                    right: 95px;
                    background: linear-gradient(135deg, #940002 0%, #4B061A 100%);
                    color: white;
                    padding: 12px 18px;
                    border-radius: 20px 20px 5px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    white-space: nowrap;
                    z-index: 999;
                    box-shadow: 0 4px 15px rgba(148, 0, 2, 0.3);
                    animation: fadeInUp 0.5s ease-out, gentleFloat 3s ease-in-out infinite;
                    transform-origin: bottom right;
                    min-height: 20px;
                    min-width: 120px;
                    display: flex;
                    align-items: center;
                    transition: all 0.3s ease;
                }

                .cursor {
                    animation: blink 1s infinite;
                    margin-left: 2px;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 0.8);
                }

                .floating-text::after {
                    content: '';
                    position: absolute;
                    bottom: -5px;
                    right: 20px;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid #4B061A;
                    transform: rotate(-20deg);
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(15px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }

                @keyframes gentleFloat {
                    0%, 100% { 
                        transform: translateY(0); 
                    }
                    50% { 
                        transform: translateY(-2px); 
                    }
                }

                .floating-chat-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #940002 0%, #4B061A 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(148, 0, 2, 0.3);
                    color: white;
                    transition: all 0.3s ease;
                    z-index: 1000;
                    animation: pulse 2s infinite;
                }

                .floating-chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(148, 0, 2, 0.4);
                }

                .floating-chat-button.open {
                    background: #940002;
                    animation: none;
                }

                @keyframes pulse {
                    0% { box-shadow: 0 4px 20px rgba(148, 0, 2, 0.3), 0 0 0 0 rgba(148, 0, 2, 0.7); }
                    70% { box-shadow: 0 4px 20px rgba(148, 0, 2, 0.3), 0 0 0 10px rgba(148, 0, 2, 0); }
                    100% { box-shadow: 0 4px 20px rgba(148, 0, 2, 0.3), 0 0 0 0 rgba(148, 0, 2, 0); }
                }

                .floating-chat-window {
                    position: fixed;
                    bottom: 90px;
                    right: 20px;
                    width: 350px;
                    height: 500px;
                    background: #FFE8DB;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(148, 0, 2, 0.2);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    z-index: 999;
                    animation: slideUp 0.3s ease-out;
                    border: 2px solid #940002;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .chat-window-header {
                    background: #940002;
                    color: white;
                    padding: 16px;
                    min-height: 70px;
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .robot-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .header-text h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .header-text p {
                    margin: 0;
                    font-size: 12px;
                    opacity: 0.8;
                }

                .chat-window-body {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                /* Responsive untuk mobile */
                @media (max-width: 480px) {
                    .floating-text {
                        right: 85px;
                        font-size: 12px;
                        padding: 8px 12px;
                        max-width: calc(100vw - 120px);
                        white-space: normal;
                        text-align: center;
                    }

                    .floating-chat-window {
                        width: calc(100vw - 40px);
                        height: calc(90vh - 140px);
                        bottom: 90px;
                        right: 20px;
                        left: 20px;
                    }
                }

                /* Tablet responsive */
                @media (max-width: 768px) and (min-width: 481px) {
                    .floating-text {
                        right: 90px;
                        font-size: 13px;
                    }
                }
            `}</style>
        </>
    );
};

export default FloatingChatWidget;