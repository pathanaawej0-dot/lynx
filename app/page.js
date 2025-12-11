import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Brain, Search, Shield } from 'lucide-react';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/chat');
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-medium tracking-tight bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">Lynx</span>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/auth/signin">
              <Button variant="text" size="sm" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="filled" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6 relative overflow-hidden">

        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-primary/10 via-tertiary/5 to-transparent rounded-[100%] blur-3xl -z-10 pointer-events-none opacity-50" />

        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/40 bg-surface-container-low/50 backdrop-blur-sm">
            <Sparkles size={14} className="text-primary" />
            <span className="text-label-small text-on-surface-variant font-medium">Introducing Lynx 1.0</span>
          </div>

          <h1 className="text-display-large md:text-[80px] leading-none font-medium tracking-tighter text-balance bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Your second brain,<br />built for <span className="text-primary">clarity</span>.
          </h1>

          <p className="text-headline-small text-on-surface-variant max-w-2xl mx-auto font-normal text-balance">
            Lynx remembers everything so you don't have to. A workspace that organizes your thoughts and retrieves them instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/auth/signin">
              <Button size="lg" className="rounded-full h-14 px-8 text-title-medium shadow-elevation-2 hover:shadow-elevation-3 transition-all hover:scale-105">
                Start Thinking with Lynx
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mt-32 w-full px-4">
          <div className="p-8 rounded-[32px] bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-outline-variant/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain size={24} />
            </div>
            <h3 className="text-headline-small font-medium mb-3 text-on-surface">Infinite Recall</h3>
            <p className="text-body-large text-on-surface-variant leading-relaxed">
              Every conversation is indexed. Recall details from months ago as if they happened seconds ago.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-outline-variant/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Search size={24} />
            </div>
            <h3 className="text-headline-small font-medium mb-3 text-on-surface">Semantic Search</h3>
            <p className="text-body-large text-on-surface-variant leading-relaxed">
              Search by concept, not just keywords. Lynx understands the intent behind your query.
            </p>
          </div>

          <div className="p-8 rounded-[32px] bg-surface-container-low border border-outline-variant/20 hover:bg-surface-container hover:border-outline-variant/40 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-2xl bg-tertiary/10 text-tertiary-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-headline-small font-medium mb-3 text-on-surface">Private & Secure</h3>
            <p className="text-body-large text-on-surface-variant leading-relaxed">
              Your thoughts remain yours. Enterprise-grade encryption and full control over your data retention.
            </p>
          </div>
        </div>
      </main>

       <footer className="py-8 border-t border-outline-variant/20 text-center">
          <p className="text-body-small text-on-surface-variant">
            © {new Date().getFullYear()} Lynx AI. Designed with focus.
          </p>
        </footer>
    </div>
  );
}
