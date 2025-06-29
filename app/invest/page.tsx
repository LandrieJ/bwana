'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number; // en Ar
  maxAmount: number; // en Ar
  minAdd: number; // en Ar
  dailyReturn: number; // pourcentage
  referralCommission: number;
  teamCommissions: { level1: number; level2: number; level3: number };
  userInvestment?: number;
}

const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: 'burger1',
    name: 'BURGER 1',
    minAmount: 10000,
    maxAmount: 400000,
    minAdd: 10000,
    dailyReturn: 3,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger2',
    name: 'BURGER 2',
    minAmount: 405000,
    maxAmount: 1200000,
    minAdd: 50000,
    dailyReturn: 3.5,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger3',
    name: 'BURGER 3',
    minAmount: 1205000,
    maxAmount: 2500000,
    minAdd: 100000,
    dailyReturn: 4,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  },
  {
    id: 'burger4',
    name: 'BURGER 4',
    minAmount: 2505000,
    maxAmount: 3750000,
    minAdd: 100000,
    dailyReturn: 4.5,
    referralCommission: 10,
    teamCommissions: { level1: 6, level2: 3, level3: 1 },
    userInvestment: 0
  }
];

export default function InvestPage() {
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [plans, setPlans] = useState(INVESTMENT_PLANS);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [investmentAmounts, setInvestmentAmounts] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    }
  }, [router]);

  const convertAmount = (amount: number) => {
    if (currency === 'USDT') {
      return (amount / 5000).toFixed(2);
    }
    return amount.toLocaleString();
  };

  const getButtonText = (plan: InvestmentPlan) => {
    const currentInvestment = plan.userInvestment || 0;
    if (currentInvestment >= plan.maxAmount) {
      return 'TERMINÉ';
    }
    if (currentInvestment > 0) {
      return 'AJOUTER';
    }
    return 'INVESTIR';
  };

  const getButtonDisabled = (plan: InvestmentPlan) => {
    return (plan.userInvestment || 0) >= plan.maxAmount;
  };

  const validateInvestment = (plan: InvestmentPlan, amount: string) => {
    const numAmount = parseFloat(amount);
    if (!numAmount) return false;

    const currentInvestment = plan.userInvestment || 0;
    const totalAfterInvestment = currentInvestment + numAmount;

    if (currentInvestment === 0 && numAmount < plan.minAmount) {
      toast.error(`Investissement minimum: ${convertAmount(plan.minAmount)} ${currency}`);
      return false;
    }

    if (currentInvestment > 0 && numAmount < plan.minAdd) {
      toast.error(`Ajout minimum: ${convertAmount(plan.minAdd)} ${currency}`);
      return false;
    }

    if (totalAfterInvestment > plan.maxAmount) {
      toast.error(`Investissement maximum: ${convertAmount(plan.maxAmount)} ${currency}`);
      return false;
    }

    return true;
  };

  const handleInvest = async (plan: InvestmentPlan) => {
    const amount = investmentAmounts[plan.id];
    if (!validateInvestment(plan, amount)) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const numAmount = parseFloat(amount);
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();

    // Mettre à jour l'investissement de l'utilisateur
    setPlans(prevPlans => 
      prevPlans.map(p => 
        p.id === plan.id 
          ? { ...p, userInvestment: (p.userInvestment || 0) + numAmount }
          : p
      )
    );

    // Réinitialiser le champ
    setInvestmentAmounts(prev => ({...prev, [plan.id]: ''}));

    toast.success(`Investissement de ${convertAmount(numAmount)} ${currency} réussi sur ${plan.name} - Réf: ${reference}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">INVESTISSEMENT</h1>
          <p className="text-white/80 text-sm">Choisissez votre plan BURGER</p>
        </div>

        {/* Investment Plans */}
        <div className="space-y-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                selectedPlan === plan.id ? 'ring-2 ring-yellow-400 shadow-xl' : ''
              }`}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? '' : plan.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-red-600">{plan.name}</span>
                  </CardTitle>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {plan.dailyReturn}% par jour
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Plan Details */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p><strong>Revenu journalier:</strong> {plan.dailyReturn}% par jour</p>
                  <p><strong>Commission parrainage:</strong> {plan.referralCommission}%</p>
                  <p><strong>Commission équipe:</strong> L1: {plan.teamCommissions.level1}% | L2: {plan.teamCommissions.level2}% | L3: {plan.teamCommissions.level3}%</p>
                  <p><strong>Dépôt min:</strong> {convertAmount(plan.minAmount)} {currency}</p>
                  <p><strong>Dépôt max:</strong> {convertAmount(plan.maxAmount)} {currency}</p>
                  <p><strong>Ajout min:</strong> {convertAmount(plan.minAdd)} {currency}</p>
                </div>

                {/* Current Investment */}
                {(plan.userInvestment || 0) > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Investissement actuel:</strong> {convertAmount(plan.userInvestment || 0)} {currency}
                    </p>
                  </div>
                )}

                {/* Investment Input */}
                <div className="space-y-3">
                  <Input
                    type="number"
                    placeholder="Saisir le montant"
                    value={investmentAmounts[plan.id] || ''}
                    onChange={(e) => setInvestmentAmounts(prev => ({
                      ...prev,
                      [plan.id]: e.target.value
                    }))}
                    className="text-center text-lg"
                    disabled={getButtonDisabled(plan)}
                  />
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleInvest(plan)}
                      className={`flex-1 ${
                        getButtonText(plan) === 'TERMINÉ' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      disabled={
                        isLoading || 
                        getButtonDisabled(plan) || 
                        !investmentAmounts[plan.id]
                      }
                    >
                      {getButtonText(plan)}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => setInvestmentAmounts(prev => ({
                        ...prev,
                        [plan.id]: ''
                      }))}
                    >
                      ANNULER
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom padding */}
        <div className="pb-24"></div>
      </div>
    </div>
  );
}