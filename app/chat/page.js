'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatInput from '@/components/chat/ChatInput';
import { Sparkles, Zap, Lightbulb } from 'lucide-react';

export default function ChatPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSend = async (message) => {
        if (!message.trim() || loading) return;
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.conversationId) {
                    router.push(`/chat/${data.conversationId}`);
                }
            } else {
                console.error("Failed to start chat");
                // Ideally show a toast error here
            }
        } catch (error) {
            console.error("Error starting chat:", error);
        } finally {
            setLoading(false);
        }
    };

    const SuggestionCard = ({ icon: Icon, text, onClick }) => (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-3 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container hover:shadow-elevation-1 transition-all text-left group w-full border border-transparent hover:border-outline-variant/30 disabled:opacity-50"
        >
            <div className="p-2 rounded-full bg-surface-container text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon size={18} />
            </div>
            <span className="text-body-medium text-on-surface-variant group-hover:text-on-surface font-medium line-clamp-2">
                {text}
            </span>
        </button>
    );

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="h-full flex flex-col items-center justify-center px-4 max-w-4xl mx-auto w-full pb-32">

                    <div className="mb-12 text-center space-y-4 animate-fade-in">
                         <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary via-tertiary to-secondary mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary/20">
                            <Sparkles className="text-white w-8 h-8" />
                         </div>
                        <h1 className="text-headline-medium md:text-display-small font-medium text-transparent bg-clip-text bg-gradient-to-r from-on-surface to-on-surface-variant">
                            Hello, User
                        </h1>
                        <h2 className="text-headline-small md:text-headline-medium text-on-surface-variant/60 font-normal">
                            How can I help you today?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl animate-fade-in [animation-delay:200ms]">
                        <SuggestionCard
                            icon={Zap}
                            text="Summarize the key points of the latest project proposal"
                            onClick={() => handleSend("Summarize the key points of the latest project proposal")}
                        />
                         <SuggestionCard
                            icon={Lightbulb}
                            text="Draft an email to the team about the new timeline"
                            onClick={() => handleSend("Draft an email to the team about the new timeline")}
                        />
                         <SuggestionCard
                            icon={Brain}
                            text="Explain quantum computing in simple terms"
                            onClick={() => handleSend("Explain quantum computing in simple terms")}
                        />
                         <SuggestionCard
                            icon={Sparkles}
                            text="Create a study plan for learning Spanish"
                            onClick={() => handleSend("Create a study plan for learning Spanish")}
                        />
                    </div>
                </div>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background via-background to-transparent pt-10 pb-2 z-10">
                <ChatInput onSend={handleSend} disabled={loading} />
            </div>
        </div>
    );
}

// Helper icon
function Brain(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
            <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
        </svg>
    )
}
