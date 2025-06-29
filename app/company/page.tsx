'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Building, 
  Target, 
  Shield, 
  Award,
  Users,
  Globe,
  Sparkles,
  Star,
  Heart,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompanyPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
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
          <div className={`flex items-center mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white mb-4 text-glow">McDonald's Investa</h1>
              <div className="absolute -top-2 -right-8">
                <Building className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-yellow-300 text-xl font-medium animate-shimmer">
              "C'est tout ce que j'aime"
            </p>
          </div>

          {/* Company Logo */}
          <Card className={`glass shadow-2xl mb-8 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <CardContent className="p-8 text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 via-yellow-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-6xl shadow-2xl animate-pulse-glow mb-4">
                M
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">McDonald's Investa</h2>
              <p className="text-gray-600">Plateforme d'investissement innovante</p>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <Heart className="w-6 h-6 animate-pulse" />
                <span>À Propos de l'Entreprise</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                McDonald's Investa est une plateforme d'investissement révolutionnaire qui combine la confiance 
                de la marque McDonald's avec des opportunités d'investissement innovantes. Notre mission est de 
                démocratiser l'accès aux investissements et de permettre à chacun de faire fructifier son capital.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Avec notre slogan "C'est tout ce que j'aime", nous nous engageons à offrir une expérience 
                d'investissement aussi satisfaisante qu'un repas chez McDonald's : simple, accessible et 
                toujours de qualité.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Notre plateforme propose des plans d'investissement diversifiés, un système de parrainage 
                généreux et des micro-tâches rémunérées pour maximiser vos revenus.
              </p>
            </CardContent>
          </Card>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center space-x-2">
                  <Target className="w-6 h-6 animate-pulse" />
                  <span>Notre Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Rendre l'investissement accessible à tous en proposant des solutions simples, 
                  transparentes et rentables. Nous croyons que chacun mérite l'opportunité de 
                  faire croître son patrimoine financier.
                </p>
              </CardContent>
            </Card>

            <Card className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center space-x-2">
                  <Globe className="w-6 h-6 animate-spin" />
                  <span>Notre Vision</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Devenir la plateforme d'investissement de référence à Madagascar et en Afrique, 
                  en combinant innovation technologique et valeurs humaines pour créer un écosystème 
                  financier inclusif.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '1s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <Star className="w-6 h-6 animate-bounce" />
                <span>Nos Valeurs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-600 animate-pulse" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sécurité</h3>
                  <p className="text-sm text-gray-600">
                    Protection maximale de vos investissements et données personnelles
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-yellow-600 animate-bounce" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                  <p className="text-sm text-gray-600">
                    Technologies de pointe pour une expérience utilisateur optimale
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-600 animate-float" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Communauté</h3>
                  <p className="text-sm text-gray-600">
                    Création d'une communauté d'investisseurs solidaires et prospères
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '1.2s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center space-x-2">
                <Award className="w-6 h-6 animate-pulse" />
                <span>Nos Réalisations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600 mb-2 animate-pulse-glow">1000+</div>
                  <p className="text-sm text-gray-600">Investisseurs Actifs</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600 mb-2 animate-pulse-glow">50M+</div>
                  <p className="text-sm text-gray-600">Ariary Investis</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2 animate-pulse-glow">99.9%</div>
                  <p className="text-sm text-gray-600">Disponibilité</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2 animate-pulse-glow">24/7</div>
                  <p className="text-sm text-gray-600">Support Client</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className={`glass shadow-2xl ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '1.4s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 text-center">Contactez-nous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-gray-700">
                  Pour toute question ou assistance, notre équipe est à votre disposition.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700 btn-animated">
                    WhatsApp: +261 34 XX XXX XX
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 btn-animated">
                    Email: support@mcdonald-s-investa.com
                  </Button>
                </div>
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