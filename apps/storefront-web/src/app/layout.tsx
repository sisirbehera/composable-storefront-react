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
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50/50 antialiased selection:bg-blue-500 selection:text-white">
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
