/**
 * Example: Update ChatBot.tsx untuk support learning feedback
 * This is a TypeScript code example that should be applied to ChatBot.tsx
 * 
 * Main changes for learning support:
 * 1. Change endpoint to '/chatbot-smart.php'
 * 2. Handle confidence levels from smart backend
 * 3. Show suggestions when confidence is low
 * 4. Add feedback mechanism for continuous learning
 */

// In ChatBot.tsx, update the handleSend function:
const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Add loading message
    const loadingMessage = { sender: 'bot', content: '🤔 Sedang berpikir...' };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
        // Use smart chatbot endpoint
        const response = await fetch('/chatbot-smart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage.content }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Smart bot response:', data);
        
        // Remove loading message and add response
        setMessages((prev) => {
            const messagesWithoutLoading = prev.slice(0, -1);
            const botMessage = { 
                sender: 'bot', 
                content: data.answer || 'Maaf, terjadi kesalahan.',
                confidence: data.confidence,
                suggestions: data.suggestions
            };
            return [...messagesWithoutLoading, botMessage];
        });

        // Add suggestions if confidence is low
        if (data.confidence === 'low' && data.suggestions) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { 
                        sender: 'bot', 
                        content: '� Mungkin Anda ingin bertanya tentang:\n' + 
                                data.suggestions.map(s => `• ${s}`).join('\n'),
                        type: 'suggestions'
                    }
                ]);
            }, 1000);
        }

    } catch (error) {
        console.error('Error sending message:', error);
        
        // Error handling remains the same
        setMessages((prev) => {
            const messagesWithoutLoading = prev.slice(0, -1);
            const errorMessage = { 
                sender: 'bot', 
                content: '❌ Maaf, chatbot sedang tidak tersedia. Silakan coba lagi atau hubungi admin.'
            };
            return [...messagesWithoutLoading, errorMessage];
        });
    }
};

/**
 * Example: Add feedback handling function to ChatBot.tsx
 */

// Add this feedback handling function to your ChatBot component:
const handleFeedback = async (messageIndex, isHelpful) => {
    try {
        await fetch('/chatbot-smart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                type: 'feedback',
                messageIndex,
                isHelpful,
                originalMessage: messages[messageIndex - 1]?.content,
                botResponse: messages[messageIndex]?.content
            }),
        });

        console.log('Feedback sent successfully');
        
        // Optional: Show confirmation message
        setMessages((prev) => [
            ...prev,
            { 
                sender: 'bot', 
                content: '✅ Terima kasih atas feedback Anda! Saya akan terus belajar untuk memberikan jawaban yang lebih baik.' 
            }
        ]);
        
    } catch (error) {
        console.error('Error sending feedback:', error);
    }
};

// Example feedback buttons component (add to your components):
const FeedbackButtons = ({ messageIndex, onFeedback }) => (
    <div className="flex gap-2 mt-2">
        <button 
            onClick={() => onFeedback(messageIndex, true)}
            className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-800 rounded-md transition-colors"
        >
            👍 Membantu
        </button>
        <button 
            onClick={() => onFeedback(messageIndex, false)}
            className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
        >
            👎 Tidak membantu
        </button>
    </div>
);

// Use in message rendering:
// {message.confidence === 'low' && (
//     <FeedbackButtons 
//         messageIndex={index} 
//         onFeedback={handleFeedback} 
//     />
// )}