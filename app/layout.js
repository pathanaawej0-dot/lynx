import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Lynx | Your Intelligent Workspace',
  description: 'An AI assistant that remembers everything. Inspired by the best, built for you.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface min-h-screen selection:bg-primary/30 selection:text-primary-foreground font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
