import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface PlayingCard {
  suit: string;
  value: string;
  numValue: number;
}

interface BlackjackProps {
  onClose: () => void;
  balance: number;
  onBalanceChange: (newBalance: number) => void;
}

const suits = ['♠', '♥', '♦', '♣'];
const values = [
  { display: 'A', value: 11 },
  { display: '2', value: 2 },
  { display: '3', value: 3 },
  { display: '4', value: 4 },
  { display: '5', value: 5 },
  { display: '6', value: 6 },
  { display: '7', value: 7 },
  { display: '8', value: 8 },
  { display: '9', value: 9 },
  { display: '10', value: 10 },
  { display: 'J', value: 10 },
  { display: 'Q', value: 10 },
  { display: 'K', value: 10 },
];

export default function Blackjack({ onClose, balance, onBalanceChange }: BlackjackProps) {
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
  const [dealerHand, setDealerHand] = useState<PlayingCard[]>([]);
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealer' | 'ended'>('betting');
  const [message, setMessage] = useState('Сделайте ставку');
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [showDealerCard, setShowDealerCard] = useState(false);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const createDeck = (): PlayingCard[] => {
    const newDeck: PlayingCard[] = [];
    for (const suit of suits) {
      for (const val of values) {
        newDeck.push({
          suit,
          value: val.display,
          numValue: val.value,
        });
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deckToShuffle: PlayingCard[]): PlayingCard[] => {
    const shuffled = [...deckToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const calculateScore = (hand: PlayingCard[]): number => {
    let score = 0;
    let aces = 0;

    for (const card of hand) {
      score += card.numValue;
      if (card.value === 'A') aces++;
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }

    return score;
  };

  const dealCard = (currentDeck: PlayingCard[]): { card: PlayingCard; remainingDeck: PlayingCard[] } => {
    const card = currentDeck[0];
    const remainingDeck = currentDeck.slice(1);
    return { card, remainingDeck };
  };

  const startGame = () => {
    if (balance < bet) {
      setMessage('❌ Недостаточно средств!');
      return;
    }

    onBalanceChange(balance - bet);
    const newDeck = createDeck();
    
    const { card: playerCard1, remainingDeck: deck1 } = dealCard(newDeck);
    const { card: dealerCard1, remainingDeck: deck2 } = dealCard(deck1);
    const { card: playerCard2, remainingDeck: deck3 } = dealCard(deck2);
    const { card: dealerCard2, remainingDeck: deck4 } = dealCard(deck3);

    const newPlayerHand = [playerCard1, playerCard2];
    const newDealerHand = [dealerCard1, dealerCard2];

    setDeck(deck4);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setPlayerScore(calculateScore(newPlayerHand));
    setDealerScore(calculateScore([dealerCard1]));
    setShowDealerCard(false);
    setGameState('playing');
    setMessage('Ваш ход');

    if (calculateScore(newPlayerHand) === 21) {
      endGame(newPlayerHand, newDealerHand, deck4);
    }
  };

  const hit = () => {
    if (gameState !== 'playing') return;

    const { card, remainingDeck } = dealCard(deck);
    const newHand = [...playerHand, card];
    const newScore = calculateScore(newHand);

    setDeck(remainingDeck);
    setPlayerHand(newHand);
    setPlayerScore(newScore);

    if (newScore > 21) {
      setMessage('💥 Перебор! Вы проиграли');
      setShowDealerCard(true);
      setGameState('ended');
      setLosses(prev => prev + 1);
    }
  };

  const stand = () => {
    if (gameState !== 'playing') return;
    setGameState('dealer');
    setShowDealerCard(true);
    dealerPlay();
  };

  const dealerPlay = () => {
    let currentDeck = [...deck];
    let currentDealerHand = [...dealerHand];
    let currentDealerScore = calculateScore(currentDealerHand);

    setDealerScore(currentDealerScore);

    const dealerInterval = setInterval(() => {
      if (currentDealerScore < 17) {
        const { card, remainingDeck } = dealCard(currentDeck);
        currentDeck = remainingDeck;
        currentDealerHand = [...currentDealerHand, card];
        currentDealerScore = calculateScore(currentDealerHand);
        
        setDeck(currentDeck);
        setDealerHand(currentDealerHand);
        setDealerScore(currentDealerScore);
      } else {
        clearInterval(dealerInterval);
        endGame(playerHand, currentDealerHand, currentDeck);
      }
    }, 800);
  };

  const endGame = (finalPlayerHand: PlayingCard[], finalDealerHand: PlayingCard[], finalDeck: PlayingCard[]) => {
    const finalPlayerScore = calculateScore(finalPlayerHand);
    const finalDealerScore = calculateScore(finalDealerHand);

    setPlayerScore(finalPlayerScore);
    setDealerScore(finalDealerScore);
    setShowDealerCard(true);
    setGameState('ended');

    if (finalPlayerScore > 21) {
      setMessage('💥 Перебор! Вы проиграли');
      setLosses(prev => prev + 1);
    } else if (finalDealerScore > 21) {
      setMessage('🎉 Дилер перебрал! Вы выиграли!');
      onBalanceChange(balance + bet * 2);
      setWins(prev => prev + 1);
    } else if (finalPlayerScore > finalDealerScore) {
      setMessage('🎉 Вы выиграли!');
      onBalanceChange(balance + bet * 2);
      setWins(prev => prev + 1);
    } else if (finalPlayerScore < finalDealerScore) {
      setMessage('😔 Дилер выиграл');
      setLosses(prev => prev + 1);
    } else {
      setMessage('🤝 Ничья! Ставка возвращена');
      onBalanceChange(balance + bet);
    }
  };

  const newRound = () => {
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setGameState('betting');
    setMessage('Сделайте ставку');
    setShowDealerCard(false);
  };

  const renderCard = (card: PlayingCard, hidden = false) => {
    const isRed = card.suit === '♥' || card.suit === '♦';
    
    if (hidden) {
      return (
        <div className="w-20 h-28 bg-gradient-to-br from-secondary to-purple-dark rounded-lg border-2 border-primary/50 flex items-center justify-center text-4xl">
          🎴
        </div>
      );
    }

    return (
      <div className={`w-20 h-28 bg-white rounded-lg border-2 border-border shadow-lg flex flex-col items-center justify-between p-2 ${isRed ? 'text-red-600' : 'text-gray-900'}`}>
        <div className="text-xl font-bold">{card.value}</div>
        <div className="text-3xl">{card.suit}</div>
        <div className="text-xl font-bold">{card.value}</div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-5xl card-glow my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl gold-glow text-primary flex items-center gap-2">
                <span className="text-4xl">🃏</span>
                Блэкджек
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Наберите 21 или больше дилера</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Баланс</div>
              <div className="text-xl font-bold text-primary">{balance.toLocaleString()}₽</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Ставка</div>
              <div className="text-xl font-bold text-secondary">{bet}₽</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Побед</div>
              <div className="text-xl font-bold text-green-500">{wins}</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Поражений</div>
              <div className="text-xl font-bold text-red-500">{losses}</div>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl p-8 min-h-[500px] border-4 border-primary/30">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-accent">Дилер: {showDealerCard ? dealerScore : '?'}</Badge>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {dealerHand.map((card, index) => (
                    <div key={index} className="animate-scale-in">
                      {renderCard(card, !showDealerCard && index === 1)}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Badge className={`text-lg px-6 py-3 ${
                  gameState === 'ended' ? 'bg-accent animate-pulse-glow' : 'bg-muted'
                }`}>
                  {message}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary">Вы: {playerScore}</Badge>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  {playerHand.map((card, index) => (
                    <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      {renderCard(card)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {gameState === 'betting' && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setBet(Math.max(50, bet - 50))}
                >
                  <Icon name="Minus" size={20} />
                </Button>
                
                <div className="text-3xl font-bold text-primary min-w-[150px] text-center">
                  {bet}₽
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={() => setBet(Math.min(5000, bet + 50))}
                >
                  <Icon name="Plus" size={20} />
                </Button>
              </div>

              <div className="flex gap-2 justify-center flex-wrap">
                {[50, 100, 250, 500, 1000, 2500].map((amount) => (
                  <Button
                    key={amount}
                    variant={bet === amount ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setBet(amount)}
                    className={bet === amount ? 'gold-gradient' : ''}
                  >
                    {amount}₽
                  </Button>
                ))}
              </div>

              <Button
                size="lg"
                onClick={startGame}
                disabled={balance < bet}
                className="w-full gold-gradient font-bold text-xl hover:scale-105 transition-transform"
              >
                <Icon name="Play" size={24} className="mr-2" />
                РАЗДАТЬ КАРТЫ
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={hit}
                className="flex-1 gold-gradient font-bold text-lg"
              >
                <Icon name="Plus" size={20} className="mr-2" />
                ЕЩЁ КАРТУ
              </Button>
              <Button
                size="lg"
                onClick={stand}
                variant="outline"
                className="flex-1 font-bold text-lg"
              >
                <Icon name="Hand" size={20} className="mr-2" />
                ХВАТИТ
              </Button>
            </div>
          )}

          {(gameState === 'ended' || gameState === 'dealer') && (
            <Button
              size="lg"
              onClick={newRound}
              className="w-full gold-gradient font-bold text-xl hover:scale-105 transition-transform"
            >
              <Icon name="RotateCw" size={24} className="mr-2" />
              НОВАЯ ИГРА
            </Button>
          )}

          <div className="border-t border-border pt-4">
            <h4 className="font-bold mb-3 text-center">Правила игры</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <Icon name="Target" size={16} className="text-primary mt-0.5" />
                <span>Цель: набрать 21 очко или больше дилера</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="PlayCircle" size={16} className="text-primary mt-0.5" />
                <span>Туз = 11 или 1, J/Q/K = 10</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="XCircle" size={16} className="text-primary mt-0.5" />
                <span>Больше 21 = перебор и проигрыш</span>
              </div>
              <div className="flex items-start gap-2">
                <Icon name="Award" size={16} className="text-primary mt-0.5" />
                <span>Дилер берёт до 17 очков обязательно</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
