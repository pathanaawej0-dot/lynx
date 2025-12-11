'use client';

import { User, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { cn } from '@/components/ui/Input';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                "flex gap-4 w-full mb-2 group animate-fade-in",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm transition-transform hover:scale-105",
                    isUser
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-gradient-to-br from-primary to-tertiary text-primary-foreground"
                )}
            >
                {isUser ? <User size={16} strokeWidth={2.5} /> : <Sparkles size={16} strokeWidth={2.5} />}
            </div>

            {/* Message Content */}
            <div
                className={cn(
                    "flex flex-col max-w-[85%] sm:max-w-[75%] min-w-0 transition-all duration-200",
                    isUser ? "items-end" : "items-start w-full"
                )}
            >
                {/* Header (Name) - Only for Assistant */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-1.5 ml-1">
                        <span className="text-label-small font-medium text-on-surface-variant">Lynx</span>
                    </div>
                )}

                {/* Bubble/Container */}
                <div
                    className={cn(
                        "text-body-large break-words overflow-hidden",
                        isUser
                            ? "bg-surface-container-high text-on-surface rounded-[20px] px-5 py-3 rounded-tr-sm shadow-sm"
                            : "bg-transparent text-on-surface w-full pl-0 pt-0" // Gemini style: Assistant text is clean on background
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <div className="prose prose-invert prose-p:text-on-surface prose-headings:text-on-surface prose-strong:text-on-surface-variant prose-code:text-primary max-w-none">
                            <MarkdownRenderer content={message.content} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
