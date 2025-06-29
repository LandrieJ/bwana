'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ArrowRightLeft, Coins, Calculator, Info, Sparkles, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ExchangePointsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [currentBalance] = useState(58000); // Balance en Ar
  const [pointsBalance] = useState(150);
  const [isInvestor] = useState(true); // Simuler si l'utilisateur est investisseur
  const [formData, setFormData] = useState({
    points: '',
    amount: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const convertBalance = () => {
    if (currency === 'USDT') {
      return (currentBalance / 5000).toFixed(2);
    }
    return currentBalance.toLocaleString();
  };

  const getExchangeRate = () => {
    // 1 point = 100 Ar pour investisseurs, 10 Ar pour non-investisseurs
    return isInvestor ? 100 : 10;
  };

  const calculateAmount = (points: string) => {
    if (!points) return '';
    const numPoints = parseFloat(points);
    const rateAr = getExchangeRate();
    
    if (currency === 'Ar') {
      return (numPoints * rateAr).toString();
    } else {
      return (numPoints * rateAr / 5000).toFixed(2);
    }
  };

  const calculatePoints = (amount: string) => {
    if (!amount) return '';
    const numAmount = parseFloat(amount);
    const rateAr = getExchangeRate();
    
    if (currency === 'Ar') {
      return Math.floor(numAmount / rateAr).toString();
    } else {
      return Math.floor(numAmount * 5000 / rateAr).toString();
    }
  };

  const handlePointsChange = (value: string) => {
    setFormData({
      points: value,
      amount: calculateAmount(value)
    });
  };

  const handleAmountChange = (value: string) => {
    setFormData({
      amount: value,
      points: calculatePoints(value)
    });
  };

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const points = parseFloat(formData.points);

    if (points > pointsBalance) {
      toast.error('Points insuffisants');
      setIsLoading(false);
      return;
    }

    if (points <= 0) {
      toast.error('Nombre de points invalide');
      setIsLoading(false);
      return;
    }

    // Simulation de l'échange
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success(`Échange de ${formData.points} points contre ${formData.amount} ${currency} effectué - Réf: ${reference}`);
    
    // Reset form
    setFormData({ points: '', amount: '' });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-900 animate-gradient"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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
        <div className="max-w-md mx-auto">
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
              <h1 className="text-3xl font-bold text-emerald-400 mb-2 text-glow">ÉCHANGER DES POINTS</h1>
              <div className="absolute -top-2 -right-8">
                <ArrowRightLeft className="w-6 h-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-sm">
              1 point = {getExchangeRate()} Ar {isInvestor ? '(Investisseur)' : '(Non-investisseur)'}
            </p>
          </div>

          {/* Balance Cards */}
          <div className={`grid grid-cols-2 gap-4 mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Coins className="w-6 h-6 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <p className="text-emerald-400 text-sm">Mes Points</p>
                <p className="text-xl font-bold text-white">{pointsBalance}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Calculator className="w-6 h-6 text-blue-400 mx-auto mb-2 animate-float" />
                <p className="text-emerald-400 text-sm">Solde</p>
                <p className="text-xl font-bold text-white">{convertBalance()} {currency}</p>
              </CardContent>
            </Card>
          </div>

          {/* Exchange Form */}
          <Card className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <CardHeader>
              <CardTitle className="text-emerald-400">Échange de Points</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExchange} className="space-y-6">
                <div>
                  <Label className="text-white">Nombre de points à échanger</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.points}
                      onChange={(e) => handlePointsChange(e.target.value)}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400 pr-20"
                      max={pointsBalance}
                      required
                    />
                    <span className="absolute right-3 top-3 text-yellow-400 font-semibold">
                      points
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum: {pointsBalance} points disponibles
                  </p>
                </div>

                <div>
                  <Label className="text-white">Montant à recevoir</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={currency === 'Ar' ? "5000" : "1.00"}
                      value={formData.amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400 pr-16"
                      required
                    />
                    <span className="absolute right-3 top-3 text-emerald-400 font-semibold">
                      {currency}
                    </span>
                  </div>
                </div>

                {/* Conversion Display */}
                {formData.points && formData.amount && (
                  <div className="bg-emerald-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-sm font-semibold">Calcul automatique</span>
                    </div>
                    <p className="text-white text-sm">
                      {formData.points} points = {formData.amount} {currency}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Taux: 1 point = {getExchangeRate()} Ar {isInvestor ? '(Investisseur)' : '(Non-investisseur)'}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 btn-animated"
                    disabled={isLoading || !formData.points || !formData.amount}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Échange en cours...</span>
                      </div>
                    ) : (
                      <>
                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                        Échanger
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => setFormData({ points: '', amount: '' })}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className={`glass-dark border-emerald-500/20 mt-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center space-x-2">
                <Info className="w-5 h-5" />
                <span>Statut Utilisateur</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">
                    {isInvestor ? 'Investisseur Actif' : 'Non-Investisseur'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Taux d'échange: 1 point = {getExchangeRate()} Ar
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isInvestor 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {isInvestor ? 'PREMIUM' : 'STANDARD'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className={`mt-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
            <Link href="/microtasks">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 btn-animated">
                <Target className="w-4 h-4 mr-2 animate-bounce" />
                Commander des Missions
              </Button>
            </Link>
          </div>

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}