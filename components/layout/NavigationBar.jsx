'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NavigationBar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-title-large font-bold text-on-surface tracking-tight">Lynx</span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/auth/signin">
                        <Button variant="filled" className="rounded-full">
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
