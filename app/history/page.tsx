'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  History, 
  Banknote, 
  CreditCard, 
  ShoppingCart, 
  Coins,
  ArrowRightLeft,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'points_purchase' | 'points_exchange' | 'points_earned' | 'commission';
  amount: number;
  currency: 'Ar' | 'USDT' | 'points';
  status: 'success' | 'pending' | 'failed';
  reference: string;
  date: string;
  time: string;
  description: string;
  method?: string;
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'withdrawal',
    amount: 10000,
    currency: 'Ar',
    status: 'pending',
    reference: 'WTH_789553',
    date: '25 juin 2025',
    time: '10:00',
    description: 'Demande de retrait via MVola',
    method: 'MVola'
  },
  {
    id: '2',
    type: 'deposit',
    amount: 50000,
    currency: 'Ar',
    status: 'success',
    reference: 'DEP_789963',
    date: '25 juin 2025',
    time: '10:17',
    description: 'Dépôt via Airtel Money',
    method: 'Airtel Money'
  },
  {
    id: '3',
    type: 'investment',
    amount: 100000,
    currency: 'Ar',
    status: 'success',
    reference: 'INV_189963',
    date: '24 juin 2025',
    time: '15:30',
    description: 'Investissement BURGER 2',
    method: 'BURGER 2'
  },
  {
    id: '4',
    type: 'points_purchase',
    amount: 50,
    currency: 'points',
    status: 'success',
    reference: 'PTS_456789',
    date: '24 juin 2025',
    time: '14:20',
    description: 'Achat de 50 points',
    method: 'Solde principal'
  },
  {
    id: '5',
    type: 'points_exchange',
    amount: 30,
    currency: 'points',
    status: 'success',
    reference: 'EXC_123456',
    date: '23 juin 2025',
    time: '16:45',
    description: 'Échange 30 points contre 3000 Ar',
    method: 'Conversion'
  },
  {
    id: '6',
    type: 'commission',
    amount: 1500,
    currency: 'Ar',
    status: 'success',
    reference: 'COM_987654',
    date: '23 juin 2025',
    time: '09:00',
    description: 'Commission de parrainage niveau 1',
    method: 'Parrainage'
  }
];

const TRANSACTION_TYPES = [
  { id: 'all', label: 'Toutes', icon: History },
  { id: 'withdrawal', label: 'Retraits', icon: Banknote },
  { id: 'deposit', label: 'Dépôts', icon: CreditCard },
  { id: 'investment', label: 'Investissements', icon: ShoppingCart },
  { id: 'points_purchase', label: 'Achat Points', icon: Coins },
  { id: 'points_exchange', label: 'Échange Points', icon: ArrowRightLeft },
  { id: 'commission', label: 'Commissions', icon: TrendingUp }
];

export default function HistoryPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [activeTab, setActiveTab] = useState('all');
  const [transactions] = useState(SAMPLE_TRANSACTIONS);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertAmount = (amount: number, fromCurrency: string) => {
    if (fromCurrency === 'points') return `${amount} points`;
    if (currency === 'USDT' && fromCurrency === 'Ar') {
      return `${(amount / 5000).toFixed(2)} USDT`;
    }
    if (currency === 'Ar' && fromCurrency === 'USDT') {
      return `${(amount * 5000).toLocaleString()} Ar`;
    }
    return fromCurrency === 'Ar' ? `${amount.toLocaleString()} Ar` : `${amount} ${fromCurrency}`;
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

  const getTypeIcon = (type: string) => {
    const typeConfig = TRANSACTION_TYPES.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : History;
  };

  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === activeTab);

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
            <Sparkles className="w-2 h-2 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            
            {/* Currency Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${currency === 'Ar' ? 'text-white' : 'text-white/60'}`}>
                Ar
              </span>
              <Switch
                checked={currency === 'USDT'}
                onCheckedChange={(checked) => setCurrency(checked ? 'USDT' : 'Ar')}
                className="data-[state=checked]:bg-yellow-400"
              />
              <span className={`text-sm ${currency === 'USDT' ? 'text-white' : 'text-white/60'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white mb-4 text-glow">HISTORIQUE</h1>
              <div className="absolute -top-2 -right-8">
                <History className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-lg animate-shimmer">Historique des Transactions</p>
          </div>

          {/* Filters */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-600">Filtres</span>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 btn-animated">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {TRANSACTION_TYPES.map((type, index) => {
                  const Icon = type.icon;
                  return (
                    <Button
                      key={type.id}
                      variant={activeTab === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab(type.id)}
                      className={`btn-animated ${
                        activeTab === type.id 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-300 text-red-600 hover:bg-red-50'
                      }`}
                      style={{animationDelay: `${0.1 * index}s`}}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {type.label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4 mb-8">
            {filteredTransactions.map((transaction, index) => {
              const Icon = getTypeIcon(transaction.type);
              return (
                <Card 
                  key={transaction.id} 
                  className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: `${0.4 + index * 0.1}s`}}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-red-600 animate-pulse" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                            <Badge className={`${getStatusColor(transaction.status)} text-xs animate-pulse`}>
                              {getStatusText(transaction.status)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">
                            Référence: {transaction.reference}
                          </p>
                          
                          {transaction.method && (
                            <p className="text-sm text-gray-600 mb-1">
                              Méthode: {transaction.method}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{transaction.date}</span>
                            </div>
                            <span>{transaction.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.type === 'withdrawal' ? '-' : '+'}
                          {convertAmount(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <Card className={`glass shadow-2xl ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardContent className="p-12 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucune transaction</h3>
                <p className="text-gray-500">Aucune transaction trouvée pour cette catégorie.</p>
              </CardContent>
            </Card>
          )}

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}