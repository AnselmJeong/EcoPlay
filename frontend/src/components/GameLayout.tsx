import type { ReactNode } from 'react';
import { Info, CircleDollarSign, BarChart3, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";

interface GameLayoutProps {
  title: string;
  rules: string[];
  children: ReactNode;
  currentRound?: number;
  totalRounds?: number;
  playerBalance?: number;
  currentOpponent?: string; // For Trustee game
  additionalInfo?: ReactNode; // For game-specific info like sender's investment
}

export default function GameLayout({
  title,
  rules,
  children,
  currentRound,
  totalRounds,
  playerBalance,
  currentOpponent,
  additionalInfo,
}: GameLayoutProps) {
  const progressPercentage = totalRounds && currentRound ? (currentRound / totalRounds) * 100 : 0;

  return (
    <div className="container mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 shadow-xl rounded-xl bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-3">
            <Info className="h-8 w-8 text-primary" />
            <CardTitle className="font-headline text-3xl text-primary">{title}</CardTitle>
          </div>
          {totalRounds && currentRound && currentRound <= totalRounds && (
            <div className="mt-2">
              <CardDescription className="font-body text-sm mb-1">
                Round Progress: {currentRound} / {totalRounds}
              </CardDescription>
              <Progress value={progressPercentage} className="w-full h-3 bg-primary/20" indicatorClassName="bg-primary" />
            </div>
          )}
          {/* {currentOpponent && (
            <CardDescription className="font-body mt-2 text-base">
              <span className="font-semibold">Current Opponent:</span> {currentOpponent}
            </CardDescription>
          )} */}
        </CardHeader>
        <CardContent>
          <h3 className="font-headline text-xl text-primary mb-2">게임 규칙:</h3>
          <ul className="list-disc pl-5 space-y-2 font-body text-foreground/90 text-base">
            {rules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>
          {playerBalance !== undefined && (
            <div className="mt-6 p-4 bg-primary/10 rounded-lg flex items-center gap-3">
              <CircleDollarSign className="h-7 w-7 text-primary" />
              <div>
                <p className="font-body text-sm text-primary/80">Your Balance</p>
                <p className="font-headline text-2xl font-bold text-primary">{playerBalance} points</p>
              </div>
            </div>
          )}
          {additionalInfo && <div className="mt-4">{additionalInfo}</div>}
        </CardContent>
      </Card>

      <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm p-6 rounded-xl shadow-xl min-h-[400px] flex flex-col">
        {children}
      </div>
    </div>
  );
}
