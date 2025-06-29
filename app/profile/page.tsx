'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, EyeOff, ArrowLeft, Upload, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showWithdrawPassword, setShowWithdrawPassword] = useState(false);
  const [showConfirmWithdrawPassword, setShowConfirmWithdrawPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    phone: '',
    operator: 'mvola',
    withdrawPassword: '',
    confirmWithdrawPassword: '',
    avatar: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const storedUserId = localStorage.getItem('userId');
    const userPhone = localStorage.getItem('userPhone');
    
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setUserId(storedUserId || '');
      setProfileData(prev => ({
        ...prev,
        phone: userPhone || ''
      }));
    }
  }, [router]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
      toast.success('Photo de profil mise à jour');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation des mots de passe
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('Les nouveaux mots de passe de connexion ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (profileData.withdrawPassword && profileData.withdrawPassword !== profileData.confirmWithdrawPassword) {
      toast.error('Les mots de passe de retrait ne correspondent pas');
      setIsLoading(false);
      return;
    }

    // Simulation de la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sauvegarder les modifications
    if (profileData.fullName) {
      localStorage.setItem('userFullName', profileData.fullName);
    }
    if (profileData.phone) {
      localStorage.setItem('userPhone', profileData.phone);
    }
    
    toast.success('Profil mis à jour avec succès !');
    setIsLoading(false);

    // Réinitialiser les champs de mot de passe
    setProfileData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      withdrawPassword: '',
      confirmWithdrawPassword: ''
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">MON PROFIL</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-red-600 text-center">Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="bg-red-100 text-red-600 text-2xl">
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* User ID */}
              <div>
                <Label>Numéro USER ID</Label>
                <Input
                  value={userId}
                  readOnly
                  className="bg-gray-50 text-gray-600"
                />
                <p className="text-xs text-gray-500 mt-1">Généré automatiquement à l'inscription</p>
              </div>

              {/* Full Name */}
              <div>
                <Label>Nom et prénom</Label>
                <Input
                  placeholder="Entrer votre nom complet"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData(prev => ({...prev, fullName: e.target.value}))}
                />
              </div>

              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Modifier le mot de passe de connexion</h3>
                
                <div>
                  <Label>Ancien mot de passe</Label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Entrer l'ancien mot de passe"
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, currentPassword: e.target.value}))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Entrer le nouveau mot de passe"
                      value={profileData.newPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, newPassword: e.target.value}))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Confirmer le nouveau mot de passe</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répéter le nouveau mot de passe"
                      value={profileData.confirmPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, confirmPassword: e.target.value}))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone and Operator */}
              <div className="space-y-4">
                <div>
                  <Label>Opérateur Mobile Money</Label>
                  <Select value={profileData.operator} onValueChange={(value) => setProfileData(prev => ({...prev, operator: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mvola">MVola</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                      <SelectItem value="orange">Orange Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Numéro de téléphone</Label>
                  <Input
                    type="tel"
                    placeholder="034 XX XXX XX"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                  />
                </div>
              </div>

              {/* Withdraw Password */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Mot de passe de retrait</h3>
                
                <div>
                  <Label>Mot de passe de retrait</Label>
                  <div className="relative">
                    <Input
                      type={showWithdrawPassword ? "text" : "password"}
                      placeholder="Entrer le mot de passe de retrait"
                      value={profileData.withdrawPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, withdrawPassword: e.target.value}))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowWithdrawPassword(!showWithdrawPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showWithdrawPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label>Confirmer le mot de passe de retrait</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmWithdrawPassword ? "text" : "password"}
                      placeholder="Répéter le mot de passe de retrait"
                      value={profileData.confirmWithdrawPassword}
                      onChange={(e) => setProfileData(prev => ({...prev, confirmWithdrawPassword: e.target.value}))}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmWithdrawPassword(!showConfirmWithdrawPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmWithdrawPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sauvegarde...' : 'CONFIRMER'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-yellow-400 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => {
                    setProfileData({
                      fullName: '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                      phone: localStorage.getItem('userPhone') || '',
                      operator: 'mvola',
                      withdrawPassword: '',
                      confirmWithdrawPassword: '',
                      avatar: ''
                    });
                  }}
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