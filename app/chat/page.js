'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInput from '@/components/chat/ChatInput';
import MessageBubble from '@/components/chat/MessageBubble';
import ThinkingIndicator from '@/components/chat/ThinkingIndicator';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (content) => {
    if (!content.trim() || loading) return;

    // Optimistic UI updates
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
    };
    setMessages([userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) throw new Error('Failed to start chat');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.conversationId) {
                // Redirect to the new conversation URL immediately
                router.replace(`/chat/${parsed.conversationId}`);
                return;
              }
            } catch (e) {
              // Ignore parse errors from partial chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setLoading(false);
      setMessages([]); // Reset on error
      // Show error toast here ideally
    }
  };

  const suggestions = [
    { text: "Help me write a sequel", icon: "✍️" },
    { text: "Plan a trip to Paris", icon: "✈️" },
    { text: "Explain quantum physics", icon: "🧠" },
    { text: "Debug my React code", icon: "💻" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
        <div className="flex flex-col min-h-full max-w-[800px] mx-auto w-full px-4 pt-10 pb-[120px]">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          ) : (
            <div className="flex-1 flex flex-col items-start justify-center animate-fadeIn pb-20">
              <h1 className="text-[56px] leading-[1.1] font-medium tracking-tighter mb-4 select-none">
                <span className="bg-gradient-to-r from-[#4285F4] via-[#9B72CB] to-[#D96570] text-transparent bg-clip-text drop-shadow-sm">
                  Hello, User
                </span>
                <span className="block text-[#444746] mt-2">How can I help you today?</span>
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full mt-12">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(suggestion.text)}
                    className="flex flex-col justify-between h-[200px] p-5 rounded-3xl bg-[#1E1F20] hover:bg-[#282A2C] transition-all text-left group relative overflow-hidden"
                  >
                    <span className="text-body-large text-[#E3E3E3] font-medium z-10">{suggestion.text}</span>
                    <div className="flex items-end justify-end mt-auto w-full">
                      <span className="p-2.5 bg-[#131314] rounded-full group-hover:scale-110 transition-transform text-xl shadow-elevation-1">
                        {suggestion.icon}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {loading && <ThinkingIndicator />}
        </div>
      </div>

      {/* Floating Input Area - Fixed Bottom Center */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent pt-10">
        <div className="max-w-[800px] mx-auto w-full">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </div>
  );
}
