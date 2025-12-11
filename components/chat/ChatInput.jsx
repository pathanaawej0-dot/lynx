'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Mic, Paperclip, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/components/ui/Input';

export default function ChatInput({ onSend, disabled }) {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 pb-4">
            <div
                className={cn(
                    "relative flex flex-col gap-2 p-2 bg-surface-container rounded-3xl transition-all border border-transparent shadow-elevation-1",
                    disabled ? "opacity-70" : "focus-within:bg-surface-container-high focus-within:shadow-elevation-2"
                )}
            >
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Lynx anything..."
                    disabled={disabled}
                    rows={1}
                    className="w-full max-h-[200px] px-4 py-3 bg-transparent border-none focus:ring-0 resize-none text-body-large text-on-surface placeholder:text-on-surface-variant/70 overflow-y-auto min-h-[56px]"
                    style={{ height: '56px' }}
                />

                <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-1">
                        <button
                            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
                            disabled={disabled}
                            title="Attach file"
                        >
                            <Plus size={20} />
                        </button>
                         <button
                            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
                            disabled={disabled}
                            title="Upload Image"
                        >
                            <ImageIcon size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {input.trim() ? (
                            <button
                                onClick={handleSubmit}
                                disabled={disabled}
                                className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-sm"
                            >
                                <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                            </button>
                        ) : (
                             <button
                                className="p-2 bg-surface-container-highest text-on-surface-variant rounded-full transition-colors opacity-50 cursor-not-allowed"
                                disabled={true}
                            >
                                <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="text-center mt-2">
                <p className="text-[11px] text-on-surface-variant/60">
                    Lynx can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}
