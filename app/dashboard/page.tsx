'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  CreditCard, 
  Banknote, 
  ShoppingCart, 
  User,
  HelpCircle,
  History,
  Building,
  Target,
  ShoppingBag,
  ArrowRightLeft,
  TrendingUp,
  LogOut,
  Users,
  Sparkles,
  Zap
} from 'lucide-react';
import Link from 'next/link';

const DASHBOARD_ITEMS = [
  { id: 'faq', icon: HelpCircle, label: 'FAQ', href: '/faq', type: 'square', color: 'from-blue-500 to-blue-600' },
  { id: 'history', icon: History, label: 'Historique de transaction', href: '/history', type: 'square', color: 'from-purple-500 to-purple-600' },
  { id: 'company', icon: Building, label: 'Profil entreprise', href: '/company', type: 'square', color: 'from-indigo-500 to-indigo-600' },
  { id: 'microtasks', icon: Target, label: 'Micro-tâches', href: '/microtasks', type: 'square', color: 'from-pink-500 to-pink-600' },
  { id: 'buypoints', icon: ShoppingBag, label: 'Acheter des points', href: '/points/buy', type: 'square', color: 'from-orange-500 to-orange-600' },
  { id: 'exchange', icon: ArrowRightLeft, label: 'Échanger des points', href: '/points/exchange', type: 'square', color: 'from-teal-500 to-teal-600' },
  { id: 'earnings', icon: TrendingUp, label: 'Historique des gains', href: '/earnings', type: 'square', color: 'from-green-500 to-green-600' },
  { id: 'logout', icon: LogOut, label: 'Déconnexion', href: '/', type: 'square', color: 'from-red-500 to-red-600' },
  { id: 'team', icon: Users, label: 'Équipe et Groupe', href: '/team', type: 'square', color: 'from-cyan-500 to-cyan-600' },
];

const BOTTOM_TABS = [
  { id: 'dashboard', icon: Home, label: 'Tableau de bord', href: '/dashboard/overview' },
  { id: 'deposit', icon: CreditCard, label: 'Dépôt', href: '/deposit' },
  { id: 'withdraw', icon: Banknote, label: 'Retrait', href: '/withdraw' },
  { id: 'invest', icon: ShoppingCart, label: 'Achat', href: '/invest' },
  { id: 'profile', icon: User, label: 'Mon', href: '/profile' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setIsLoggedIn(true);
      setTimeout(() => setIsLoaded(true), 100);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userId');
    router.push('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-emerald-900 flex items-center justify-center">
        <div className="text-white animate-pulse-glow">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          Chargement<span className="loading-dots"></span>
        </div>
      </div>
    );
  }

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
            <Sparkles className="w-3 h-3 text-emerald-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header avec animation */}
        <div className={`text-center mb-8 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}>
          <div className="relative inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 text-glow">
              McDonald's Investa
            </h1>
            <div className="absolute -top-2 -right-8">
              <Zap className="w-6 h-6 text-yellow-400 animate-bounce" />
            </div>
          </div>
          <p className="text-emerald-400 text-lg animate-shimmer">Espace Membre</p>
        </div>

        {/* 9 Boutons carrés en grille 3x3 avec animations */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {DASHBOARD_ITEMS.map((item, index) => (
            <Card 
              key={item.id} 
              className={`glass border-emerald-500/20 hover-lift card-3d ${
                isLoaded ? 'animate-bounce-in' : 'opacity-0'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <CardContent className="p-4 text-center">
                <Link href={item.href} onClick={item.id === 'logout' ? handleLogout : undefined}>
                  <div className="space-y-3 group">
                    {/* Étiquette ronde avec dégradé et animation */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto shadow-lg hover-glow group-hover:animate-rotate-3d transition-all duration-300`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    {/* Label avec effet de brillance */}
                    <p className="text-white text-xs font-medium leading-tight group-hover:text-emerald-300 transition-colors duration-300">
                      {item.label}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 5 Boutons icônes en bas avec effets glassmorphism */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="glass-dark border-t border-emerald-500/20 backdrop-blur-xl">
            <div className="flex justify-around items-center py-3">
              {BOTTOM_TABS.map((tab, index) => (
                <Link key={tab.id} href={tab.href}>
                  <Button
                    variant="ghost"
                    className={`flex flex-col items-center space-y-1 text-emerald-400 hover:text-white hover:bg-emerald-600/20 px-3 py-2 btn-animated ${
                      isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                    }`}
                    style={{animationDelay: `${0.8 + index * 0.1}s`}}
                  >
                    <tab.icon className="w-6 h-6 animate-float" style={{animationDelay: `${index * 0.2}s`}} />
                    <span className="text-xs">{tab.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Padding pour éviter que le contenu soit masqué par la barre du bas */}
        <div className="pb-20"></div>
      </div>
    </div>
  );
}