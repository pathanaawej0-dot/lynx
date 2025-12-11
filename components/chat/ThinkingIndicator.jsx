'use client';

import { Sparkles } from 'lucide-react';

export default function ThinkingIndicator() {
    return (
        <div className="flex gap-4 w-full max-w-4xl mx-auto mb-4 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant">
                <Sparkles size={16} className="text-primary animate-pulse" />
            </div>

            <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="flex items-center gap-2">
                    <span className="text-label-medium font-medium text-on-surface">Lynx</span>
                    <span className="text-label-small text-on-surface-variant">is thinking...</span>
                </div>

                <div className="p-4 bg-surface-container-high rounded-xl border border-primary/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                        </div>
                        <span className="text-body-medium text-on-surface-variant">Analyzing context and memory...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
