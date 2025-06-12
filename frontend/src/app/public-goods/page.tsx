"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, TrendingUp, ThumbsUp, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const TOTAL_ROUNDS = 10;
const INITIAL_POINTS = 100;
const NUM_PLAYERS = 5; // Player + 4 AI

export default function PublicGoodsGamePage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_POINTS);
  const [donation, setDonation] = useState('');
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [maxDonation, setMaxDonation] = useState(Math.floor(INITIAL_POINTS / 2));
  const { toast } = useToast();

  const gameTitle = "Public Goods Game";
  const gameRules = [
    `You start with ${INITIAL_POINTS} points.`,
    `There are ${TOTAL_ROUNDS} rounds. In each round, you can donate up to half your current balance (max ${maxDonation} points this round) to a common account.`,
    "The total amount donated by all players is multiplied by 1.5.",
    "This new total is then evenly distributed among all players.",
    "Your goal is to balance personal gain with group benefits."
  ];

  useEffect(() => {
    setMaxDonation(Math.floor(playerBalance / 2));
  }, [playerBalance]);
  
  const handleSubmit = async () => {
    const donationAmount = parseInt(donation);
    if (isNaN(donationAmount) || donationAmount < 0 || donationAmount > maxDonation) {
      toast({
        title: "Invalid Donation",
        description: `Please enter a number between 0 and ${maxDonation}.`,
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    // Simulate other players' donations (e.g., donating between 0 and 25% of their assumed 100 points)
    const otherPlayerDonations = Array.from({ length: NUM_PLAYERS - 1 }, () => Math.floor(Math.random() * (INITIAL_POINTS * 0.25)));
    const totalDonatedByGroup = donationAmount + otherPlayerDonations.reduce((sum, d) => sum + d, 0);
    const commonPot = totalDonatedByGroup * 1.5;
    const sharePerPlayer = commonPot / NUM_PLAYERS;
    const payoff = sharePerPlayer - donationAmount;
    const newBalance = playerBalance + payoff;

    setPlayerBalance(newBalance);
    setRoundResult(`You donated ${donationAmount}. Total group donation: ${totalDonatedByGroup}. Common pot became ${commonPot.toFixed(1)}. Your share: ${sharePerPlayer.toFixed(1)}. Your payoff: ${payoff.toFixed(1)}. New balance: ${newBalance.toFixed(1)}.`);
    
    // console.log("Firebase: Saving Public Goods Game round data", { round: currentRound, donation: donationAmount, payoff, newBalance });
    toast({
        title: `Round ${currentRound} Submitted!`,
        description: `Your new balance is ${newBalance.toFixed(1)} points.`,
        icon: <CheckCircle2 className="h-5 w-5" />,
    });

    if (currentRound >= TOTAL_ROUNDS) {
      setIsGameFinished(true);
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setDonation('');
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
            <p className="font-body text-lg">You have completed all {TOTAL_ROUNDS} rounds of the Public Goods Game.</p>
            <p className="font-body text-lg">Your final balance is: <strong className="font-headline text-2xl text-accent">{playerBalance.toFixed(1)} points</strong>.</p>
            <p className="font-body text-md text-foreground/80">Reflect on your strategy. Did you manage to balance your personal interest with the group's benefit?</p>
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
    <GameLayout title={gameTitle} rules={gameRules} currentRound={currentRound} totalRounds={TOTAL_ROUNDS} playerBalance={playerBalance.toFixed(1)}>
      <Card className="shadow-lg animate-fadeIn">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">
            {roundResult ? `Round ${currentRound} Results` : `Round ${currentRound}: Your Donation`}
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
                <Label htmlFor="donationInput" className="font-body text-lg block mb-2">
                  Your donation (0 to {maxDonation}):
                </Label>
                <Input
                  id="donationInput"
                  type="number"
                  value={donation}
                  onChange={(e) => setDonation(e.target.value)}
                  placeholder={`Enter amount (max ${maxDonation})`}
                  min="0"
                  max={maxDonation}
                  className="font-body text-lg p-3"
                  required
                />
                 <p className="text-sm text-muted-foreground mt-1">You can donate up to 50% of your current balance.</p>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
                Submit Donation <TrendingUp className="ml-2 h-5 w-5" />
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
