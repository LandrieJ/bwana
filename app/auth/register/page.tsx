'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Phone, ArrowLeft, Download, Sparkles, UserPlus, Gift } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    countryCode: '+261',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsLoaded(true);
    const ref = searchParams.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const generateUserId = (phone: string) => {
    const lastSix = phone.slice(-6);
    return `USR_${lastSix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const userId = generateUserId(formData.phone);
    const referralLink = `${window.location.origin}/auth/register?ref=${userId}`;

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', formData.phone);
    localStorage.setItem('userId', userId);
    localStorage.setItem('referralCode', userId);
    localStorage.setItem('referralLink', referralLink);
    
    toast.success('Inscription réussie !');
    router.push('/dashboard');
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className={`glass shadow-2xl border-0 hover-lift ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <CardHeader className="text-center space-y-4">
              <Link href="/" className={`inline-flex items-center text-red-600 hover:text-red-700 mb-4 btn-animated ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>
              
              <div className="relative">
                <CardTitle className="text-3xl font-bold text-red-600 text-glow">
                  Créer un compte
                </CardTitle>
                <div className="absolute -top-2 -right-4">
                  <UserPlus className="w-6 h-6 text-yellow-400 animate-bounce" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
                  <Label htmlFor="phone" className="text-white font-medium">Numéro WhatsApp</Label>
                  <div className="flex space-x-2">
                    <Select value={formData.countryCode} onValueChange={(value) => setFormData({...formData, countryCode: value})}>
                      <SelectTrigger className="w-24 glass border-white/30 text-white hover-glow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark">
                        <SelectItem value="+261" className="text-white hover:bg-white/20">+261</SelectItem>
                        <SelectItem value="+33" className="text-white hover:bg-white/20">+33</SelectItem>
                        <SelectItem value="+44" className="text-white hover:bg-white/20">+44</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1 group">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="34 XX XXX XX"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="pl-10 glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-red-400"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
                  <Label htmlFor="password" className="text-white font-medium">Créer un mot de passe</Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimum 6 caractères"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pr-10 glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-red-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-300 hover-lift"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
                  <Label htmlFor="confirmPassword" className="text-white font-medium">Confirmer le mot de passe</Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répétez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="pr-10 glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-red-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-300 hover-lift"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
                  <Label htmlFor="referralCode" className="text-white font-medium flex items-center space-x-2">
                    <span>Code d'invitation (facultatif)</span>
                    <Gift className="w-4 h-4 text-yellow-400 animate-bounce" />
                  </Label>
                  <Input
                    id="referralCode"
                    type="text"
                    placeholder="USR_XXXXXX"
                    value={formData.referralCode}
                    onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                    className="glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-yellow-400"
                  />
                  <p className="text-xs text-white/70 animate-shimmer">
                    Remplissage facultatif si vous n'avez pas été parrainé
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-semibold btn-animated hover-glow shadow-lg ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: '0.5s'}}
                  disabled={isLoading || !formData.phone || !formData.password}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Création du compte<span className="loading-dots"></span></span>
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  className={`w-full border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-red-900 btn-animated hover-lift bg-transparent backdrop-blur-sm ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: '0.6s'}}
                >
                  <Download className="w-4 h-4 mr-2 animate-bounce" />
                  Télécharger l'application
                </Button>

                <div className={`text-center text-sm text-white/80 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.7s'}}>
                  Déjà un compte ?{' '}
                  <Link href="/auth/login" className="text-gray-300 hover:text-yellow-100 font-semibold hover-glow transition-colors duration-300">
                    Se connecter
                  </Link>
                </div>

                <div className={`glass p-3 rounded-lg text-xs text-white/80 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
                  <p className="font-semibold mb-1 flex items-center space-x-2">
                    <span>⚠️ Important :</span>
                    <Sparkles className="w-3 h-3 text-gray-400" />
                  </p>
                  <p>• Votre mot de passe est confidentiel</p>
                  <p>• Vous pouvez modifier vos informations plus tard</p>
                  <p>• Vérifiez le code d'invitation avant de valider</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}