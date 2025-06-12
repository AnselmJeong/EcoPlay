import GameCard from '@/components/GameCard';
import { Users, Handshake, Brain } from 'lucide-react'; // Users for Public Goods, Handshake for Trust, Brain for Trustee strategy

export default function HomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-headline font-bold text-primary mb-4 animate-fadeIn">Welcome to EcoPlay!</h2>
        <p className="text-xl font-body text-foreground/80 max-w-2xl mx-auto animate-fadeInUp">
          Explore fascinating economic scenarios, make strategic decisions, and learn about cooperation and trust.
          Choose a game below to start your adventure!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        <GameCard
          title="Public Goods Game"
          description="Contribute to a common pool and see how collective efforts multiply rewards. Balance personal gain with group success!"
          link="/public-goods"
          Icon={Users}
        />
        <GameCard
          title="Trust Game (Receiver)"
          description="Someone has trusted you with an investment. Decide how much to return and build (or break) trust."
          link="/trust-game/receiver"
          Icon={Handshake}
          ctaText="Start as Receiver"
        />
        <GameCard
          title="Trust Game (Trustee)"
          description="Invest in others, but be wary! Each opponent has a different strategy. Can you maximize your returns?"
          link="/trust-game/trustee"
          Icon={Brain}
          ctaText="Start as Trustee"
        />
      </div>
    </div>
  );
}
