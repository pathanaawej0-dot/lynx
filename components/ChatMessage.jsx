'use client';

import { useState } from 'react';

export default function ChatMessage({ message, isStreaming = false }) {
  const [expanded, setExpanded] = useState(false);
  const isUser = message.role === 'user';
  
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatContent = (content) => {
    if (!content) return '';
    
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const firstLineEnd = codeContent.indexOf('\n');
        const language = firstLineEnd > 0 ? codeContent.slice(0, firstLineEnd).trim() : '';
        const code = firstLineEnd > 0 ? codeContent.slice(firstLineEnd + 1) : codeContent;
        
        return (
          <pre key={index} className="my-2 p-3 bg-background rounded-md overflow-x-auto">
            {language && <div className="text-xs text-text-secondary mb-2">{language}</div>}
            <code className="text-sm text-secondary">{code}</code>
          </pre>
        );
      }
      
      return part.split('\n').map((line, lineIndex) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={`${index}-${lineIndex}`} className="font-semibold my-1">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith('- ')) {
          return <li key={`${index}-${lineIndex}`} className="ml-4 my-0.5">{line.slice(2)}</li>;
        }
        if (line.trim() === '') {
          return <br key={`${index}-${lineIndex}`} />;
        }
        return <p key={`${index}-${lineIndex}`} className="my-0.5">{line}</p>;
      });
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      )}
      
      <div className={`
        max-w-[80%] md:max-w-[70%] p-4 rounded-md
        ${isUser 
          ? 'bg-surface-light border-l-2 border-primary' 
          : 'bg-surface'
        }
      `}>
        <div className="text-text-primary text-sm leading-relaxed">
          {formatContent(message.content)}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>
        {message.created_at && (
          <p className="text-xs text-text-secondary mt-2">{formatTime(message.created_at)}</p>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
