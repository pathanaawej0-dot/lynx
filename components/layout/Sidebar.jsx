'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    Plus,
    MessageSquare,
    Book,
    Settings,
    LogOut,
    Menu,
    X,
    HelpCircle,
    Activity
} from 'lucide-react';
import { cn } from '@/components/ui/Input';

export default function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        const fetchConvos = async () => {
            try {
                const res = await fetch('/api/conversations');
                if (res.ok) {
                    const data = await res.json();
                    setConversations(data.conversations || []);
                }
            } catch (e) {
                console.error("Failed to fetch conversations", e);
            }
        };
        if (session?.user) fetchConvos();
    }, [session]);

    const handleNewChat = () => {
        router.push('/chat');
        if (window.innerWidth < 768) onClose();
    };

    const NavItem = ({ icon: Icon, label, onClick, href, active, collapsed }) => {
        const content = (
            <div
                onClick={onClick}
                className={cn(
                    "flex items-center gap-4 px-4 py-3 mx-2 rounded-full transition-all cursor-pointer group min-h-[48px]",
                    active
                        ? "bg-[#004A77]/40 text-[#D3E3FD]" // Active: Dark blue tint with light blue text
                        : "text-[#C4C7C5] hover:bg-[#282A2C] hover:text-[#E3E3E3]" // Inactive: Grey to White
                )}
                title={collapsed ? label : undefined}
            >
                <Icon size={20} className={cn(
                    "shrink-0",
                    active ? "text-[#A8C7FA]" : "text-[#C4C7C5] group-hover:text-[#E3E3E3]"
                )} />
                {!collapsed && (
                    <span className="text-body-medium font-medium truncate opacity-100 transition-opacity duration-200">
                        {label}
                    </span>
                )}
            </div>
        );

        if (href) return <Link href={href}>{content}</Link>;
        return content;
    };

    return (
        <aside
            className={cn(
                "fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-[#1E1F20] transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] border-r border-[#444746]/40",
                "md:translate-x-0",
                !isOpen && "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-[72px]" : "w-[280px]"
            )}
        >
            {/* Header: Menu & New Chat */}
            <div className="p-2 flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-3 pl-3 pt-2">
                    <button
                        onClick={toggleCollapse}
                        className="p-3 text-[#C4C7C5] hover:bg-[#282A2C] hover:text-[#E3E3E3] rounded-full transition-colors"
                    >
                        <Menu size={20} />
                    </button>
                    {!isCollapsed && <span className="text-title-medium text-on-surface-variant font-medium opacity-60">Lynx</span>}
                </div>

                <div
                    onClick={handleNewChat}
                    className={cn(
                        "flex items-center gap-3 mx-2 p-3 bg-[#282A2C] hover:bg-[#3C4043] transition-all rounded-[16px] cursor-pointer text-[#C4C7C5] hover:text-[#E3E3E3]",
                        isCollapsed ? "w-10 h-10 p-0 justify-center rounded-full bg-transparent mx-auto" : "w-[140px]"
                    )}
                    title="New Chat"
                >
                    <Plus size={20} className={isCollapsed ? "text-[#C4C7C5]" : "text-[#C4C7C5] group-hover:text-[#E3E3E3]"} />
                    {!isCollapsed && <span className="text-label-large font-medium">New chat</span>}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-0 py-2 space-y-1 scrollbar-hide">
                {!isCollapsed && <h3 className="px-6 py-2 text-[11px] font-medium text-[#C4C7C5] uppercase tracking-wider opacity-80">Recent</h3>}

                {conversations.slice(0, isCollapsed ? 0 : 50).map((chat) => (
                    <NavItem
                        key={chat.id}
                        href={`/chat/${chat.id}`}
                        icon={MessageSquare}
                        label={chat.title || "New Chat"}
                        active={pathname === `/chat/${chat.id}`}
                        collapsed={isCollapsed}
                    />
                ))}
            </div>

            {/* Footer */}
            <div className="p-2 mt-auto space-y-1 pb-4">
                <NavItem href="/knowledge" icon={Book} label="Knowledge" collapsed={isCollapsed} />
                <NavItem icon={Settings} label="Settings" collapsed={isCollapsed} />

                <div className={cn("mt-2 pt-2 border-t border-[#444746]/50 mx-2", isCollapsed && "border-none flex justify-center")}>
                    {isCollapsed ? (
                        <div className="w-8 h-8 rounded-full bg-[#A8C7FA] text-[#040C19] flex items-center justify-center text-xs font-bold cursor-pointer" title={session?.user?.email}>
                            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-[#282A2C] cursor-pointer transition-colors text-[#E3E3E3]">
                            <div className="w-8 h-8 rounded-full bg-[#A8C7FA] text-[#040C19] flex items-center justify-center text-xs font-bold">
                                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-label-medium truncate">{session?.user?.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
