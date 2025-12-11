'use client';

import { useState } from 'react';
import { Check, Copy, Maximize2, X, Download } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/Input';

export default function CodeCanvas({ language, code, fileName = 'example' }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${language || 'txt'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const Content = () => (
        <div className="relative group">
            {/* Header Actions */}
            <div className="flex items-center justify-between px-4 py-2 bg-surface-container-high border-b border-outline-variant rounded-t-xl group-hover:bg-surface-container-highest transition-colors">
                <span className="text-label-small font-mono text-on-surface-variant uppercase">{language}</span>
                <div className="flex items-center gap-1">
                    <button onClick={handleCopy} className="p-1.5 hover:bg-white/10 rounded-md text-on-surface-variant transition-colors" title="Copy code">
                        {copied ? <Check size={16} className="text-secondary" /> : <Copy size={16} />}
                    </button>
                    {!isExpanded && (
                        <button onClick={handleDownload} className="p-1.5 hover:bg-white/10 rounded-md text-on-surface-variant transition-colors" title="Download">
                            <Download size={16} />
                        </button>
                    )}
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-white/10 rounded-md text-on-surface-variant transition-colors" title={isExpanded ? "Close" : "Expand"}>
                        {isExpanded ? <X size={16} /> : <Maximize2 size={16} />}
                    </button>
                </div>
            </div>

            {/* Code Area */}
            <div className={cn("overflow-auto bg-surface-container-highest rounded-b-xl", isExpanded ? "h-[calc(100vh-100px)]" : "max-h-[400px]")}>
                <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                    showLineNumbers={true}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );

    if (isExpanded) {
        return (
            <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-5xl bg-surface-container rounded-xl shadow-elevation-3 overflow-hidden border border-outline-variant">
                    <Content />
                </div>
            </div>
        );
    }

    return (
        <div className="my-4 rounded-xl border border-outline-variant bg-surface-container overflow-hidden">
            <Content />
        </div>
    );
}
