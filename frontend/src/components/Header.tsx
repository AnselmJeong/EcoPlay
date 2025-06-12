import Link from 'next/link';
import { Coins } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary/80 backdrop-blur-md text-primary-foreground py-4 px-6 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-200">
          <Coins className="h-10 w-10 text-accent animate-pulse" />
          <h1 className="text-4xl font-headline font-bold tracking-tight">EcoPlay</h1>
        </Link>
        {/* Future navigation can go here if needed */}
      </div>
    </header>
  );
}
