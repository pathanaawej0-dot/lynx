'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Plus, Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
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
        <div className="w-full max-w-[800px] mx-auto px-4 pb-6">
            <div
                className={cn(
                    "relative flex items-end gap-2 p-3 bg-[#1E1F20] rounded-[28px] transition-all border border-[#444746]/50 shadow-elevation-1",
                    disabled ? "opacity-70" : "focus-within:bg-[#282A2C] focus-within:border-[#A8C7FA]/50 hover:border-[#A8C7FA]/30"
                )}
            >
                <div className="flex items-center gap-1 mb-1.5 ml-1">
                    <button
                        className="p-2 text-on-surface hover:text-primary hover:bg-surface-container-highest rounded-full transition-colors"
                        disabled={disabled}
                        title="Attach file"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        className="p-2 text-on-surface hover:text-primary hover:bg-surface-container-highest rounded-full transition-colors md:hidden"
                        disabled={disabled}
                    >
                        <Mic size={20} />
                    </button>
                </div>

                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask Lynx..."
                    disabled={disabled}
                    rows={1}
                    className="flex-1 max-h-[200px] py-3.5 bg-transparent border-none focus:ring-0 resize-none text-body-large text-on-surface placeholder:text-on-surface-variant/70 overflow-y-auto min-h-[52px]"
                    style={{ height: '52px' }}
                />

                <div className="flex items-center gap-1 mb-1.5 mr-1">
                    {input.trim() ? (
                        <button
                            onClick={handleSubmit}
                            disabled={disabled}
                            className="p-2 bg-on-surface text-surface rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <Send size={18} className="translate-x-0.5 translate-y-0.5" />
                        </button>
                    ) : (
                        <button
                            className="p-2 text-on-surface hover:text-primary hover:bg-surface-container-highest rounded-full transition-colors hidden md:block"
                            disabled={disabled}
                        >
                            <Mic size={20} />
                        </button>
                    )}
                </div>
            </div>
            <div className="text-center mt-3">
                <p className="text-[11px] text-on-surface-variant/60">
                    Lynx can make mistakes. Double check responses.
                </p>
            </div>
        </div>
    );
}
