'use client';

import { useState, useEffect } from 'react';
import { Search, Library, Loader2, Calendar, MessageSquare, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/components/ui/Input';

export default function KnowledgePage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Auto-search on debounced input or initial load
  useEffect(() => {
    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/knowledge?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    const timeoutId = setTimeout(() => {
      search();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[128px] pointer-events-none" />

      {/* Header */}
      <header className="px-6 py-8 md:py-12 max-w-5xl mx-auto w-full z-10">
        <div className="flex flex-col gap-6">
           <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Library size={28} />
                </div>
                <div>
                    <h1 className="text-headline-medium md:text-display-small font-medium text-on-surface">Knowledge Base</h1>
                </div>
           </div>

          <p className="text-title-medium text-on-surface-variant max-w-2xl font-normal leading-relaxed">
            Every interaction is indexed. Search your entire history to rediscover ideas, facts, and conversations instantly.
          </p>

          <div className="relative mt-4 group">
            <Input
              icon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Search your memories..."
              className="bg-surface-container shadow-elevation-1 focus:shadow-elevation-2 border-transparent transition-all h-16 text-lg rounded-2xl"
            />
            {loading && (
                <div className="absolute right-4 top-5 text-primary">
                    <Loader2 className="animate-spin" size={24} />
                </div>
            )}
          </div>
        </div>
      </header>

      {/* Results Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-12 w-full z-10 scrollbar-hide">
        <div className="max-w-5xl mx-auto">

          {!initialLoad && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant opacity-60">
              <Library size={64} strokeWidth={1} className="mb-4" />
              <p className="text-title-large font-normal">No matching memories found</p>
              <p className="text-body-medium mt-2">Try different keywords or start a new conversation</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item, i) => (
              <div
                key={i}
                className="flex flex-col p-6 rounded-[24px] bg-surface-container-low border border-outline-variant/30 hover:border-primary/30 hover:bg-surface-container transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-label-small text-on-surface-variant bg-surface-container-high/50 px-3 py-1 rounded-full">
                        <Calendar size={14} />
                        {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    <Link href={`/chat/${item.conversation_id}`} className="text-primary hover:text-primary/80 transition-colors">
                        <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </Link>
                </div>

                <div className="flex-1 mb-4">
                    <p className="text-body-large text-on-surface line-clamp-4 leading-relaxed font-normal">
                        {item.content}
                    </p>
                </div>

                <div className="pt-4 mt-auto border-t border-outline-variant/20 flex items-center justify-between text-label-small text-on-surface-variant/80">
                     <span className={cn(
                         "flex items-center gap-1.5 px-2 py-0.5 rounded-md",
                         item.role === 'user' ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"
                     )}>
                        {item.role === 'user' ? 'You' : 'Lynx'}
                     </span>
                     <div className="flex items-center gap-1.5 max-w-[50%]">
                        <MessageSquare size={14} />
                        <span className="truncate">{item.conversation_title || 'Untitled Chat'}</span>
                     </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
