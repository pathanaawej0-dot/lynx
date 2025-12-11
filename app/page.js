import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import NavigationBar from '@/components/layout/NavigationBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/chat');
  }

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-primary-foreground">
      <NavigationBar />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden pt-16">
          {/* Ambient Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[128px] animate-pulse-slow [animation-delay:1.5s]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
            <h1 className="text-display-large font-bold tracking-tight text-on-surface">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Lynx</span>
            </h1>
            <p className="text-headline-medium font-medium text-on-surface-variant text-balance max-w-3xl mx-auto">
              The AI that never forgets.
            </p>
            <p className="text-body-large text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Standard AI models lose context after a few messages. Lynx remembers every conversation, every detail, forever.
            </p>

            <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth/signin">
                <Button size="lg" className="rounded-full shadow-elevation-2 hover:shadow-elevation-3 px-12">
                  Try Lynx Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-6 bg-surface-container/30">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4 bg-surface-container" hover>
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-headline-medium font-medium text-on-surface">Infinite Memory</h3>
              <p className="text-body-large text-on-surface-variant">
                Every interaction is stored with semantic embeddings. Reference discussions from months ago instantly.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-surface-container" hover>
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-headline-medium font-medium text-on-surface">Semantic Search</h3>
              <p className="text-body-large text-on-surface-variant">
                Don't just keyword search. Find ideas and concepts. Lynx understands what you mean, not just what you say.
              </p>
            </Card>

            <Card className="p-8 space-y-4 bg-surface-container" hover>
              <div className="w-12 h-12 rounded-xl bg-tertiary/20 flex items-center justify-center">
                <span className="text-2xl">👁️</span>
              </div>
              <h3 className="text-headline-medium font-medium text-on-surface">Transparency</h3>
              <p className="text-body-large text-on-surface-variant">
                See exactly what the AI retrieves from your history. Full control over your knowledge base.
              </p>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-outline-variant text-center bg-surface">
          <p className="text-label-large text-on-surface-variant">
            © 2024 Lynx AI. Built with Material Design 3.
          </p>
        </footer>
      </main>
    </div>
  );
}
