'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Check, X } from 'lucide-react';

interface Withdrawal {
  id: string;
  user: string;
  amount: number;
  method: string;
  number: string;
  status: string;
}

interface WithdrawalsProps {
  withdrawals: Withdrawal[];
  handleWithdrawalAction: (withdrawalId: string, action: string) => void;
}

interface FormData {
  format?: string;
  startDate?: string;
  endDate?: string;
}

export default function Withdrawals({ withdrawals: initialWithdrawals, handleWithdrawalAction }: WithdrawalsProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  const [modalType, setModalType] = useState<'validate' | 'reject' | 'export' | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const openModal = (type: 'validate' | 'reject' | 'export', withdrawal?: Withdrawal) => {
    setModalType(type);
    setSelectedWithdrawal(withdrawal || null);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedWithdrawal(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedWithdrawal) {
      setWithdrawals(withdrawals.map(w => w.id === selectedWithdrawal.id ? { ...w, status: 'Validé' } : w));
      handleWithdrawalAction(selectedWithdrawal.id, 'Valider');
      console.log(`Withdrawal ${selectedWithdrawal.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedWithdrawal) {
      setWithdrawals(withdrawals.map(w => w.id === selectedWithdrawal.id ? { ...w, status: 'Rejeté' } : w));
      handleWithdrawalAction(selectedWithdrawal.id, 'Rejeter');
      console.log(`Withdrawal ${selectedWithdrawal.id} rejected`);
      closeModal();
    }
  };

  const onExportSubmit = (data: FormData) => {
    console.log(`Exporting withdrawals as ${data.format} from ${data.startDate} to ${data.endDate}`);
    closeModal();
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des retraits</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des retraits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button
              variant="outline"
              className="text-white bg-green-500 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter l'historique"
            >
              Exporter l'historique
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Méthode</th>
                  <th className="p-2 sm:p-3 text-left">Numéro</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{withdrawal.user}</td>
                    <td className="p-2 sm:p-3">{withdrawal.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{withdrawal.method}</td>
                    <td className="p-2 sm:p-3">{withdrawal.number}</td>
                    <td className="p-2 sm:p-3">{withdrawal.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', withdrawal)}
                        aria-label="Valider le retrait"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', withdrawal)}
                        aria-label="Rejeter le retrait"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
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
      <Dialog open={modalType === 'validate' && !!selectedWithdrawal} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Valider le retrait</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Valider le retrait de {selectedWithdrawal?.amount} Ar pour {selectedWithdrawal?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onValidateSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={modalType === 'reject' && !!selectedWithdrawal} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Rejeter le retrait</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Rejeter le retrait de {selectedWithdrawal?.amount} Ar pour {selectedWithdrawal?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onRejectSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Exporter l'historique des retraits</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onExportSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select {...register('format', { required: 'Format requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                </SelectContent>
              </Select>
              {errors.format && <p className="text-red-500 text-xs">{errors.format.message}</p>}
            </div>
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate', { required: 'Date de début requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate', { required: 'Date de fin requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Exporter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}