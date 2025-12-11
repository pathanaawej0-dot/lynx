'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function ConversationList({ conversations, onDelete }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentId = pathname.startsWith('/chat/') ? pathname.split('/')[2] : null;

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 604800000) {
      return d.toLocaleDateString([], { weekday: 'short' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-12 h-12 mx-auto text-text-secondary mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-text-secondary text-sm">No conversations yet</p>
        <p className="text-text-secondary text-xs mt-1">Start a new chat to begin</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => router.push(`/chat/${conv.id}`)}
          className={`
            group flex items-center justify-between p-3 rounded-md cursor-pointer
            transition-all duration-200
            ${currentId === conv.id 
              ? 'bg-primary/20 border-l-2 border-primary' 
              : 'hover:bg-surface-light'
            }
          `}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{conv.title}</p>
            <p className="text-xs text-text-secondary">{formatDate(conv.updated_at)}</p>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
            >
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
