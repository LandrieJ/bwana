'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Star,
  History,
  TrendingUp,
  DollarSign,
  ListChecks,
  UserPlus,
  Settings as SettingsIcon,
  FileEdit,
  Lock,
  UserCog,
  LogOut,
  Menu as MenuIcon
} from 'lucide-react';
import Dashboard from '../../components/admin/Dashboard';
import Users from '../../components/admin/Users';
import Deposits from '../../components/admin/Deposits';
import Withdrawals from '../../components/admin/Withdrawals';
import Points from '../../components/admin/Points';
import Transactions from '../../components/admin/Transactions';
import Plans from '../../components/admin/Plans';
import Commissions from '../../components/admin/Commissions';
import Microtasks from '../../components/admin/Microtasks';
import Referrals from '../../components/admin/Referrals';
import Settings from '../../components/admin/Settings';
import Content from '../../components/admin/Content';
import Security from '../../components/admin/Security';
import Admins from '../../components/admin/Admins';

export default function AdminPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isIconsOnly, setIsIconsOnly] = useState(false);
  const [isNavIconsOnly, setIsNavIconsOnly] = useState(false);

  useEffect(() => {
    console.log('Active section updated:', activeSection);
  }, [activeSection]);

  useEffect(() => {
    console.log('Nav icons-only updated:', isNavIconsOnly);
  }, [isNavIconsOnly]);

  const adminMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord', href: '#dashboard' },
    { id: 'users', icon: UsersIcon, label: 'Utilisateurs', href: '#users' },
    { id: 'deposits', icon: ArrowDownCircle, label: 'Dépôts', href: '#deposits' },
    { id: 'withdrawals', icon: ArrowUpCircle, label: 'Retraits', href: '#withdrawals' },
    { id: 'points', icon: Star, label: 'Points', href: '#points' },
    { id: 'transactions', icon: History, label: 'Transactions', href: '#transactions' },
    { id: 'plans', icon: TrendingUp, label: 'Plans d\'investissement', href: '#plans' },
    { id: 'commissions', icon: DollarSign, label: 'Gains/Commissions', href: '#commissions' },
    { id: 'microtasks', icon: ListChecks, label: 'Micro-tâches', href: '#microtasks' },
    { id: 'referrals', icon: UserPlus, label: 'Parrainage/Affiliés', href: '#referrals' },
    { id: 'settings', icon: SettingsIcon, label: 'Réglages système', href: '#settings' },
    { id: 'content', icon: FileEdit, label: 'Pages et contenus', href: '#content' },
    { id: 'security', icon: Lock, label: 'Sécurité', href: '#security' },
    { id: 'admins', icon: UserCog, label: 'Gestion multi-admin', href: '#admins' }
  ];

  // Mock data for all sections
  const users = [
    { id: '1', name: 'Jean Dupont', whatsapp: '+261 32 123 4567', referrer: 'Marie', balance: 50000, status: 'Actif' },
    { id: '2', name: 'Marie Dubois', whatsapp: '+261 33 987 6543', referrer: 'None', balance: 120000, status: 'Suspendu' },
  ];

  const deposits = [
    { id: 'd1', user: 'Jean Dupont', amount: 50000, currency: 'Ar', date: '25/06/2025', status: 'En attente', proof: 'proof1.jpg' },
    { id: 'd2', user: 'Marie Dubois', amount: 100000, currency: 'Ar', date: '24/06/2025', status: 'Validé', proof: 'proof2.jpg' },
  ];

  const withdrawals = [
    { id: 'w1', user: 'Jean Dupont', amount: 20000, method: 'Mobile Money', number: '+261 32 123 4567', status: 'En attente' },
    { id: 'w2', user: 'Marie Dubois', amount: 50000, method: 'USDT TRC20', number: 'TRX123456789', status: 'Validé' },
  ];

  const points = [
    { id: 'p1', user: 'Jean Dupont', amount: 150, date: '25/06/2025', status: 'Validé' },
    { id: 'p2', user: 'Marie Dubois', amount: 300, date: '24/06/2025', status: 'En attente' },
  ];

  const transactions = [
    { id: 't1', user: 'Jean Dupont', type: 'Dépôt', amount: 50000, date: '25/06/2025', status: 'Validé' },
    { id: 't2', user: 'Marie Dubois', type: 'Retrait', amount: 20000, date: '24/06/2025', status: 'En attente' },
  ];

  const plans = [
    { id: 'p1', name: 'Plan Burger', roi: '5%', duration: '30 jours', status: 'Actif' },
    { id: 'p2', name: 'Plan Big Mac', roi: '8%', duration: '60 jours', status: 'Inactif' },
  ];

  const commissions = [
    { id: 'c1', user: 'Jean Dupont', amount: 1000, type: 'Parrainage', date: '25/06/2025' },
    { id: 'c2', user: 'Marie Dubois', amount: 2000, type: 'Investissement', date: '24/06/2025' },
  ];

  const microtasks = [
    { id: 'm1', user: 'Jean Dupont', task: 'Survey', status: 'Complété', date: '25/06/2025' },
    { id: 'm2', user: 'Marie Dubois', task: 'Review', status: 'En attente', date: '24/06/2025' },
  ];

  const referrals = [
    { id: 'r1', user: 'Jean Dupont', referrer: 'Marie', commission: 500, status: 'Validé' },
    { id: 'r2', user: 'Marie Dubois', referrer: 'None', commission: 0, status: 'N/A' },
  ];

  const admins = [
    { id: 'a1', name: 'Admin 1', role: 'Super Admin', status: 'Actif' },
    { id: 'a2', name: 'Admin 2', role: 'Modérateur', status: 'Inactif' },
  ];

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} on user ${userId}`);
  };

  const handleDepositAction = (depositId: string, action: string) => {
    console.log(`Action ${action} on deposit ${depositId}`);
  };

  const handleWithdrawalAction = (withdrawalId: string, action: string) => {
    console.log(`Action ${action} on withdrawal ${withdrawalId}`);
  };

  const handlePointAction = (pointId: string, action: string) => {
    console.log(`Action ${action} on point ${pointId}`);
  };

  const handleAddBalance = (userId: string) => {
    console.log(`Adding balance for user ${userId}`);
  };

  const handleTransactionAction = (transactionId: string, action: string) => {
    console.log(`Action ${action} on transaction ${transactionId}`);
  };

  const handlePlanAction = (planId: string, action: string) => {
    console.log(`Action ${action} on plan ${planId}`);
  };

  const handleCommissionAction = (commissionId: string, action: string) => {
    console.log(`Action ${action} on commission ${commissionId}`);
  };

  const handleMicrotaskAction = (microtaskId: string, action: string) => {
    console.log(`Action ${action} on microtask ${microtaskId}`);
  };

  const handleReferralAction = (referralId: string, action: string) => {
    console.log(`Action ${action} on referral ${referralId}`);
  };

  const handleAdminAction = (adminId: string, action: string) => {
    console.log(`Action ${action} on admin ${adminId}`);
  };

  const handleSettingUpdate = (setting: string, value: boolean) => {
    console.log(`Updated setting ${setting} to ${value}`);
  };

  const handleContentAction = (contentId: string, action: string) => {
    console.log(`Action ${action} on content ${contentId}`);
  };

  const handleSecurityAction = (securityId: string, action: string) => {
    console.log(`Action ${action} on security ${securityId}`);
  };

  const toggleIconsOnly = () => {
    console.log('Toggling icons-only mode:', !isIconsOnly, 'Nav icons-only:', !isNavIconsOnly);
    setIsIconsOnly((prev) => !prev);
    setIsNavIconsOnly((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Sidebar (Desktop) */}
      <div className={`fixed inset-y-0 left-0 ${isIconsOnly ? 'w-16' : 'w-64'} bg-black/50 backdrop-blur-sm border-r border-white/10 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-all duration-300 md:static z-20`}>
        <div className="p-4">
          <div className="flex items-center justify-between hidden md:flex">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20 p-2 hidden md:block"
              onClick={toggleIconsOnly}
            >
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            {adminMenuItems.map((item) => (
              <div key={item.id}>
                <Button
                  variant="ghost"
                  className={`w-full ${isNavIconsOnly ? 'justify-center p-2 min-h-10' : 'justify-start'} text-white hover:bg-white/20 text-sm sm:text-base ${activeSection === item.id ? 'bg-white/20' : ''}`}
                  onClick={(e) => { 
                    e.preventDefault();
                    console.log('Clicked item:', item.id);
                    setActiveSection(item.id); 
                    setIsSidebarOpen(false); 
                  }}
                >
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isNavIconsOnly ? '' : 'mr-2'}`} />
                  {!isNavIconsOnly && <span>{item.label}</span>}
                </Button>
              </div>
            ))}
            <div>
              <Button 
                variant="ghost" 
                className={`w-full ${isNavIconsOnly ? 'justify-center p-2 min-h-10' : 'justify-start'} text-white hover:bg-white/20 text-sm sm:text-base`}
                onClick={() => console.log('Logout clicked')}
              >
                <LogOut className={`w-4 h-4 sm:w-5 sm:h-5 ${isNavIconsOnly ? '' : 'mr-2'}`} />
                {!isNavIconsOnly && <span>Déconnexion</span>}
              </Button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <Button
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 sm:px-4 sm:py-2"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>

      {/* Main Content */}
      <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="container mx-auto max-w-7xl ">
          {/* Header */}
          <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Panel Admin</h1> */}
                 <img src="/Logoe.png" alt="Admin Panel Logo" className="w-10 h-15 " />
               {/* <span className="text-blue-400 text-xs sm:text-sm">McDonald's Investa</span>  */}
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* <span className="text-white text-xs sm:text-sm hidden sm:block">Admin Dashboard</span> */}
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 text-xs sm:text-sm" onClick={() => console.log('Header logout clicked')}>
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Grid */}
          <div className="md:hidden grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4 sm:mb-6">
            {adminMenuItems.map((item) => (
              <div key={item.id}>
                <Card 
                  className={`bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 active:scale-95 transition-all duration-300 ${activeSection === item.id ? 'bg-white/20' : ''}`}
                  onClick={(e) => { 
                    e.preventDefault();
                    console.log('Mobile grid clicked:', item.id);
                    setActiveSection(item.id); 
                    setIsSidebarOpen(false); 
                  }}
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="space-y-2">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <p className="text-white text-xs sm:text-sm font-medium truncate">{item.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Render Section Components */}
          {activeSection === 'dashboard' && <Dashboard />}
          {activeSection === 'users' && <Users users={users} handleUserAction={handleUserAction} handleAddBalance={handleAddBalance} />}
          {activeSection === 'deposits' && <Deposits deposits={deposits} handleDepositAction={handleDepositAction} />}
          {activeSection === 'withdrawals' && <Withdrawals withdrawals={withdrawals} handleWithdrawalAction={handleWithdrawalAction} />}
          {activeSection === 'points' && <Points points={points} handlePointAction={handlePointAction} />}
          {activeSection === 'transactions' && <Transactions transactions={transactions} handleTransactionAction={handleTransactionAction} />}
          {activeSection === 'plans' && <Plans plans={plans} handlePlanAction={handlePlanAction} />}
          {activeSection === 'commissions' && <Commissions commissions={commissions} handleCommissionAction={handleCommissionAction} />}
          {activeSection === 'microtasks' && <Microtasks microtasks={microtasks} handleMicrotaskAction={handleMicrotaskAction} />}
          {activeSection === 'referrals' && <Referrals referrals={referrals} handleReferralAction={handleReferralAction} />}
          {activeSection === 'settings' && <Settings handleSettingUpdate={handleSettingUpdate} />}
          {activeSection === 'content' && <Content handleContentAction={handleContentAction} />}
          {activeSection === 'security' && <Security handleSecurityAction={handleSecurityAction} />}
          {activeSection === 'admins' && <Admins admins={admins} handleAdminAction={handleAdminAction} />}
        </div>
      </div>
    </div>
  );
}