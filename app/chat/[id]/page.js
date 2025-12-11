'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import ChatInput from '@/components/chat/ChatInput';
import MessageBubble from '@/components/chat/MessageBubble';
import ThinkingIndicator from '@/components/chat/ThinkingIndicator';
import { Button } from '@/components/ui/Button';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const messagesEndRef = useRef(null);
  const titleInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchConversation = useCallback(async () => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push('/chat');
          return;
        }
        throw new Error('Failed to fetch conversation');
      }
      const data = await res.json();
      setMessages(data.messages || []);
      setTitle(data.conversation?.title || 'New Conversation');
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [conversationId, router]);

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  // Focus title input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  const handleSend = async (content) => {
    if (!content.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let isFirstChunk = true;

      // Temporary assistant message placeholder
      const tempId = Date.now() + 1;
      setMessages(prev => [...prev, {
        id: tempId,
        role: 'assistant',
        content: ''
      }]);

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

              if (parsed.title) setTitle(parsed.title);

              if (parsed.content) {
                fullContent += parsed.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastIndex = newMessages.length - 1;
                  newMessages[lastIndex] = {
                    ...newMessages[lastIndex],
                    content: fullContent,
                  };
                  return newMessages;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Ideally show toast error
    } finally {
      setLoading(false);
    }
  };

  const handleTitleSave = async () => {
    setIsEditingTitle(false);
    if (!title.trim()) return;

    try {
      await fetch(`/api/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this conversation?')) return;
    try {
      await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      router.push('/chat');
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ThinkingIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-outline-variant/30 bg-background/90 backdrop-blur-md sticky top-0 z-30 transition-all">
        <div className="flex-1 min-w-0 mr-4">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
              className="bg-transparent border-b border-primary text-title-medium font-medium text-on-surface w-full focus:outline-none py-1"
            />
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
              <h1 className="text-title-medium font-medium text-on-surface truncate">{title}</h1>
              <Pencil size={14} className="text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
        <Button variant="icon" size="icon-sm" onClick={handleDelete} title="Delete Chat">
          <Trash2 size={18} className="text-on-surface-variant hover:text-error" />
        </Button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="max-w-4xl mx-auto w-full pb-40 pt-4 px-4 space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {loading && (
            <div className="animate-fade-in pl-4">
               <ThinkingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-12 pb-2 z-20">
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
