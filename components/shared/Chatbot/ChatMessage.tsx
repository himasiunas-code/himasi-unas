import React from 'react';

interface ChatMessageProps {
  sender: 'user' | 'bot';
  message: string;
}

// Function to format message with better display
const formatMessage = (text: string): React.ReactElement => {
  // Split by line breaks to handle paragraphs
  const paragraphs = text.split('\n\n');
  
  return (
    <>
      {paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split('\n');
        
        return (
          <div key={pIndex} className="message-paragraph">
            {lines.map((line, lIndex) => {
              // Handle bullet points
              if (line.trim().startsWith('•') || line.trim().match(/^[\*\-]\s/)) {
                return (
                  <div key={lIndex} className="bullet-point">
                    <span className="bullet">•</span>
                    <span>{formatInlineText(line.replace(/^[\*\-\•]\s*/, ''))}</span>
                  </div>
                );
              }
              
              // Handle numbered lists
              if (line.trim().match(/^\d+\.\s/)) {
                const match = line.match(/^(\d+)\.\s(.*)$/);
                if (match) {
                  return (
                    <div key={lIndex} className="numbered-point">
                      <span className="number">{match[1]}.</span>
                      <span>{formatInlineText(match[2])}</span>
                    </div>
                  );
                }
              }
              
              // Handle regular lines
              if (line.trim()) {
                return (
                  <div key={lIndex} className="text-line">
                    {formatInlineText(line)}
                  </div>
                );
              }
              
              return null;
            })}
          </div>
        );
      })}
    </>
  );
};

// Function to handle inline formatting (bold, italic, etc.)
const formatInlineText = (text: string): React.ReactElement => {
  // Handle bold text **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        
        // Handle italic text *text* (but not if it's part of **)
        const italicParts = part.split(/(\*[^*]+\*)/g);
        return (
          <React.Fragment key={index}>
            {italicParts.map((italicPart, italicIndex) => {
              if (italicPart.startsWith('*') && italicPart.endsWith('*') && 
                  !italicPart.startsWith('**') && !italicPart.endsWith('**')) {
                return <em key={italicIndex}>{italicPart.slice(1, -1)}</em>;
              }
              return italicPart;
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, message }) => {
  return (
    <div className={`chat-message ${sender}`}>
      <div className="message-content">
        <div className="message-avatar">
          {sender === 'user' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7C1.9 7 1 7.9 1 9V16C1 17.1 1.9 18 3 18V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V18C22.1 18 23 17.1 23 16V9C23 7.9 22.1 7 21 7V9ZM19 16H5V9H19V16ZM7.5 13.5C7.5 14.3 6.8 15 6 15S4.5 14.3 4.5 13.5S5.2 12 6 12S7.5 12.7 7.5 13.5ZM19.5 13.5C19.5 14.3 18.8 15 18 15S16.5 14.3 16.5 13.5S17.2 12 18 12S19.5 12.7 19.5 13.5Z"/>
            </svg>
          )}
        </div>
        <div className="message-bubble">
          <div className="message-text">
            {formatMessage(message)}
          </div>
        </div>
      </div>

      <style jsx>{`
        .chat-message {
          margin-bottom: 16px;
          display: flex;
          animation: fadeIn 0.3s ease-in;
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .chat-message.bot {
          justify-content: flex-start;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message-content {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 80%;
        }

        .user .message-content {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .user .message-avatar {
          background: linear-gradient(135deg, #940002 0%, #4B061A 100%);
          color: white;
          box-shadow: 0 2px 4px rgba(148, 0, 2, 0.3);
        }

        .bot .message-avatar {
          background: rgba(255, 255, 255, 0.9);
          color: #940002;
          border: 2px solid #940002;
        }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 18px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          position: relative;
        }

        .user .message-bubble {
          background: linear-gradient(135deg, #940002 0%, #4B061A 100%);
          color: white;
          border-bottom-right-radius: 4px;
          box-shadow: 0 2px 8px rgba(148, 0, 2, 0.3);
        }

        .bot .message-bubble {
          background: rgba(255, 255, 255, 0.95);
          color: #4B061A;
          border-bottom-left-radius: 4px;
          border: 2px solid #940002;
          box-shadow: 0 2px 8px rgba(148, 0, 2, 0.1);
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        /* Message formatting styles */
        .message-paragraph {
          margin-bottom: 8px;
        }

        .message-paragraph:last-child {
          margin-bottom: 0;
        }

        .text-line {
          margin-bottom: 4px;
        }

        .text-line:last-child {
          margin-bottom: 0;
        }

        .bullet-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 4px;
          padding-left: 4px;
        }

        .bullet-point .bullet {
          color: #940002;
          font-weight: bold;
          margin-right: 8px;
          flex-shrink: 0;
          line-height: 1.4;
        }

        .numbered-point {
          display: flex;
          align-items: flex-start;
          margin-bottom: 4px;
          padding-left: 4px;
        }

        .numbered-point .number {
          color: #940002;
          font-weight: bold;
          margin-right: 8px;
          flex-shrink: 0;
          line-height: 1.4;
        }

        /* Text formatting */
        .message-text strong {
          font-weight: 600;
          color: #940002;
        }

        .bot .message-text strong {
          color: #4B061A;
        }

        .user .message-text strong {
          color: #FFE8DB;
          font-weight: 700;
        }

        .message-text em {
          font-style: italic;
          opacity: 0.9;
        }

        /* Speech bubble triangles */
        .user .message-bubble::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: -6px;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-top-color: #940002;
          border-right: 0;
          border-bottom: 0;
          margin-bottom: -6px;
        }

        .bot .message-bubble::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -7px;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-top-color: rgba(255, 255, 255, 0.95);
          border-left: 0;
          border-bottom: 0;
          margin-bottom: -6px;
        }
      `}</style>
    </div>
  );
};

export default ChatMessage;