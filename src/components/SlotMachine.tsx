import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '⭐', '🔔'];
const winMultipliers: Record<string, number> = {
  '🍒': 2,
  '🍋': 3,
  '🍊': 4,
  '🍇': 5,
  '💎': 10,
  '7️⃣': 20,
  '⭐': 50,
  '🔔': 100,
};

interface SlotMachineProps {
  slotName: string;
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

export default function SlotMachine({ slotName, onClose, balance, onBalanceChange }: SlotMachineProps) {
  const [reels, setReels] = useState<string[]>(['🍒', '🍋', '🍊']);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [message, setMessage] = useState('');
  const [spinCount, setSpinCount] = useState(0);

  const getRandomSymbol = () => symbols[Math.floor(Math.random() * symbols.length)];

  const spin = () => {
    if (spinning || balance < bet) {
      setMessage(balance < bet ? '❌ Недостаточно средств!' : '⏳ Подождите...');
      return;
    }

    setSpinning(true);
    setMessage('');
    setLastWin(0);
    onBalanceChange(balance - bet);

    let spinDuration = 0;
    const interval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      spinDuration += 50;

      if (spinDuration >= 2000) {
        clearInterval(interval);
        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setReels(finalReels);
        setSpinning(false);
        checkWin(finalReels);
        setSpinCount(prev => prev + 1);
      }
    }, 50);
  };

  const checkWin = (finalReels: string[]) => {
    const [r1, r2, r3] = finalReels;
    
    if (r1 === r2 && r2 === r3) {
      const multiplier = winMultipliers[r1] || 2;
      const winAmount = bet * multiplier;
      setLastWin(winAmount);
      setTotalWins(prev => prev + winAmount);
      onBalanceChange(balance + winAmount);
      setMessage(`🎉 ДЖЕКПОТ! Выигрыш x${multiplier}!`);
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      const winAmount = Math.floor(bet * 0.5);
      setLastWin(winAmount);
      setTotalWins(prev => prev + winAmount);
      onBalanceChange(balance + winAmount);
      setMessage(`✨ Две в ряд! Выигрыш!`);
    } else {
      setMessage('😔 Не повезло, попробуйте еще!');
    }
  };

  const changeBet = (amount: number) => {
    const newBet = Math.max(25, Math.min(1000, bet + amount));
    setBet(newBet);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-2xl card-glow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl gold-glow text-primary">{slotName}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Собери три одинаковых символа!</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Баланс</div>
              <div className="text-xl font-bold text-primary">{balance.toLocaleString()}₽</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Ставка</div>
              <div className="text-xl font-bold text-secondary">{bet}₽</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Выиграно</div>
              <div className="text-xl font-bold text-accent">{totalWins.toLocaleString()}₽</div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-card via-purple-dark to-card border-4 border-primary/50 rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }}></div>
            
            <div className="relative grid grid-cols-3 gap-4 mb-6">
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className={`bg-background/80 backdrop-blur-sm rounded-xl h-32 flex items-center justify-center text-7xl border-2 border-primary/30 
                    ${spinning ? 'animate-pulse-glow' : 'animate-float'}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {symbol}
                </div>
              ))}
            </div>

            {message && (
              <Badge 
                className={`w-full justify-center py-3 text-base ${
                  lastWin > 0 ? 'bg-accent animate-pulse-glow' : 'bg-muted'
                }`}
              >
                {message}
              </Badge>
            )}
          </div>

          {lastWin > 0 && (
            <div className="text-center animate-scale-in">
              <div className="text-5xl font-black text-primary gold-glow">
                +{lastWin.toLocaleString()}₽
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => changeBet(-25)}
                disabled={spinning || bet <= 25}
              >
                <Icon name="Minus" size={20} />
              </Button>
              
              <Button
                size="lg"
                onClick={spin}
                disabled={spinning || balance < bet}
                className="gold-gradient font-bold text-xl px-12 hover:scale-105 transition-transform"
              >
                {spinning ? (
                  <>
                    <Icon name="Loader2" size={24} className="mr-2 animate-spin" />
                    Вращение...
                  </>
                ) : (
                  <>
                    <Icon name="Play" size={24} className="mr-2" />
                    КРУТИТЬ
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => changeBet(25)}
                disabled={spinning || bet >= 1000}
              >
                <Icon name="Plus" size={20} />
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              {[25, 50, 100, 250, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  variant={bet === amount ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBet(amount)}
                  disabled={spinning}
                  className={bet === amount ? 'gold-gradient' : ''}
                >
                  {amount}₽
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="font-bold mb-3 text-center">Таблица выплат</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              {Object.entries(winMultipliers).map(([symbol, multiplier]) => (
                <div key={symbol} className="bg-muted rounded-lg p-2">
                  <div className="text-2xl mb-1">{symbol}</div>
                  <div className="text-primary font-bold">x{multiplier}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Две одинаковых символа = 50% возврат ставки
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Сыграно раундов: {spinCount} | Играйте ответственно 18+
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
