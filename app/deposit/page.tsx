'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Copy, Upload, ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  {
    type: 'mvola',
    number: '034 36 953 81',
    agent: 'Andry',
    label: 'MVola'
  },
  {
    type: 'airtel',
    number: '033 68 556 36',
    agent: 'Andry',
    label: 'Airtel Money'
  },
  {
    type: 'orange',
    number: '032 XX XXX XX',
    agent: 'Andry',
    label: 'Orange Money'
  },
  {
    type: 'usdt',
    address: 'TLuPRrRJGWhBAenUwHY7LbR2pxwW8rAhtn',
    label: 'USDT TRC20'
  }
];

export default function DepositPage() {
  const [currency, setCurrency] = useState<'Ar' | 'USDT'>('Ar');
  const [formData, setFormData] = useState({
    amount: '',
    reference: '',
    proof: null as File | null
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    }
  }, [router]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copié !`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({...formData, proof: file});
      toast.success('Capture d\'écran ajoutée');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.amount || !formData.reference || !formData.proof) {
      toast.error('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    // Simulation de la soumission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Demande de dépôt de ${formData.amount} ${currency} en attente de validation`);
    
    // Reset form
    setFormData({ amount: '', reference: '', proof: null });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-600/20">
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

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 mb-2">DÉPÔT</h1>
          <p className="text-white/80 text-sm">5 000 Ar = 1 USDT</p>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Transférer l'argent à nos agents financiers
          </h2>
          
          <div className="space-y-3">
            {PAYMENT_METHODS.map((method) => (
              <Card key={method.type} className="bg-white/10 backdrop-blur-sm border-emerald-500/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-emerald-400 font-semibold">
                        {method.label}
                      </p>
                      <p className="text-white text-lg font-mono">
                        {method.type === 'usdt' ? method.address : method.number}
                      </p>
                      {method.type !== 'usdt' && (
                        <p className="text-gray-300 text-sm">Agent: {method.agent}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(
                        method.type === 'usdt' ? method.address! : method.number,
                        method.label
                      )}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <Card className="bg-white/10 backdrop-blur-sm border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-emerald-400">Confirmer le dépôt</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-white">Montant à transférer</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder={currency === 'Ar' ? "10 000" : "2"}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="bg-white/10 border-emerald-500/30 text-white placeholder:text-gray-400 pr-16"
                    required
                  />
                  <span className="absolute right-3 top-3 text-emerald-400 font-semibold">
                    {currency}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-white">Capture d'écran de paiement</Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-white/10 border-emerald-500/30 text-white file:bg-emerald-600 file:text-white file:border-0 file:rounded"
                    required
                  />
                  <Camera className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                {formData.proof && (
                  <p className="text-emerald-400 text-sm mt-1">
                    ✓ {formData.proof.name}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-white">Référence de la facture</Label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Coller la référence ID"
                    value={formData.reference}
                    onChange={(e) => setFormData({...formData, reference: e.target.value})}
                    className="bg-white/10 border-emerald-500/30 text-white placeholder:text-gray-400"
                    required
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.readText().then(text => {
                        setFormData({...formData, reference: text});
                        toast.success('Référence collée');
                      });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Coller
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Traitement...' : 'DÉPOSER'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => setFormData({ amount: '', reference: '', proof: null })}
                >
                  ANNULER
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Bottom padding */}
        <div className="pb-24"></div>
      </div>
    </div>
  );
}