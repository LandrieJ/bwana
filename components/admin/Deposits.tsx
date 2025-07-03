'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Check, X, Edit, Trash } from 'lucide-react';

interface Deposit {
  id: string;
  user: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  proof: string;
}

interface DepositsProps {
  deposits: Deposit[];
  handleDepositAction: (depositId: string, action: string) => void;
}

interface FormData {
  user?: string;
  amount?: number;
  currency?: string;
  date?: string;
  proof?: string;
  filterUser?: string;
  filterDate?: string;
}

export default function Deposits({ deposits: initialDeposits, handleDepositAction }: DepositsProps) {
  const [deposits, setDeposits] = useState<Deposit[]>(initialDeposits);
  const [modalType, setModalType] = useState<'validate' | 'reject' | 'modify' | 'delete' | null>(null);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [filteredDeposits, setFilteredDeposits] = useState<Deposit[]>(initialDeposits);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const openModal = (type: 'validate' | 'reject' | 'modify' | 'delete', deposit: Deposit) => {
    setModalType(type);
    setSelectedDeposit(deposit);
    reset({ user: deposit.user, amount: deposit.amount, currency: deposit.currency, date: deposit.date, proof: deposit.proof });
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDeposit(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Validé' } : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Validé' } : d));
      handleDepositAction(selectedDeposit.id, 'Valider');
      console.log(`Deposit ${selectedDeposit.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Rejeté' } : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? { ...d, status: 'Rejeté' } : d));
      handleDepositAction(selectedDeposit.id, 'Rejeter');
      console.log(`Deposit ${selectedDeposit.id} rejected`);
      closeModal();
    }
  };

  const onModifySubmit = (data: FormData) => {
    if (selectedDeposit && data.user && data.amount && data.currency && data.date) {
      const updatedDeposit = { ...selectedDeposit, user: data.user, amount: Number(data.amount), currency: data.currency, date: data.date, proof: data.proof || selectedDeposit.proof };
      setDeposits(deposits.map(d => d.id === selectedDeposit.id ? updatedDeposit : d));
      setFilteredDeposits(filteredDeposits.map(d => d.id === selectedDeposit.id ? updatedDeposit : d));
      handleDepositAction(selectedDeposit.id, 'Modifier');
      console.log(`Deposit ${selectedDeposit.id} modified:`, updatedDeposit);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedDeposit) {
      setDeposits(deposits.filter(d => d.id !== selectedDeposit.id));
      setFilteredDeposits(filteredDeposits.filter(d => d.id !== selectedDeposit.id));
      handleDepositAction(selectedDeposit.id, 'Supprimer');
      console.log(`Deposit ${selectedDeposit.id} deleted`);
      closeModal();
    }
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...deposits];
    if (data.filterUser) {
      filtered = filtered.filter(d => d.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterDate) {
      filtered = filtered.filter(d => d.date === data.filterDate);
    }
    setFilteredDeposits(filtered);
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des dépôts</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des dépôts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Filtrer</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Devise</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Preuve</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.map((deposit) => (
                  <tr key={deposit.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{deposit.user}</td>
                    <td className="p-2 sm:p-3">{deposit.amount.toLocaleString()} {deposit.currency}</td>
                    <td className="p-2 sm:p-3">{deposit.currency}</td>
                    <td className="p-2 sm:p-3">{deposit.date}</td>
                    <td className="p-2 sm:p-3">{deposit.status}</td>
                    <td className="p-2 sm:p-3">
                      <a href={deposit.proof} className="text-blue-400 hover:underline text-xs sm:text-sm">Voir</a>
                    </td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', deposit)}
                        aria-label="Valider le dépôt"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', deposit)}
                        aria-label="Rejeter le dépôt"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('modify', deposit)}
                        aria-label="Modifier le dépôt"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', deposit)}
                        aria-label="Supprimer le dépôt"
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Validate Modal */}
      <Dialog open={modalType === 'validate' && !!selectedDeposit} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Valider le dépôt</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Valider le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onValidateSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={modalType === 'reject' && !!selectedDeposit} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Rejeter le dépôt</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Rejeter le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onRejectSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Modal */}
      <Dialog open={modalType === 'modify' && !!selectedDeposit} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Modifier le dépôt</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onModifySubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="user">Utilisateur</Label>
              <Input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
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
              <Input
                id="currency"
                {...register('currency', { required: 'Devise requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.currency && <p className="text-red-500 text-xs">{errors.currency.message}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="proof">Preuve</Label>
              <Input
                id="proof"
                type="text"
                {...register('proof')}
                className="bg-white/10 text-white border-white/20"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={modalType === 'delete' && !!selectedDeposit} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Supprimer le dépôt</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Supprimer le dépôt de {selectedDeposit?.amount} {selectedDeposit?.currency} pour {selectedDeposit?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onDeleteSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}