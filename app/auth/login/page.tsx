'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Phone, ArrowLeft, Sparkles, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Validation du numéro de téléphone (exemple pour +261)
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+\d{1,3}\d{6,12}$/;
    return phoneRegex.test(phone.replace(/\s/g, '')); // Supprime les espaces pour la validation
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des champs
    if (!formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs.');
      setIsLoading(false);
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Veuillez entrer un numéro WhatsApp valide (ex. +261 34 123 4567).');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Remplacer par une vraie requête API pour l'authentification
      // Exemple: const response = await fetch('/api/login', { method: 'POST', body: JSON.stringify(formData) });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulation de la connexion

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userPhone', formData.phone);

      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient" />

      {/* Particules flottantes (limité à 10 pour optimiser les performances) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
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
              <Link
                href="/"
                className={`inline-flex items-center text-red-600 hover:text-red-700 mb-4 btn-animated ${
                  isLoaded ? 'animate-slide-in-left' : 'opacity-0'
                }`}
                aria-label="Retour à la page d'accueil"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Link>

              <div className="relative">
                <CardTitle className="text-3xl font-bold text-red-600 text-glow">
                  Se connecter
                </CardTitle>
                <div className="absolute -top-2 -right-4">
                  <Lock className="w-6 h-6 text-yellow-400 animate-bounce" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}
                  style={{ animationDelay: '0.2s' }}
                >
                  <Label htmlFor="phone" className="text-white font-medium">
                    Numéro WhatsApp
                  </Label>
                  <div className="relative group">
                    <Phone
                      className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300"
                      aria-hidden="true"
                    />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+261 34 123 4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10 glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-red-400"
                      required
                      aria-describedby="phone-error"
                    />
                  </div>
                </div>

                <div
                  className={`space-y-2 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}
                  style={{ animationDelay: '0.4s' }}
                >
                  <Label htmlFor="password" className="text-white font-medium">
                    Mot de passe
                  </Label>
                  <div className="relative group">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pr-10 glass border-white/30 text-white placeholder:text-gray-300 hover-glow focus:ring-2 focus:ring-red-400"
                      required
                      aria-describedby="password-error"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-300 hover-lift"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-6 text-lg font-semibold btn-animated hover-glow shadow-lg ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.6s' }}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      <span>
                        Connexion<span className="loading-dots" />
                      </span>
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </Button>

                <div
                  className={`text-center text-sm text-white/80 ${
                    isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                  }`}
                  style={{ animationDelay: '0.8s' }}
                >
                  Pas encore de compte ?{' '}
                  <Link
                    href="/auth/register"
                    className="text-yellow-300 hover:text-yellow-100 font-semibold hover-glow transition-colors duration-300"
                  >
                    S'inscrire
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}