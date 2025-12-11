'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { cn } from '@/components/ui/Input';

export default function ChatLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Default expanded on desktop

  // Auto-collapse on smaller desktop screens if needed, or stick to user pref
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content Area - Adjust margin based on collapsed state */}
      <main
        className={cn(
          "flex-1 flex flex-col h-full relative w-full transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          // Desktop margins
          isCollapsed ? "md:ml-[72px]" : "md:ml-[280px]"
        )}
      >

        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 border-b border-outline-variant bg-surface sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-on-surface">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-title-large text-on-surface">Lynx</span>
        </div>

        {children}
      </main>
    </div>
  );
}
