'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Banknote, ArrowRightLeft, CreditCard, ArrowLeft, TrendingUp, Wallet, Coins, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment' | 'exchange' | 'points';
  status: 'success' | 'pending' | 'failed';
  amount: number;
  currency: 'Ar' | 'USDT';
  reference: string;
  date: string;
  time: string;
}

export default function DashboardOverview() {
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [isLoaded, setIsLoaded] = useState(false);
  const [balanceData, setBalanceData] = useState({
    mainBalance: 58000,
    pointsBalance: 150,
    investmentAmount: 250000
  });
  const router = useRouter();

  const [transactions] = useState<Transaction[]>([
    {
      id: '789553',
      type: 'withdraw',
      status: 'pending',
      amount: 10000,
      currency: 'Ar',
      reference: '789553',
      date: '25 juin 2025',
      time: '10:00'
    },
    {
      id: '789963',
      type: 'deposit',
      status: 'success',
      amount: 50000,
      currency: 'Ar',
      reference: '789963',
      date: '25 juin 2025',
      time: '10:17'
    },
    {
      id: '189963',
      type: 'investment',
      status: 'success',
      amount: 100000,
      currency: 'Ar',
      reference: '189963',
      date: '24 juin 2025',
      time: '15:30'
    }
  ]);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertAmount = (amount: number) => {
    if (currency === 'USDT') {
      return (amount / 5000).toFixed(2);
    }
    return amount.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Succès';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const getTransactionMessage = (transaction: Transaction) => {
    const amount = `${convertAmount(transaction.amount)} ${currency}`;
    const ref = transaction.reference;
    const dateTime = `${transaction.time}, ${transaction.date}`;

    switch (transaction.type) {
      case 'withdraw':
        return `Votre demande de retrait de ${amount} est ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
      case 'deposit':
        return `Dépôt de ${amount} ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
      case 'investment':
        return `Investissement de ${amount} réussi sur BURGER 1 ref: ${ref} à ${dateTime}`;
      default:
        return `Transaction ${amount} ${getStatusText(transaction.status)} ref: ${ref} à ${dateTime}`;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-2 h-2 text-yellow-300 opacity-70" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-md mx-auto">
          {/* Header avec animation */}
          <div className={`flex items-center mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold text-white mb-4 text-glow">DASHBOARD</h1>
            
            {/* Currency Toggle avec animation */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <span className={`font-semibold transition-all duration-300 ${currency === 'Ar' ? 'text-white text-lg' : 'text-white/60'}`}>
                Ar
              </span>
              <div className="relative">
                <Switch
                  checked={currency === 'USDT'}
                  onCheckedChange={(checked) => setCurrency(checked ? 'USDT' : 'Ar')}
                  className="data-[state=checked]:bg-yellow-400 hover-glow"
                />
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className={`font-semibold transition-all duration-300 ${currency === 'USDT' ? 'text-white text-lg' : 'text-white/60'}`}>
                USDT
              </span>
            </div>
            <p className="text-white/80 text-sm animate-shimmer">5 000 Ar = 1 USDT</p>
          </div>

          {/* Balance Cards avec animations */}
          <div className="space-y-6 mb-8">
            {/* Main Balance */}
            <Card className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Wallet className="w-5 h-5 text-red-600 animate-float" />
                      <p className="text-red-600 font-semibold text-sm">SOLDE PRINCIPAL</p>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 animate-pulse-glow">
                      {convertAmount(balanceData.mainBalance)} {currency}
                    </p>
                  </div>
                  <Link href="/withdraw">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 btn-animated hover-glow">
                      <Banknote className="w-4 h-4 mr-1" />
                      RETRAIT
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Points Balance */}
            <Card className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Coins className="w-5 h-5 text-red-600 animate-bounce" />
                      <p className="text-red-600 font-semibold text-sm">SOLDE POINTS</p>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 text-gradient">
                      {balanceData.pointsBalance} points
                    </p>
                  </div>
                  <Link href="/points/exchange">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 btn-animated hover-glow">
                      <ArrowRightLeft className="w-4 h-4 mr-1" />
                      ÉCHANGER
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Investment Amount */}
            <Card className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-red-600 animate-pulse" />
                      <p className="text-red-600 font-semibold text-sm">INVESTISSEMENTS</p>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 animate-shimmer">
                      {convertAmount(balanceData.investmentAmount)} {currency}
                    </p>
                  </div>
                  <Link href="/invest">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700 btn-animated hover-glow">
                      <CreditCard className="w-4 h-4 mr-1" />
                      INVESTIR
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Status avec animation */}
          <Card className={`glass shadow-2xl ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 text-lg flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span>Statut des Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className={`flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover-lift animate-slide-in-left`}
                    style={{animationDelay: `${1 + index * 0.1}s`}}
                  >
                    <Badge className={`${getStatusColor(transaction.status)} text-xs border animate-pulse`}>
                      {getStatusText(transaction.status)}
                    </Badge>
                    <p className="text-sm text-gray-700 flex-1">
                      {getTransactionMessage(transaction)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}