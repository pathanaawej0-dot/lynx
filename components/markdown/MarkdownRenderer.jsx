'use client';

import ReactMemo from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MermaidDiagram from './MermaidDiagram';
import CodeCanvas from '../chat/CodeCanvas';

const MarkdownRenderer = ({ content }) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <h1 className="text-headline-large font-bold mt-8 mb-4 text-on-surface" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-headline-medium font-bold mt-6 mb-3 text-on-surface" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-title-large font-medium mt-4 mb-2 text-on-surface" {...props} />,
                p: ({ node, ...props }) => <p className="text-body-large leading-relaxed mb-4 text-on-surface" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-on-surface" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-on-surface" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1 marker:text-primary" {...props} />,
                blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary bg-surface-container pl-4 py-2 my-4 italic text-on-surface-variant rounded-r-lg" {...props} />
                ),
                a: ({ node, ...props }) => <a className="text-primary hover:underline font-medium" {...props} />,
                table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-6 rounded-xl border border-outline-variant">
                        <table className="w-full text-left bg-surface-container" {...props} />
                    </div>
                ),
                th: ({ node, ...props }) => <th className="bg-surface-container-high px-6 py-3 font-medium text-on-surface" {...props} />,
                td: ({ node, ...props }) => <td className="px-6 py-3 border-t border-outline-variant-variant text-on-surface-variant" {...props} />,
                code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isMermaid = match && match[1] === 'mermaid';

                    if (!inline && isMermaid) {
                        return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                    }

                    if (!inline && match) {
                        return <CodeCanvas language={match[1]} code={String(children).replace(/\n$/, '')} />;
                    }

                    if (!inline) {
                        return <CodeCanvas language="text" code={String(children).replace(/\n$/, '')} />;
                    }

                    return (
                        <code className="bg-surface-container-highest px-1.5 py-0.5 rounded text-tertiary font-mono text-body-medium" {...props}>
                            {children}
                        </code>
                    );
                }
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
