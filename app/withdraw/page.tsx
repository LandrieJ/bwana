'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [currentBalance] = useState(58000); // Balance en Ar
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    method: '',
    recipient: '',
    withdrawPassword: ''
  });
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    }
  }, [router]);

  const convertBalance = () => {
    if (currency === 'USDT') {
      return (currentBalance / 5000).toFixed(2);
    }
    return currentBalance.toLocaleString();
  };

  const convertAmount = (amount: number) => {
    if (currency === 'USDT') {
      return (amount / 5000).toFixed(2);
    }
    return amount.toLocaleString();
  };

  const validateAmount = () => {
    const amount = parseFloat(formData.amount);
    const minWithdraw = currency === 'USDT' ? 1 : 4800;
    const maxWithdraw = currency === 'USDT' ? currentBalance / 5000 : currentBalance;

    if (!amount) {
      toast.error('Veuillez entrer un montant');
      return false;
    }

    if (amount < minWithdraw) {
      toast.error(`Montant minimum: ${minWithdraw} ${currency}`);
      return false;
    }

    if (amount > maxWithdraw) {
      toast.error('Solde insuffisant');
      return false;
    }

    // Calculer le montant après frais (10%)
    const afterFees = amount * 0.9;
    setCalculatedAmount(afterFees);
    setStep(2);
    return true;
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.withdrawPassword) {
      toast.error('Mot de passe de retrait requis');
      setIsLoading(false);
      return;
    }

    // Simulation du retrait
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reference = Math.random().toString(36).substr(2, 6).toUpperCase();
    toast.success(`Demande de retrait de ${convertAmount(calculatedAmount)} ${currency} en attente de validation - Réf: ${reference}`);
    
    // Reset form
    setFormData({ amount: '', method: '', recipient: '', withdrawPassword: '' });
    setStep(1);
    setCalculatedAmount(0);
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

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">RETRAIT</h1>
          <div className="bg-white/20 rounded-lg p-3">
            <p className="text-white/80 text-sm">Solde actuel</p>
            <p className="text-2xl font-bold text-white">
              {convertBalance()} {currency}
            </p>
          </div>
        </div>

        {step === 1 && (
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Demande de retrait</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Montant à retirer</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={currency === 'Ar' ? "4800" : "1"}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="pr-16"
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500 font-semibold">
                    {currency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: {currency === 'USDT' ? '1 USDT' : '4 800 Ar'} | 
                  Conversion: 1 USDT = 4 800 Ar
                </p>
              </div>

              <div>
                <Label>Moyen de retrait</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({...formData, method: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une méthode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mvola">MVola</SelectItem>
                    <SelectItem value="airtel">Airtel Money</SelectItem>
                    <SelectItem value="orange">Orange Money</SelectItem>
                    <SelectItem value="usdt">USDT TRC20</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.method && formData.method !== 'usdt' && (
                <div>
                  <Label>Numéro de téléphone</Label>
                  <Input
                    type="tel"
                    placeholder="034 XX XXX XX"
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    required
                  />
                </div>
              )}

              {formData.method === 'usdt' && (
                <div>
                  <Label>Adresse USDT TRC20</Label>
                  <Input
                    type="text"
                    placeholder="Coller votre adresse portefeuille"
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                    required
                  />
                </div>
              )}

              <Button 
                onClick={validateAmount}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!formData.amount || !formData.method || !formData.recipient}
              >
                Valider le montant
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="text-red-600">Confirmation de retrait</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Montant après frais */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Montant après frais (10%)</p>
                <p className="text-2xl font-bold text-red-600">
                  {convertAmount(calculatedAmount)} {currency}
                </p>
                <p className="text-xs text-gray-500">
                  Montant initial: {formData.amount} {currency}
                </p>
              </div>

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div>
                  <Label>Mot de passe de retrait</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrer votre mot de passe de retrait"
                      value={formData.withdrawPassword}
                      onChange={(e) => setFormData({...formData, withdrawPassword: e.target.value})}
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Traitement...' : 'CONFIRMER RETRAIT'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-300"
                    onClick={() => setStep(1)}
                  >
                    ANNULER
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Bottom padding */}
        <div className="pb-24"></div>
      </div>
    </div>
  );
}