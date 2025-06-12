"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DollarSign, AlertCircle, CheckCircle2, Users, ThumbsUp, ArrowRight, TrendingUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const ROUNDS_PER_OPPONENT = 10;
const NUM_OPPONENTS = 4;
const TOTAL_ROUNDS = ROUNDS_PER_OPPONENT * NUM_OPPONENTS;
const POINTS_PER_ROUND_BONUS = 10; // Added to balance each round

const opponentStrategies = [
  { name: "Cautious Receiver", returnRate: () => Math.random() * 0.2 + 0.1 }, // Returns 10-30%
  { name: "Fair Receiver", returnRate: () => Math.random() * 0.2 + 0.4 },   // Returns 40-60%
  { name: "Generous Receiver", returnRate: () => Math.random() * 0.2 + 0.7 }, // Returns 70-90%
  { name: "Unpredictable Receiver", returnRate: () => Math.random() * 0.8 + 0.1 }, // Returns 10-90%
];

export default function TrustGameTrusteePage() {
  const [currentOverallRound, setCurrentOverallRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(50); // Initial starting balance
  const [investment, setInvestment] = useState('');
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxInvestment, setMaxInvestment] = useState(Math.floor(playerBalance / 2));
  const { toast } = useToast();

  const currentOpponentIndex = Math.floor((currentOverallRound - 1) / ROUNDS_PER_OPPONENT);
  const currentOpponent = opponentStrategies[currentOpponentIndex % NUM_OPPONENTS];
  const roundWithCurrentOpponent = (currentOverallRound - 1) % ROUNDS_PER_OPPONENT + 1;

  const gameTitle = "Trust Game (Trustee)";
  const gameRules = [
    "You are the Trustee. Your starting balance is 50 points.",
    `You get an additional ${POINTS_PER_ROUND_BONUS} points at the start of each round.`,
    `Play ${ROUNDS_PER_OPPONENT} rounds with each of ${NUM_OPPONENTS} different opponents (total ${TOTAL_ROUNDS} rounds).`,
    "In each round, you can invest 0 to 50% of your current balance.",
    "Your investment is tripled and given to the current opponent (Receiver).",
    "The Receiver returns a portion to you based on their strategy.",
    "Goal: Gauge opponent trustworthiness and invest wisely to maximize your points."
  ];
  
  useEffect(() => {
    // Add points per round bonus if it's not the very first render of the first round
    if(currentOverallRound > 1 || (currentOverallRound === 1 && roundResult !== null)) { // Add bonus after first round's result or if moving to next round
       setPlayerBalance(prev => prev + POINTS_PER_ROUND_BONUS);
    }
  }, [currentOverallRound, roundResult === null]); // Re-run when round changes, ensure balance updated before calculating maxInvestment

  useEffect(() => {
    setMaxInvestment(Math.floor(playerBalance / 2));
  }, [playerBalance]);

  const handleSubmit = async () => {
    const investmentAmount = parseInt(investment);
    if (isNaN(investmentAmount) || investmentAmount < 0 || investmentAmount > maxInvestment) {
      toast({
        title: "Invalid Investment",
        description: `Please enter a number between 0 and ${maxInvestment}.`,
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    const investmentTripled = investmentAmount * 3;
    const returnRate = currentOpponent.returnRate();
    const returnedByReceiver = Math.floor(investmentTripled * returnRate);
    const payoff = returnedByReceiver - investmentAmount;
    const newBalance = playerBalance + payoff;

    setPlayerBalance(newBalance);
    setRoundResult(`You invested ${investmentAmount}. It became ${investmentTripled}. ${currentOpponent.name} returned ${returnedByReceiver} (approx ${Math.round(returnRate*100)}%). Payoff: ${payoff}. New balance: ${newBalance}.`);
    
    // console.log("Firebase: Saving Trust Game (Trustee) round data", { round: currentOverallRound, opponent: currentOpponent.name, investment: investmentAmount, returned: returnedByReceiver, payoff, newBalance });
     toast({
        title: `Round ${currentOverallRound} Submitted!`,
        description: `Your new balance is ${newBalance}.`,
        icon: <CheckCircle2 className="h-5 w-5" />,
    });

    if (currentOverallRound >= TOTAL_ROUNDS) {
      setIsGameFinished(true);
    }
  };

  const handleNextRound = () => {
    setCurrentOverallRound(prev => prev + 1);
    setInvestment('');
    setRoundResult(null);
  };
  
  if (isGameFinished) {
    return (
      <GameLayout title={gameTitle} rules={gameRules} playerBalance={playerBalance}>
        <Card className="shadow-lg animate-fadeInUp">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2 text-primary">
              <ThumbsUp className="h-8 w-8" /> Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-body text-lg">You have completed all {TOTAL_ROUNDS} rounds as the Trustee.</p>
            <p className="font-body text-lg">Your final balance is: <strong className="font-headline text-2xl text-accent">{playerBalance} points</strong>.</p>
            <p className="font-body text-md text-foreground/80">How well did you adapt your strategy to different opponents? Trust is a valuable commodity!</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3 px-6">
              <Link href="/">
                Back to Home <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </GameLayout>
    );
  }

  return (
    <GameLayout 
      title={gameTitle} 
      rules={gameRules} 
      currentRound={currentOverallRound} 
      totalRounds={TOTAL_ROUNDS} 
      playerBalance={playerBalance}
      currentOpponent={`${currentOpponent.name} (Round ${roundWithCurrentOpponent}/${ROUNDS_PER_OPPONENT})`}
    >
      <Card className="shadow-lg animate-fadeIn">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            {roundResult ? `Round ${currentOverallRound} Results` : `Round ${currentOverallRound}: Your Investment`}
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[150px]">
          {roundResult ? (
             <div className="space-y-3 p-4 bg-secondary/50 rounded-md">
              <p className="font-body text-md">{roundResult}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
              <div>
                <Label htmlFor="investmentInput" className="font-body text-lg block mb-2">
                  Your investment (0 to {maxInvestment}):
                </Label>
                <Input
                  id="investmentInput"
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder={`Enter amount (max ${maxInvestment})`}
                  min="0"
                  max={maxInvestment}
                  className="font-body text-lg p-3"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">You can invest up to 50% of your current balance. Your investment will be tripled.</p>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
                Submit Investment <DollarSign className="ml-2 h-5 w-5" />
              </Button>
            </form>
          )}
        </CardContent>
        {roundResult && (
          <CardFooter>
            <Button onClick={handleNextRound} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-3">
              Next Round <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardFooter>
        )}
      </Card>
    </GameLayout>
  );
}
