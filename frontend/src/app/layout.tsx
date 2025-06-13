import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/Header';
import { StagewiseToolbar } from '@stagewise/toolbar-next';
import { ReactPlugin } from '@stagewise-plugins/react';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'EcoPlay - Economic Games',
  description: 'Play engaging economic games like Public Goods and Trust Game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster />
          <footer className="bg-secondary text-secondary-foreground text-center p-4 font-body text-sm">
            © {new Date().getFullYear()} EcoPlay. All rights reserved.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
