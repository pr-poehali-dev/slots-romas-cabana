import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  fee: number;
  minAmount: number;
  maxAmount: number;
  popular?: boolean;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Банковская карта', icon: '💳', fee: 0, minAmount: 100, maxAmount: 500000, popular: true },
  { id: 'sbp', name: 'СБП', icon: '🏦', fee: 0, minAmount: 100, maxAmount: 1000000, popular: true },
  { id: 'yoomoney', name: 'ЮMoney', icon: '💰', fee: 2, minAmount: 50, maxAmount: 100000 },
  { id: 'qiwi', name: 'QIWI', icon: '🥝', fee: 2.5, minAmount: 100, maxAmount: 250000 },
  { id: 'webmoney', name: 'WebMoney', icon: '💼', fee: 3, minAmount: 100, maxAmount: 500000 },
  { id: 'crypto', name: 'Криптовалюта', icon: '₿', fee: 1, minAmount: 500, maxAmount: 5000000 },
  { id: 'mobile', name: 'Мобильный платеж', icon: '📱', fee: 5, minAmount: 100, maxAmount: 15000 },
  { id: 'terminal', name: 'Терминал', icon: '🏧', fee: 1.5, minAmount: 100, maxAmount: 100000 },
];

const quickAmounts = [500, 1000, 2500, 5000, 10000, 25000];

interface DepositModalProps {
  onClose: () => void;
  balance: number;
  onDeposit: (amount: number) => void;
}

export default function DepositModal({ onClose, balance, onDeposit }: DepositModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0]);
  const [amount, setAmount] = useState<string>('1000');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const numAmount = parseInt(amount) || 0;
  const fee = Math.ceil((numAmount * selectedMethod.fee) / 100);
  const totalAmount = numAmount + fee;
  const isValidAmount = numAmount >= selectedMethod.minAmount && numAmount <= selectedMethod.maxAmount;

  const handleDeposit = () => {
    if (!isValidAmount || processing) return;

    setProcessing(true);
    
    setTimeout(() => {
      onDeposit(numAmount);
      setProcessing(false);
      setSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-md card-glow animate-scale-in">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="text-8xl mb-6 animate-float">✅</div>
            <h2 className="text-3xl font-black text-primary gold-glow mb-3">
              Успешно!
            </h2>
            <p className="text-xl text-muted-foreground mb-2">
              Баланс пополнен на
            </p>
            <div className="text-5xl font-black text-primary mb-6">
              +{numAmount.toLocaleString()}₽
            </div>
            <Badge className="bg-accent animate-pulse-glow text-lg px-6 py-2">
              Новый баланс: {balance.toLocaleString()}₽
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <Card className="w-full max-w-4xl card-glow my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl gold-glow text-primary flex items-center gap-2">
                <span className="text-4xl">💰</span>
                Пополнение баланса
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Текущий баланс: <span className="text-primary font-bold">{balance.toLocaleString()}₽</span>
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-4">Выберите способ оплаты</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    selectedMethod.id === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  {method.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-accent text-xs">
                      Популярно
                    </Badge>
                  )}
                  <div className="text-4xl mb-2">{method.icon}</div>
                  <div className="text-sm font-semibold mb-1">{method.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {method.fee === 0 ? 'Без комиссии' : `Комиссия ${method.fee}%`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-semibold">Условия</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Минимум: {selectedMethod.minAmount.toLocaleString()}₽ • 
              Максимум: {selectedMethod.maxAmount.toLocaleString()}₽ • 
              Комиссия: {selectedMethod.fee}%
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Сумма пополнения</h3>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant={amount === String(quickAmount) ? 'default' : 'outline'}
                  onClick={() => setAmount(String(quickAmount))}
                  className={amount === String(quickAmount) ? 'gold-gradient' : ''}
                >
                  {quickAmount.toLocaleString()}₽
                </Button>
              ))}
            </div>

            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="text-2xl h-16 pr-12 text-center font-bold"
                min={selectedMethod.minAmount}
                max={selectedMethod.maxAmount}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                ₽
              </span>
            </div>

            {!isValidAmount && numAmount > 0 && (
              <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                Сумма должна быть от {selectedMethod.minAmount.toLocaleString()}₽ до {selectedMethod.maxAmount.toLocaleString()}₽
              </p>
            )}
          </div>

          <div className="bg-gradient-to-br from-card via-purple-dark to-card border-2 border-primary/30 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Детали платежа</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Сумма пополнения:</span>
                <span className="font-bold">{numAmount.toLocaleString()}₽</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Комиссия ({selectedMethod.fee}%):</span>
                <span className="font-bold">{fee.toLocaleString()}₽</span>
              </div>
              <div className="border-t border-border pt-3"></div>
              <div className="flex justify-between text-2xl">
                <span className="font-bold">Итого к оплате:</span>
                <span className="font-black text-primary gold-glow">{totalAmount.toLocaleString()}₽</span>
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                На баланс будет зачислено: {numAmount.toLocaleString()}₽
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={processing}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={!isValidAmount || processing}
              className="flex-1 gold-gradient font-bold text-lg hover:scale-105 transition-transform"
            >
              {processing ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="CreditCard" size={20} className="mr-2" />
                  Пополнить {numAmount.toLocaleString()}₽
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-2">
              💡 Совет: используйте СБП или банковскую карту для пополнения без комиссии
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Icon name="Lock" size={12} />
              <span>Безопасная оплата • SSL шифрование • PCI DSS сертификация</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
