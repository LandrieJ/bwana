'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Check, X, Plus, Edit, Eye } from 'lucide-react';

interface User {
  id: string;
  name: string;
  whatsapp: string;
  referrer: string;
  balance: number;
  status: string;
}

interface UsersProps {
  users: User[];
  handleUserAction: (userId: string, action: string) => void;
  handleAddBalance: (userId: string) => void;
}

interface FormData {
  password?: string;
  confirmPassword?: string;
  amount?: number;
  currency?: string;
}

export default function Users({ users: initialUsers, handleUserAction, handleAddBalance }: UsersProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [modalType, setModalType] = useState<'suspend' | 'reset' | 'view' | 'addBalance' | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>();

  const openModal = (type: 'suspend' | 'reset' | 'view' | 'addBalance', user: User) => {
    setModalType(type);
    setSelectedUser(user);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
    reset();
  };

  const onSuspendSubmit = () => {
    if (selectedUser) {
      const newStatus = selectedUser.status === 'Actif' ? 'Suspendu' : 'Actif';
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
      handleUserAction(selectedUser.id, newStatus === 'Suspendu' ? 'Suspendre' : 'Activer');
      console.log(`User ${selectedUser.name} ${newStatus}`);
      closeModal();
    }
  };

  const onResetPasswordSubmit = (data: FormData) => {
    if (selectedUser && data.password && data.password === data.confirmPassword) {
      handleUserAction(selectedUser.id, 'Reset Password');
      console.log(`Password reset for ${selectedUser.name} to ${data.password}`);
      closeModal();
    }
  };

  const onAddBalanceSubmit = (data: FormData) => {
    if (selectedUser && data.amount && data.currency) {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, balance: u.balance + Number(data.amount) } : u));
      handleAddBalance(selectedUser.id);
      console.log(`Added ${data.amount} ${data.currency} to ${selectedUser.name}'s balance`);
      closeModal();
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des utilisateurs</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Nom</th>
                  <th className="p-2 sm:p-3 text-left">WhatsApp</th>
                  <th className="p-2 sm:p-3 text-left">Parrain</th>
                  <th className="p-2 sm:p-3 text-left">Solde</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{user.name}</td>
                    <td className="p-2 sm:p-3">{user.whatsapp}</td>
                    <td className="p-2 sm:p-3">{user.referrer}</td>
                    <td className="p-2 sm:p-3">{user.balance.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{user.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-600 text-white border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('suspend', user)}
                        aria-label={user.status === 'Actif' ? 'Suspendre utilisateur' : 'Activer utilisateur'}
                      >
                        {user.status === 'Actif' ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {user.status === 'Actif' ? 'Suspendre' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reset', user)}
                        aria-label="Réinitialiser le mot de passe"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Réinitialiser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('view', user)}
                        aria-label="Voir le tableau de bord"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-500 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('addBalance', user)}
                        aria-label="Ajouter un solde"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Ajouter Solde
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Suspend/Activate Modal */}
      <Dialog open={modalType === 'suspend' && !!selectedUser} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>{selectedUser?.status === 'Actif' ? 'Suspendre' : 'Activer'} Utilisateur</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Êtes-vous sûr de vouloir {selectedUser?.status === 'Actif' ? 'suspendre' : 'activer'} {selectedUser?.name} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onSuspendSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={modalType === 'reset' && !!selectedUser} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Réinitialiser le mot de passe pour {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onResetPasswordSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 6, message: 'Minimum 6 caractères' } })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirmation requise',
                  validate: value => value === watch('password') || 'Les mots de passe ne correspondent pas'
                })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dashboard Modal */}
      <Dialog open={modalType === 'view' && !!selectedUser} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Tableau de bord de {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-2">
            <p><strong>Nom:</strong> {selectedUser?.name}</p>
            <p><strong>WhatsApp:</strong> {selectedUser?.whatsapp}</p>
            <p><strong>Parrain:</strong> {selectedUser?.referrer}</p>
            <p><strong>Solde:</strong> {selectedUser?.balance.toLocaleString()} Ar</p>
            <p><strong>Statut:</strong> {selectedUser?.status}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Balance Modal */}
      <Dialog open={modalType === 'addBalance' && !!selectedUser} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Ajouter un solde pour {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddBalanceSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <Label htmlFor="currency">Devise</Label>
              <Select {...register('currency', { required: 'Devise requise' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Ar">Ar</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
              {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}