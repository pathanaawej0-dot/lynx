'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { cn } from '@/components/ui/Input';

export default function ChatLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden glassmorphism"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={cn(
          "h-full z-50 flex-shrink-0 transition-all duration-300",
          "fixed md:relative", // Fixed on mobile, relative flow on desktop
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      <main className="flex-1 flex flex-col h-full min-w-0 bg-background relative z-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-outline-variant/50 bg-surface/90 backdrop-blur-md sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="ml-2 font-medium text-title-medium text-on-surface">Lynx</span>
        </div>

        {children}
      </main>
    </div>
  );
}
