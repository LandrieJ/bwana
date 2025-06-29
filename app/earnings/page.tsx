'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Coins, 
  Calendar,
  Filter,
  Download,
  Sparkles,
  DollarSign,
  Target,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Earning {
  id: string;
  type: 'referral' | 'team' | 'daily' | 'points';
  amount: number;
  currency: 'Ar' | 'points';
  level?: number;
  date: string;
  time: string;
  description: string;
  source?: string;
}

const SAMPLE_EARNINGS: Earning[] = [
  {
    id: '1',
    type: 'daily',
    amount: 3000,
    currency: 'Ar',
    date: '25 juin 2025',
    time: '09:00',
    description: 'Revenu journalier BURGER 2',
    source: 'Plan BURGER 2'
  },
  {
    id: '2',
    type: 'referral',
    amount: 1500,
    currency: 'Ar',
    level: 1,
    date: '25 juin 2025',
    time: '10:30',
    description: 'Commission parrainage niveau 1',
    source: 'User123'
  },
  {
    id: '3',
    type: 'team',
    amount: 800,
    currency: 'Ar',
    level: 1,
    date: '25 juin 2025',
    time: '09:00',
    description: 'Commission équipe niveau 1',
    source: 'Équipe niveau 1'
  },
  {
    id: '4',
    type: 'points',
    amount: 25,
    currency: 'points',
    date: '24 juin 2025',
    time: '16:45',
    description: 'Points gagnés - Missions accomplies',
    source: 'Micro-tâches'
  },
  {
    id: '5',
    type: 'team',
    amount: 400,
    currency: 'Ar',
    level: 2,
    date: '24 juin 2025',
    time: '09:00',
    description: 'Commission équipe niveau 2',
    source: 'Équipe niveau 2'
  }
];

const EARNING_TYPES = [
  { id: 'all', label: 'Tous', icon: TrendingUp },
  { id: 'referral', label: 'Parrainage', icon: Users },
  { id: 'team', label: 'Équipe', icon: Users },
  { id: 'daily', label: 'Journalier', icon: DollarSign },
  { id: 'points', label: 'Points', icon: Coins }
];

const FILTER_PERIODS = [
  { id: '3', label: '3 derniers jours' },
  { id: '7', label: '7 derniers jours' },
  { id: '30', label: '30 derniers jours' },
  { id: 'all', label: 'Tout afficher' }
];

export default function EarningsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [activeType, setActiveType] = useState('all');
  const [activePeriod, setActivePeriod] = useState('7');
  const [earnings] = useState(SAMPLE_EARNINGS);
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
    return `${amount.toLocaleString()} Ar`;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = EARNING_TYPES.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : TrendingUp;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'referral': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'team': return 'bg-green-100 text-green-800 border-green-200';
      case 'daily': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'points': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string, level?: number) => {
    switch (type) {
      case 'referral': return `Parrainage L${level}`;
      case 'team': return `Équipe L${level}`;
      case 'daily': return 'Journalier';
      case 'points': return 'Points';
      default: return type;
    }
  };

  const filteredEarnings = earnings.filter(earning => {
    if (activeType !== 'all' && earning.type !== activeType) return false;
    // Ici on pourrait ajouter la logique de filtrage par période
    return true;
  });

  const totalEarnings = filteredEarnings.reduce((total, earning) => {
    if (earning.currency === 'Ar') {
      return total + earning.amount;
    }
    return total;
  }, 0);

  const totalPoints = filteredEarnings.reduce((total, earning) => {
    if (earning.currency === 'points') {
      return total + earning.amount;
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-900 animate-gradient"></div>
      
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
            <Sparkles className="w-2 h-2 text-emerald-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-600/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            
            {/* Currency Toggle */}
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${currency === 'Ar' ? 'text-emerald-400' : 'text-gray-400'}`}>
                Ar
              </span>
              <Switch
                checked={currency === 'USDT'}
                onCheckedChange={(checked) => setCurrency(checked ? 'USDT' : 'Ar')}
                className="data-[state=checked]:bg-emerald-500"
              />
              <span className={`text-sm ${currency === 'USDT' ? 'text-emerald-400' : 'text-gray-400'}`}>
                USDT
              </span>
            </div>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-400 mb-4 text-glow">HISTORIQUE DES GAINS</h1>
              <div className="absolute -top-2 -right-8">
                <TrendingUp className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-lg animate-shimmer">Suivi de vos revenus</p>
          </div>

          {/* Summary Cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2 animate-pulse" />
                <p className="text-emerald-400 text-sm">Total Gains</p>
                <p className="text-2xl font-bold text-white">{convertAmount(totalEarnings, 'Ar')}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <p className="text-emerald-400 text-sm">Points Gagnés</p>
                <p className="text-2xl font-bold text-white">{totalPoints} points</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-float" />
                <p className="text-emerald-400 text-sm">Transactions</p>
                <p className="text-2xl font-bold text-white">{filteredEarnings.length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className={`glass-dark border-emerald-500/20 mb-6 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">Filtres</span>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 btn-animated">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
              
              {/* Type Filters */}
              <div className="mb-4">
                <p className="text-white text-sm mb-2">Type de gains:</p>
                <div className="flex flex-wrap gap-2">
                  {EARNING_TYPES.map((type, index) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={activeType === type.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveType(type.id)}
                        className={`btn-animated ${
                          activeType === type.id 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                        }`}
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Period Filters */}
              <div>
                <p className="text-white text-sm mb-2">Période:</p>
                <div className="flex flex-wrap gap-2">
                  {FILTER_PERIODS.map((period, index) => (
                    <Button
                      key={period.id}
                      variant={activePeriod === period.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivePeriod(period.id)}
                      className={`btn-animated ${
                        activePeriod === period.id 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                      }`}
                      style={{animationDelay: `${0.1 * index}s`}}
                    >
                      {period.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings List */}
          <div className="space-y-4 mb-8">
            {filteredEarnings.map((earning, index) => {
              const Icon = getTypeIcon(earning.type);
              return (
                <Card 
                  key={earning.id} 
                  className={`glass-dark border-emerald-500/20 hover-lift ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-emerald-600 animate-pulse" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-white">{earning.description}</h3>
                            <Badge className={`${getTypeColor(earning.type)} text-xs animate-pulse`}>
                              {getTypeLabel(earning.type, earning.level)}
                            </Badge>
                          </div>
                          
                          {earning.source && (
                            <p className="text-sm text-gray-400 mb-1">
                              Source: {earning.source}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{earning.date}</span>
                            </div>
                            <span>{earning.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          +{convertAmount(earning.amount, earning.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredEarnings.length === 0 && (
            <Card className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardContent className="p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun gain</h3>
                <p className="text-gray-500">Aucun gain trouvé pour cette période et ce type.</p>
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