"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import ChatBot from './ChatBot';

const FloatingChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
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
        if (isOpen) {
            // Trigger closing animation
            setIsClosing(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsClosing(false);
            }, 300); // Match animation duration
        } else {
            setIsOpen(true);
        }
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
                    // Mascot Video
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="mascot-video"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    >
                        <source src="/Mascot.mp4" type="video/mp4" />
                    </video>
                )}
            </div>

            {/* Chat Window */}
            {(isOpen || isClosing) && (
                <div className={`floating-chat-window ${isClosing ? 'closing' : ''}`}>
                    <div className="chat-window-header">
                        <div className="header-content">
                            <div className="robot-avatar">
                                <Image 
                                    src="/Mascot.png" 
                                    alt="SIBot Mascot" 
                                    width={32} 
                                    height={32}
                                    style={{ objectFit: 'contain' }}
                                />
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
                    background: white;
                    color: #4b061a;
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
                    color: black;
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
                    border-top: 8px solid #ffffff;
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

                .floating-chat-window.closing {
                    animation: slideDown 0.3s ease-out;
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

                @keyframes slideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px);
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
                    background: white;
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