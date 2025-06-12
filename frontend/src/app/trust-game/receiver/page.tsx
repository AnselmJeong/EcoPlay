"use client";

import { useState, useEffect } from 'react';
import GameLayout from '@/components/GameLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Gift, AlertCircle, CheckCircle2, Send, ThumbsUp, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

const TOTAL_ROUNDS = 10;
const INITIAL_BALANCE = 0; // Receiver starts with 0, gets points from sender

export default function TrustGameReceiverPage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [playerBalance, setPlayerBalance] = useState(INITIAL_BALANCE); // This balance accumulates from returns not sent back
  const [amountToReturn, setAmountToReturn] = useState('');
  const [roundResult, setRoundResult] = useState<string | null>(null);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [receivedFromSender, setReceivedFromSender] = useState(0); // Actual amount * 3
  const [maxReturn, setMaxReturn] = useState(0);
  const { toast } = useToast();

  const gameTitle = "Trust Game (Receiver)";
  const gameRules = [
    "You are the Receiver in this game.",
    `There are ${TOTAL_ROUNDS} rounds.`,
    "In each round, a Sender invests some points. This amount is tripled and given to you.",
    "You can then choose to return any amount of this (from 0 up to what you received) back to the Sender.",
    "Your goal is to decide wisely how much to return."
  ];

  useEffect(() => {
    // Simulate sender's investment for the new round
    const senderInvestment = Math.floor(Math.random() * 30) + 10; // Sender invests 10-40 points
    const tripledAmount = senderInvestment * 3;
    setReceivedFromSender(tripledAmount);
    setMaxReturn(tripledAmount);
    setPlayerBalance(prev => prev + tripledAmount); // Temporarily add to balance, will subtract returned amount later
  }, [currentRound]);
  
  const handleSubmit = async () => {
    const returnAmountNum = parseInt(amountToReturn);
    if (isNaN(returnAmountNum) || returnAmountNum < 0 || returnAmountNum > maxReturn) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a number between 0 and ${maxReturn}.`,
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      return;
    }

    const pointsKept = maxReturn - returnAmountNum;
    // Adjust playerBalance: it was pre-incremented by maxReturn, so subtract what's returned.
    // Or, simpler: playerBalance for this round = pointsKept. If balance accumulates across rounds, it's more complex.
    // Let's assume balance is what you keep THIS ROUND, and it accumulates.
    // So, current playerBalance already has `maxReturn` added. We need to subtract `returnAmountNum`.
    // The prompt says "Receiver can return any amount back to the sender."
    // "Player's balance increases by the distributed amount minus their initial donation." (Public Goods)
    // So, here, it should be: player's balance increases by (amount received - amount returned).
    // My useEffect added `maxReturn` to balance. So, `newBalance = currentBalance (which includes maxReturn) - returnAmountNum`. This is effectively `oldBalance + (maxReturn - returnAmountNum)`. Correct.
    
    const newBalance = playerBalance - returnAmountNum; // Since playerBalance was already incremented by receivedFromSender (maxReturn)
    setPlayerBalance(newBalance); 

    setRoundResult(`Sender invested points which became ${maxReturn} for you. You returned ${returnAmountNum}. You kept ${pointsKept} points. Your total accumulated balance: ${newBalance}.`);
    
    // console.log("Firebase: Saving Trust Game (Receiver) round data", { round: currentRound, received: maxReturn, returned: returnAmountNum, kept: pointsKept, newBalance });
    toast({
        title: `Round ${currentRound} Decision Made!`,
        description: `You kept ${pointsKept} points. Accumulated balance: ${newBalance}.`,
        icon: <CheckCircle2 className="h-5 w-5" />,
    });

    if (currentRound >= TOTAL_ROUNDS) {
      setIsGameFinished(true);
    }
  };

  const handleNextRound = () => {
    setCurrentRound(prev => prev + 1);
    setAmountToReturn('');
    setRoundResult(null);
    // receivedFromSender and maxReturn will be updated by useEffect for the new round
  };
  
  const additionalInfo = (
    <div className="mt-4 p-3 bg-accent/10 rounded-lg flex items-center gap-2">
      <Gift className="h-6 w-6 text-accent" />
      <p className="font-body text-md text-accent-foreground/80">
        This round, the Sender's investment (tripled) gives you: <strong className="font-headline text-accent">{receivedFromSender} points</strong>.
      </p>
    </div>
  );

  if (isGameFinished) {
    return (
      <GameLayout title={gameTitle} rules={gameRules} playerBalance={playerBalance}>
        <Card className="shadow-lg animate-fadeInUp">
          <CardHeader>
             <h2 className="font-headline text-3xl text-center mb-2">신뢰 게임 (수신자)</h2>
            <CardTitle className="font-headline text-3xl flex items-center gap-2 text-primary">
               <ThumbsUp className="h-8 w-8" /> Game Over!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-body text-lg">You have completed all {TOTAL_ROUNDS} rounds as the Receiver.</p>
            <p className="font-body text-lg">Your final accumulated balance is: <strong className="font-headline text-2xl text-accent">{playerBalance} points</strong>.</p>
             <p className="font-body text-md text-foreground/80">Consider how your decisions to return points might have affected the (simulated) Sender's trust and willingness to invest in the future.</p>
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
    <GameLayout title={gameTitle} rules={gameRules} currentRound={currentRound} totalRounds={TOTAL_ROUNDS} playerBalance={playerBalance} additionalInfo={additionalInfo}>
      <Card className="shadow-lg animate-fadeIn">
        <CardHeader>
           {currentRound === 1 && !roundResult && <h2 className="font-headline text-3xl text-center mb-4 text-primary">신뢰 게임 (수신자) 시작하기</h2>}
          <CardTitle className="font-headline text-2xl text-primary">
            {roundResult ? `Round ${currentRound} Results` : `Round ${currentRound}: Your Decision`}
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
                <Label htmlFor="returnAmountInput" className="font-body text-lg block mb-2">
                  Amount to return to Sender (0 to {maxReturn}):
                </Label>
                <Input
                  id="returnAmountInput"
                  type="number"
                  value={amountToReturn}
                  onChange={(e) => setAmountToReturn(e.target.value)}
                  placeholder={`Enter amount (max ${maxReturn})`}
                  min="0"
                  max={maxReturn}
                  className="font-body text-lg p-3"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">You received {maxReturn} points. How much will you send back?</p>
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3">
                Submit Return Amount <Send className="ml-2 h-5 w-5" />
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
