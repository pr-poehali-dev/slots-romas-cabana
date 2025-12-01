import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import SlotMachine from '@/components/SlotMachine';

const slots = [
  { id: 1, name: 'Золотой Джекпот', min: '100₽', max: '1,000,000₽', hot: true },
  { id: 2, name: 'Алмазная Удача', min: '50₽', max: '500,000₽', hot: false },
  { id: 3, name: 'Королевский Покер', min: '200₽', max: '2,000,000₽', hot: true },
  { id: 4, name: 'Фруктовый Рай', min: '25₽', max: '250,000₽', hot: false },
  { id: 5, name: 'Огненная Рулетка', min: '150₽', max: '1,500,000₽', hot: true },
  { id: 6, name: 'Мега Фортуна', min: '300₽', max: '3,000,000₽', hot: false },
];

const promos = [
  { id: 1, title: 'Приветственный бонус', amount: '100%', description: 'До 50,000₽ на первый депозит', code: 'WELCOME100' },
  { id: 2, title: 'Фриспины каждый день', amount: '50', description: 'Бесплатных вращений ежедневно', code: 'DAILY50' },
  { id: 3, title: 'Кэшбэк', amount: '20%', description: 'Возврат проигранных средств', code: 'CASHBACK20' },
];

const tournaments = [
  { id: 1, name: 'Турнир Чемпионов', prize: '5,000,000₽', players: '234/500', ends: '3д 12ч' },
  { id: 2, name: 'Еженедельная Битва', prize: '1,000,000₽', players: '567/1000', ends: '5д 8ч' },
  { id: 3, name: 'Блиц-раунд', prize: '500,000₽', players: '89/200', ends: '12ч 45м' },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState('slots');
  const [balance, setBalance] = useState(12500);
  const [bonus] = useState(5000);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎰</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-primary gold-glow">
                  Слоты от Ромы Кабана
                </h1>
                <p className="text-xs text-muted-foreground">Премиум казино с роскошными призами</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="text-sm text-muted-foreground">Баланс</div>
                <div className="text-lg font-bold text-primary">{balance.toLocaleString()}₽</div>
              </div>
              <Button className="gold-gradient font-bold">
                <Icon name="Plus" size={16} className="mr-1" />
                Пополнить
              </Button>
              <Button variant="outline">
                <Icon name="User" size={16} />
              </Button>
            </div>
          </div>
          
          <nav className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {['slots', 'tournaments', 'promos', 'profile'].map((section) => (
              <Button
                key={section}
                variant={activeSection === section ? 'default' : 'ghost'}
                onClick={() => setActiveSection(section)}
                className={activeSection === section ? 'gold-gradient' : ''}
              >
                <Icon 
                  name={section === 'slots' ? 'Gamepad2' : section === 'tournaments' ? 'Trophy' : section === 'promos' ? 'Gift' : 'UserCircle'} 
                  size={16} 
                  className="mr-2"
                />
                {section === 'slots' ? 'Игры' : section === 'tournaments' ? 'Турниры' : section === 'promos' ? 'Промо' : 'Профиль'}
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-card to-purple-dark p-8 md:p-12 card-glow">
          <div className="absolute top-0 right-0 text-9xl opacity-10 animate-float">💎</div>
          <div className="relative z-10">
            <Badge className="mb-4 bg-accent text-accent-foreground animate-pulse-glow">
              🔥 Горячее предложение
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black mb-4 gold-glow text-primary">
              Приветственный бонус
            </h2>
            <p className="text-xl md:text-2xl text-foreground/90 mb-6 font-light">
              +100% к первому депозиту + 50 фриспинов
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary/30">
                <div className="text-sm text-muted-foreground">Ваш бонус</div>
                <div className="text-2xl font-bold text-primary">{bonus.toLocaleString()}₽</div>
              </div>
              <div className="bg-background/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-primary/30">
                <div className="text-sm text-muted-foreground">Фриспины</div>
                <div className="text-2xl font-bold text-primary">50</div>
              </div>
            </div>
            <Button size="lg" className="gold-gradient text-lg font-bold px-8 hover:scale-105 transition-transform">
              Активировать бонус
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        </section>

        {activeSection === 'slots' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Популярные слоты</h2>
              <Button variant="outline">
                <Icon name="Filter" size={16} className="mr-2" />
                Фильтры
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slots.map((slot) => (
                <Card 
                  key={slot.id} 
                  className="overflow-hidden hover:scale-105 transition-all duration-300 card-glow cursor-pointer group"
                >
                  <div className="h-48 bg-gradient-to-br from-secondary via-secondary to-card relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-50 group-hover:scale-110 transition-transform">
                      🎰
                    </div>
                    {slot.hot && (
                      <Badge className="absolute top-3 right-3 bg-accent animate-pulse-glow">
                        🔥 HOT
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {slot.name}
                      <Icon name="Play" size={20} className="text-primary" />
                    </CardTitle>
                    <CardDescription>
                      <div className="flex justify-between mt-2">
                        <span>Мин: {slot.min}</span>
                        <span className="text-primary font-bold">Макс: {slot.max}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full gold-gradient font-bold"
                      onClick={() => setActiveSlot(slot.name)}
                    >
                      Играть сейчас
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'tournaments' && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Активные турниры</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tournaments.map((tournament) => (
                <Card key={tournament.id} className="card-glow hover:scale-102 transition-transform">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl mb-2">{tournament.name}</CardTitle>
                        <CardDescription className="text-base">
                          Призовой фонд: <span className="text-primary font-bold text-lg">{tournament.prize}</span>
                        </CardDescription>
                      </div>
                      <Icon name="Trophy" size={32} className="text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Участников</div>
                        <div className="font-bold">{tournament.players}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">До окончания</div>
                        <div className="font-bold text-accent">{tournament.ends}</div>
                      </div>
                    </div>
                    <Button className="w-full gold-gradient font-bold">
                      Участвовать
                      <Icon name="Zap" size={16} className="ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'promos' && (
          <section>
            <h2 className="text-3xl font-bold mb-6">Промоакции и бонусы</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promos.map((promo) => (
                <Card key={promo.id} className="card-glow hover:scale-105 transition-all">
                  <CardHeader>
                    <div className="text-5xl font-black text-primary gold-glow text-center mb-2">
                      {promo.amount}
                    </div>
                    <CardTitle className="text-center">{promo.title}</CardTitle>
                    <CardDescription className="text-center">{promo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-3 mb-4 text-center font-mono font-bold">
                      {promo.code}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать код
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'profile' && (
          <section>
            <div className="max-w-2xl mx-auto">
              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl">
                      👑
                    </div>
                    <div>
                      <CardTitle className="text-2xl">VIP Игрок</CardTitle>
                      <CardDescription>ID: #KB2024</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Баланс</div>
                      <div className="text-2xl font-bold text-primary">{balance.toLocaleString()}₽</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">Бонусы</div>
                      <div className="text-2xl font-bold text-secondary">{bonus.toLocaleString()}₽</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Icon name="Wallet" size={20} className="mr-3" />
                      История транзакций
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Icon name="Star" size={20} className="mr-3" />
                      Мои достижения
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Icon name="Settings" size={20} className="mr-3" />
                      Настройки
                    </Button>
                    <Button className="w-full justify-start gold-gradient">
                      <Icon name="LogOut" size={20} className="mr-3" />
                      Выход
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-3 text-primary">О казино</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О нас</li>
                <li>Лицензия</li>
                <li>Правила</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-primary">Игры</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Слоты</li>
                <li>Рулетка</li>
                <li>Покер</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-primary">Поддержка</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>FAQ</li>
                <li>Контакты</li>
                <li>Чат 24/7</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-primary">Соцсети</h3>
              <div className="flex gap-3">
                <Button size="icon" variant="outline">
                  <Icon name="MessageCircle" size={20} />
                </Button>
                <Button size="icon" variant="outline">
                  <Icon name="Send" size={20} />
                </Button>
                <Button size="icon" variant="outline">
                  <Icon name="Mail" size={20} />
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
            <p className="mb-2">🎰 Слоты от Ромы Кабана © 2024. Играйте ответственно 18+</p>
            <p className="text-xs">Лицензия: #RK-2024-PREMIUM</p>
          </div>
        </div>
      </footer>

      {activeSlot && (
        <SlotMachine
          slotName={activeSlot}
          onClose={() => setActiveSlot(null)}
          balance={balance}
          onBalanceChange={setBalance}
        />
      )}
    </div>
  );
}