import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightCircle } from 'lucide-react';

interface GameCardProps {
  title: string;
  description: string;
  link: string;
  Icon: LucideIcon;
  ctaText?: string;
}

export default function GameCard({ title, description, link, Icon, ctaText = "Play Game" }: GameCardProps) {
  return (
    <Card className="w-full max-w-md h-full flex flex-col transform transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card rounded-xl overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex items-center gap-4 mb-3">
          <Icon className="h-12 w-12 text-primary" />
          <CardTitle className="font-headline text-2xl text-primary">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1">
        <CardDescription className="font-body text-base text-foreground/80">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 bg-secondary/30 mt-auto">
        <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-3 text-lg font-semibold rounded-md transition-colors">
          <Link href={link}>
            {ctaText} <ArrowRightCircle className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
