'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Banknote, 
  History,
  TrendingUp,
  Target,
  Settings,
  Building,
  Shield,
  UserCog,
  ArrowRightLeft,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(true);

  const adminMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin/dashboard' },
    { id: 'users', icon: Users, label: 'Utilisateurs', href: '/admin/users' },
    { id: 'deposits', icon: CreditCard, label: 'Dépôts', href: '/admin/deposits' },
    { id: 'withdrawals', icon: Banknote, label: 'Retraits', href: '/admin/withdrawals' },
    { id: 'exchanges', icon: ArrowRightLeft, label: 'Échanges points', href: '/admin/exchanges' },
    { id: 'transactions', icon: History, label: 'Transactions', href: '/admin/transactions' },
    { id: 'plans', icon: TrendingUp, label: 'Plans d\'investissement', href: '/admin/plans' },
    { id: 'commissions', icon: TrendingUp, label: 'Gains/Commissions', href: '/admin/commissions' },
    { id: 'microtasks', icon: Target, label: 'Micro-tâches', href: '/admin/microtasks' },
    { id: 'referrals', icon: Users, label: 'Parrainage/Affiliés', href: '/admin/referrals' },
    { id: 'settings', icon: Settings, label: 'Réglages système', href: '/admin/settings' },
    { id: 'content', icon: Building, label: 'Pages et contenus', href: '/admin/content' },
    { id: 'security', icon: Shield, label: 'Sécurité', href: '/admin/security' },
    { id: 'admins', icon: UserCog, label: 'Gestion multi-admin', href: '/admin/admins' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Panel Admin</h1>
              <span className="text-blue-400">McDonald's Investa</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">Admin Dashboard</span>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-white/80 text-sm">Utilisateurs totaux</h3>
                <p className="text-3xl font-bold text-white">1,247</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-white/80 text-sm">Investissements actifs</h3>
                <p className="text-3xl font-bold text-green-400">856</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-white/80 text-sm">En attente validation</h3>
                <p className="text-3xl font-bold text-yellow-400">23</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-white/80 text-sm">Volume total</h3>
                <p className="text-3xl font-bold text-blue-400">2.4M Ar</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {adminMenuItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium leading-tight">
                      {item.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm">Nouveau dépôt en attente - 50,000 Ar</span>
                <span className="text-yellow-400 text-xs">Il y a 5 min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm">Retrait validé - 25,000 Ar</span>
                <span className="text-green-400 text-xs">Il y a 12 min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                <span className="text-white text-sm">Nouvel investissement BURGER 2</span>
                <span className="text-blue-400 text-xs">Il y a 1 heure</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}