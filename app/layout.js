import './globals.css';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Lynx - AI Assistant with Infinite Memory',
  description: 'ChatGPT forgets. Lynx never does. Your AI assistant with infinite memory powered by vector database.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-text-primary min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
