import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@storefront/ui';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import { StorefrontProviders } from '@/components/StorefrontProviders';

export const metadata: Metadata = {
  title: 'Composable Storefront | Powered by Next.js & React',
  description: 'Enterprise headless e-commerce storefront equivalent to SAP Spartacus',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('storefront_theme') || 'light';
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (theme === 'system' && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white transition-colors duration-200">
        <StorefrontProviders>
          <StorefrontHeader />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </StorefrontProviders>
      </body>
    </html>
  );
}
