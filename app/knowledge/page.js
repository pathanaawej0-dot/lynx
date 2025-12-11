'use client';

import { useState, useEffect } from 'react';
import { Search, Brain, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <header className="px-6 py-6 border-b border-outline-variant bg-surface sticky top-0 z-10 z-[5]">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-display-small font-bold text-on-surface mb-2 flex items-center gap-3">
            <Brain className="text-primary" size={32} />
            Knowledge Base
          </h1>
          <p className="text-body-large text-on-surface-variant mb-6">
            Search through your entire conversation history. Lynx remembers everything.
          </p>

          <div className="relative">
            <Input
              icon={Search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              label="Search memories..."
              className="bg-surface-container-high border-transparent focus:bg-surface-container-highest"
            />
          </div>
        </div>
      </header>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading && initialLoad && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          )}

          {!initialLoad && results.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <p className="text-title-medium mb-2">No memories found</p>
              <p>Try searching for a different keyword</p>
            </div>
          )}

          {results.map((item, i) => (
            <Card key={i} className="p-6 transition-all hover:bg-surface-container-high group" elevation={0} hover>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={item.role === 'user' ? "text-tertiary font-medium" : "text-primary font-medium"}>
                    {item.role === 'user' ? 'You' : 'Lynx'}
                  </span>
                  <span className="text-label-small text-on-surface-variant">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-label-small text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
                  Conversation: {item.conversation_title || 'Untitled'}
                </span>
              </div>
              <p className="text-body-large text-on-surface leading-relaxed">
                {item.content}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
