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
    Menu,
    LogOut,
    Zap,
    CreditCard
} from 'lucide-react';
import { cn } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [conversations, setConversations] = useState([]);
    const [credits, setCredits] = useState(null);

    // Fetch conversations & credits
    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user) return;
            try {
                // Fetch Conversations
                const resConvo = await fetch('/api/conversations');
                if (resConvo.ok) {
                    const data = await resConvo.json();
                    setConversations(data.conversations || []);
                }

                // Fetch Credits
                const resCredits = await fetch('/api/user/credits');
                if (resCredits.ok) {
                    const data = await resCredits.json();
                    setCredits(data.credits);
                }
            } catch (e) {
                console.error("Failed to fetch data", e);
            }
        };
        fetchData();

        // Refresh periodically or on focus could be added here
        const interval = setInterval(fetchData, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [session]);

    const handleNewChat = () => {
        router.push('/chat');
        if (window.innerWidth < 768) onClose();
    };

    const NavItem = ({ icon: Icon, label, onClick, href, active, collapsed, highlight }) => {
        const content = (
            <div
                onClick={onClick}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-full transition-all cursor-pointer group min-h-[44px]",
                    active
                        ? "bg-primary/15 text-on-surface"
                        : highlight
                            ? "text-primary hover:bg-primary/10"
                            : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                    collapsed && "justify-center px-0"
                )}
                title={collapsed ? label : undefined}
            >
                <Icon size={20} className={cn(
                    "shrink-0",
                    active ? "text-primary" : highlight ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                )} />
                {!collapsed && (
                    <span className={cn(
                        "text-body-medium font-medium truncate opacity-100 transition-opacity duration-200",
                         highlight && "font-bold"
                    )}>
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
                "fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-surface-container-low transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] border-r border-outline-variant/40",
                "md:translate-x-0",
                !isOpen && "-translate-x-full md:translate-x-0",
                isCollapsed ? "w-[72px]" : "w-[280px]"
            )}
        >
            {/* Header: Menu & New Chat */}
            <div className="p-3 flex flex-col gap-4 mb-2">
                <div className="flex items-center gap-2 pl-2">
                    <button
                        onClick={toggleCollapse}
                        className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-full transition-colors hidden md:block"
                    >
                        <Menu size={20} />
                    </button>
                     <button
                        onClick={onClose}
                        className="p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-full transition-colors md:hidden"
                    >
                        <Menu size={20} />
                    </button>
                    {!isCollapsed && <span className="text-title-medium text-on-surface font-medium ml-2">Lynx</span>}
                </div>

                <div
                    onClick={handleNewChat}
                    className={cn(
                        "flex items-center gap-3 p-3 bg-surface-container-high hover:bg-surface-container-highest transition-all rounded-[16px] cursor-pointer text-on-surface shadow-sm",
                        isCollapsed ? "w-10 h-10 p-0 justify-center rounded-full bg-transparent mx-auto hover:bg-surface-container-highest" : "mx-2"
                    )}
                    title="New Chat"
                >
                    <Plus size={20} className="text-on-surface" />
                    {!isCollapsed && <span className="text-label-large font-medium">New chat</span>}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 space-y-1 scrollbar-hide">
                {!isCollapsed && <h3 className="px-4 py-2 text-label-small font-medium text-on-surface-variant uppercase tracking-wider opacity-80">Recent</h3>}

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
            <div className="p-2 mt-auto space-y-1 pb-4 bg-surface-container-low">
                 {/* Credit Display */}
                 <div className={cn("mb-2 px-2 transition-all", isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                    <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-label-small text-on-surface-variant">Daily Credits</span>
                            <span className="text-label-small font-bold text-primary">{credits !== null ? credits : '-'} / 10</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(((credits || 0) / 10) * 100, 100)}%` }}
                            />
                        </div>
                        <Link href="/pricing" className="block mt-2 text-center text-label-small text-primary hover:underline">
                            Upgrade Plan
                        </Link>
                    </div>
                </div>

                <NavItem href="/knowledge" icon={Book} label="Knowledge" collapsed={isCollapsed} />
                <NavItem href="/pricing" icon={CreditCard} label="Pricing" collapsed={isCollapsed} highlight />
                <NavItem icon={Settings} label="Settings" collapsed={isCollapsed} />
                <NavItem icon={LogOut} label="Sign Out" onClick={() => signOut()} collapsed={isCollapsed} />

                <div className={cn("mt-2 pt-2 border-t border-outline-variant/40 mx-2", isCollapsed && "border-none flex justify-center")}>
                    {isCollapsed ? (
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-label-small font-bold cursor-pointer" title={session?.user?.email}>
                            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 px-2 py-2 rounded-full hover:bg-surface-container-high cursor-pointer transition-colors text-on-surface">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-label-small font-bold">
                                {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-label-medium truncate font-medium">{session?.user?.name || 'User'}</p>
                                <p className="text-body-small text-on-surface-variant truncate">{session?.user?.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
