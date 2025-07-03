'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Check, X, Edit, Trash, Plus, Download } from 'lucide-react';

interface Commission {
  id: string;
  user: string;
  amount: number;
  type: string;
  date: string;
  status: string;
}

interface CommissionsProps {
  commissions: Commission[];
  handleCommissionAction: (commissionId: string, action: string) => void;
}

interface FormData {
  filterUser?: string;
  filterType?: string;
  filterDate?: string;
  filterStatus?: string;
  user?: string;
  type?: string;
  amount?: number;
  date?: string;
  status?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Commissions({ commissions: initialCommissions, handleCommissionAction }: CommissionsProps) {
  const [commissions, setCommissions] = useState<Commission[]>(initialCommissions);
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>(initialCommissions);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export' | null>(null);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Commission | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export', commission?: Commission) => {
    setModalType(type);
    setSelectedCommission(commission || null);
    if (commission && type === 'edit') {
      setValue('user', commission.user);
      setValue('type', commission.type);
      setValue('amount', commission.amount);
      setValue('date', commission.date);
      setValue('status', commission.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCommission(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.user && data.type && data.amount && data.date && data.status) {
      const newCommission: Commission = {
        id: `comm${commissions.length + 1}`,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setCommissions([...commissions, newCommission]);
      setFilteredCommissions([...filteredCommissions, newCommission]);
      handleCommissionAction(newCommission.id, 'Ajouter');
      console.log(`Commission added:`, newCommission);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedCommission && data.user && data.type && data.amount && data.date && data.status) {
      const updatedCommission = {
        ...selectedCommission,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? updatedCommission : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? updatedCommission : c));
      handleCommissionAction(selectedCommission.id, 'Modifier');
      console.log(`Commission ${selectedCommission.id} edited:`, updatedCommission);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.filter(c => c.id !== selectedCommission.id));
      setFilteredCommissions(filteredCommissions.filter(c => c.id !== selectedCommission.id));
      handleCommissionAction(selectedCommission.id, 'Supprimer');
      console.log(`Commission ${selectedCommission.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Validé' } : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Validé' } : c));
      handleCommissionAction(selectedCommission.id, 'Valider');
      console.log(`Commission ${selectedCommission.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedCommission) {
      setCommissions(commissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Rejeté' } : c));
      setFilteredCommissions(filteredCommissions.map(c => c.id === selectedCommission.id ? { ...c, status: 'Rejeté' } : c));
      handleCommissionAction(selectedCommission.id, 'Rejeter');
      console.log(`Commission ${selectedCommission.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setCommissions(commissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Validé' } : c));
    setFilteredCommissions(filteredCommissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Validé' } : c));
    selectedCommissions.forEach(id => handleCommissionAction(id, 'Valider'));
    console.log(`Bulk validated commissions:`, selectedCommissions);
    setSelectedCommissions([]);
  };

  const onBulkReject = () => {
    setCommissions(commissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Rejeté' } : c));
    setFilteredCommissions(filteredCommissions.map(c => selectedCommissions.includes(c.id) ? { ...c, status: 'Rejeté' } : c));
    selectedCommissions.forEach(id => handleCommissionAction(id, 'Rejeter'));
    console.log(`Bulk rejected commissions:`, selectedCommissions);
    setSelectedCommissions([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredCommissions.map(c => `${c.id},${c.user},${c.type},${c.amount},${c.date},${c.status}`).join('\n');
      const blob = new Blob([`id,user,type,amount,date,status\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commissions_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting commissions as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...commissions];
    if (data.filterUser) {
      filtered = filtered.filter(c => c.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterType && data.filterType !== 'all') {
      filtered = filtered.filter(c => c.type === data.filterType);
    }
    if (data.filterDate) {
      filtered = filtered.filter(c => c.date === data.filterDate);
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === data.filterStatus);
    }
    setFilteredCommissions(filtered);
  };

  const sortTable = (field: keyof Commission) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredCommissions].sort((a, b) => {
      const aValue = field === 'amount' ? a[field] : a[field];
      const bValue = field === 'amount' ? b[field] : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredCommissions(sorted);
  };

  const toggleSelectCommission = (id: string) => {
    setSelectedCommissions(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCommissions.length === filteredCommissions.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(filteredCommissions.map(c => c.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des gains/commissions</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des commissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-600 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter une commission"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une commission
            </Button>
            {selectedCommissions.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkValidate}
                  aria-label="Valider les commissions sélectionnées"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkReject}
                  aria-label="Rejeter les commissions sélectionnées"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les commissions"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterType')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Parrainage">Parrainage</SelectItem>
                <SelectItem value="Bonus">Bonus</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              {...register('filterDate')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Validé">Validé</SelectItem>
                <SelectItem value="Rejeté">Rejeté</SelectItem>
                <SelectItem value="En attente">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Filtrer</Button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-xs sm:text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedCommissions.length === filteredCommissions.length && filteredCommissions.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les commissions"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('user')}
                  >
                    Utilisateur {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('amount')}
                  >
                    Montant {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('type')}
                  >
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedCommissions.includes(commission.id)}
                        onChange={() => toggleSelectCommission(commission.id)}
                        aria-label={`Sélectionner la commission ${commission.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{commission.user}</td>
                    <td className="p-2 sm:p-3">{commission.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{commission.type}</td>
                    <td className="p-2 sm:p-3">{commission.date}</td>
                    <td className="p-2 sm:p-3">{commission.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', commission)}
                        aria-label="Valider la commission"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', commission)}
                        aria-label="Rejeter la commission"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', commission)}
                        aria-label="Modifier la commission"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', commission)}
                        aria-label="Supprimer la commission"
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

      {/* Add Commission Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une commission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="user">Utilisateur</Label>
              <Input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select {...register('type', { required: 'Type requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Parrainage">Parrainage</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>
            <div>
              <Label htmlFor="amount">Montant (Ar)</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Commission Modal */}
      <Dialog open={modalType === 'edit' && !!selectedCommission} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la commission</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="user">Utilisateur</Label>
              <Input
                id="user"
                {...register('user', { required: 'Utilisateur requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.user && <p className="text-red-500 text-xs">{errors.user.message}</p>}
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select {...register('type', { required: 'Type requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Parrainage">Parrainage</SelectItem>
                  <SelectItem value="Bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
            </div>
            <div>
              <Label htmlFor="amount">Montant (Ar)</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { required: 'Montant requis', min: { value: 1, message: 'Montant doit être supérieur à 0' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: 'Date requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Validé">Validé</SelectItem>
                  <SelectItem value="Rejeté">Rejeté</SelectItem>
                  <SelectItem value="En attente">En attente</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Commission Modal */}
      <Dialog open={modalType === 'delete' && !!selectedCommission} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer la commission</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedCommission ? (
              <p>Supprimer la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedCommission}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Commission Modal */}
      <Dialog open={modalType === 'validate' && !!selectedCommission} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Valider la commission</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedCommission ? (
              <p>Valider la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onValidateSubmit} disabled={!selectedCommission}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Commission Modal */}
      <Dialog open={modalType === 'reject' && !!selectedCommission} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rejeter la commission</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedCommission ? (
              <p>Rejeter la commission de {selectedCommission.amount.toLocaleString()} Ar pour {selectedCommission.user} ?</p>
            ) : (
              <p>Aucune commission sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onRejectSubmit} disabled={!selectedCommission}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Commissions Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les commissions</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onExportSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="exportFormat">Format</Label>
              <Select {...register('exportFormat', { required: 'Format requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                </SelectContent>
              </Select>
              {errors.exportFormat && <p className="text-red-500 text-xs">{errors.exportFormat.message}</p>}
            </div>
            <div>
              <Label htmlFor="exportStartDate">Date de début</Label>
              <Input
                id="exportStartDate"
                type="date"
                {...register('exportStartDate', { required: 'Date de début requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="exportEndDate">Date de fin</Label>
              <Input
                id="exportEndDate"
                type="date"
                {...register('exportEndDate', { required: 'Date de fin requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Exporter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}