'use client';

import { User, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import { cn } from '@/components/ui/Input';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                "flex gap-4 w-full max-w-4xl mx-auto mb-6 group animate-fadeIn",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm mt-1",
                    isUser
                        ? "bg-tertiary border-transparent text-surface-container"
                        : "bg-surface-container-high border-outline-variant text-primary"
                )}
            >
                {isUser ? <User size={18} /> : <Sparkles size={16} />}
            </div>

            {/* Message Content */}
            <div
                className={cn(
                    "flex flex-col max-w-[90%] min-w-0 transition-all duration-200",
                    isUser ? "items-end" : "items-start w-full"
                )}
            >
                {/* Header (Name & Time) */}
                {!isUser && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                        <span className="text-label-medium font-medium text-on-surface">Lynx</span>
                    </div>
                )}

                {/* Bubble/Container */}
                <div
                    className={cn(
                        "text-body-large break-words overflow-hidden shadow-sm",
                        isUser
                            ? "bg-surface-container-highest text-on-surface rounded-[24px] px-6 py-3.5 rounded-br-sm"
                            : "bg-surface text-on-surface rounded-xl border border-outline-variant/40 p-6 w-full shadow-elevation-1"
                    )}
                >
                    {isUser ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                        <MarkdownRenderer content={message.content} />
                    )}
                </div>
            </div>
        </div>
    );
}
