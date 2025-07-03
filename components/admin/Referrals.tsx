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

interface Referral {
  id: string;
  user: string;
  referrer: string;
  commission: number;
  status: string;
  date?: string;
}

interface ReferralsProps {
  referrals: Referral[];
  handleReferralAction: (referralId: string, action: string) => void;
}

interface FormData {
  filterUser?: string;
  filterReferrer?: string;
  filterStatus?: string;
  filterDate?: string;
  user?: string;
  referrer?: string;
  commission?: number;
  status?: string;
  date?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Referrals({ referrals: initialReferrals, handleReferralAction }: ReferralsProps) {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>(initialReferrals);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export' | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Referral | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export', referral?: Referral) => {
    setModalType(type);
    setSelectedReferral(referral || null);
    if (referral && type === 'edit') {
      setValue('user', referral.user);
      setValue('referrer', referral.referrer);
      setValue('commission', referral.commission);
      setValue('status', referral.status);
      setValue('date', referral.date || '');
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedReferral(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.user && data.referrer && data.commission && data.status) {
      const newReferral: Referral = {
        id: `ref${referrals.length + 1}`,
        user: data.user,
        referrer: data.referrer,
        commission: Number(data.commission),
        status: data.status,
        date: data.date || new Date().toISOString().split('T')[0],
      };
      setReferrals([...referrals, newReferral]);
      setFilteredReferrals([...filteredReferrals, newReferral]);
      handleReferralAction(newReferral.id, 'Ajouter');
      console.log(`Referral added:`, newReferral);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedReferral && data.user && data.referrer && data.commission && data.status) {
      const updatedReferral = {
        ...selectedReferral,
        user: data.user,
        referrer: data.referrer,
        commission: Number(data.commission),
        status: data.status,
        date: data.date || selectedReferral.date || new Date().toISOString().split('T')[0],
      };
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? updatedReferral : r));
      handleReferralAction(selectedReferral.id, 'Modifier');
      console.log(`Referral ${selectedReferral.id} edited:`, updatedReferral);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.filter(r => r.id !== selectedReferral.id));
      setFilteredReferrals(filteredReferrals.filter(r => r.id !== selectedReferral.id));
      handleReferralAction(selectedReferral.id, 'Supprimer');
      console.log(`Referral ${selectedReferral.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Validé' } : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Validé' } : r));
      handleReferralAction(selectedReferral.id, 'Valider');
      console.log(`Referral ${selectedReferral.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedReferral) {
      setReferrals(referrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Rejeté' } : r));
      setFilteredReferrals(filteredReferrals.map(r => r.id === selectedReferral.id ? { ...r, status: 'Rejeté' } : r));
      handleReferralAction(selectedReferral.id, 'Rejeter');
      console.log(`Referral ${selectedReferral.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setReferrals(referrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Validé' } : r));
    setFilteredReferrals(filteredReferrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Validé' } : r));
    selectedReferrals.forEach(id => handleReferralAction(id, 'Valider'));
    console.log(`Bulk validated referrals:`, selectedReferrals);
    setSelectedReferrals([]);
  };

  const onBulkReject = () => {
    setReferrals(referrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Rejeté' } : r));
    setFilteredReferrals(filteredReferrals.map(r => selectedReferrals.includes(r.id) ? { ...r, status: 'Rejeté' } : r));
    selectedReferrals.forEach(id => handleReferralAction(id, 'Rejeter'));
    console.log(`Bulk rejected referrals:`, selectedReferrals);
    setSelectedReferrals([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredReferrals.map(r => `${r.id},${r.user},${r.referrer},${r.commission},${r.status},${r.date || ''}`).join('\n');
      const blob = new Blob([`id,user,referrer,commission,status,date\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `referrals_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting referrals as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...referrals];
    if (data.filterUser) {
      filtered = filtered.filter(r => r.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterReferrer) {
      filtered = filtered.filter(r => r.referrer.toLowerCase().includes(data.filterReferrer!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(r => r.date && r.date === data.filterDate);
    }
    setFilteredReferrals(filtered);
  };

  const sortTable = (field: keyof Referral) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredReferrals].sort((a, b) => {
      const aValue = field === 'commission' ? a[field] : a[field] || '';
      const bValue = field === 'commission' ? b[field] : b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredReferrals(sorted);
  };

  const toggleSelectReferral = (id: string) => {
    setSelectedReferrals(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReferrals.length === filteredReferrals.length) {
      setSelectedReferrals([]);
    } else {
      setSelectedReferrals(filteredReferrals.map(r => r.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des parrainages/affiliés</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des parrainages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-600 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter un parrainage"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un parrainage
            </Button>
            {selectedReferrals.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkValidate}
                  aria-label="Valider les parrainages sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkReject}
                  aria-label="Rejeter les parrainages sélectionnés"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les parrainages"
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
            <Input
              type="text"
              placeholder="Filtrer par parrain"
              {...register('filterReferrer')}
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
                  <th className="p-2 sm:p-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReferrals.length === filteredReferrals.length && filteredReferrals.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les parrainages"
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
                    onClick={() => sortTable('referrer')}
                  >
                    Parrain {sortField === 'referrer' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('commission')}
                  >
                    Commission {sortField === 'commission' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('date')}
                  >
                    Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedReferrals.includes(referral.id)}
                        onChange={() => toggleSelectReferral(referral.id)}
                        aria-label={`Sélectionner le parrainage ${referral.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{referral.user}</td>
                    <td className="p-2 sm:p-3">{referral.referrer}</td>
                    <td className="p-2 sm:p-3">{referral.commission.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{referral.status}</td>
                    <td className="p-2 sm:p-3">{referral.date || '-'}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', referral)}
                        aria-label="Valider le parrainage"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', referral)}
                        aria-label="Rejeter le parrainage"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', referral)}
                        aria-label="Modifier le parrainage"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', referral)}
                        aria-label="Supprimer le parrainage"
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

      {/* Add Referral Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un parrainage</DialogTitle>
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
              <Label htmlFor="referrer">Parrain</Label>
              <Input
                id="referrer"
                {...register('referrer', { required: 'Parrain requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.referrer && <p className="text-red-500 text-xs">{errors.referrer.message}</p>}
            </div>
            <div>
              <Label htmlFor="commission">Commission (Ar)</Label>
              <Input
                id="commission"
                type="number"
                {...register('commission', { required: 'Commission requise', min: { value: 1, message: 'Commission doit être supérieure à 0' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.commission && <p className="text-red-500 text-xs">{errors.commission.message}</p>}
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
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Referral Modal */}
      <Dialog open={modalType === 'edit' && !!selectedReferral} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le parrainage</DialogTitle>
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
              <Label htmlFor="referrer">Parrain</Label>
              <Input
                id="referrer"
                {...register('referrer', { required: 'Parrain requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.referrer && <p className="text-red-500 text-xs">{errors.referrer.message}</p>}
            </div>
            <div>
              <Label htmlFor="commission">Commission (Ar)</Label>
              <Input
                id="commission"
                type="number"
                {...register('commission', { required: 'Commission requise', min: { value: 1, message: 'Commission doit être supérieure à 0' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.commission && <p className="text-red-500 text-xs">{errors.commission.message}</p>}
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
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Referral Modal */}
      <Dialog open={modalType === 'delete' && !!selectedReferral} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer le parrainage</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedReferral ? (
              <p>Supprimer le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
            ) : (
              <p>Aucun parrainage sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedReferral}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Referral Modal */}
      <Dialog open={modalType === 'validate' && !!selectedReferral} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Valider le parrainage</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedReferral ? (
              <p>Valider le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
            ) : (
              <p>Aucun parrainage sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onValidateSubmit} disabled={!selectedReferral}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Referral Modal */}
      <Dialog open={modalType === 'reject' && !!selectedReferral} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rejeter le parrainage</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedReferral ? (
              <p>Rejeter le parrainage de {selectedReferral.user} par {selectedReferral.referrer} ({selectedReferral.commission.toLocaleString()} Ar) ?</p>
            ) : (
              <p>Aucun parrainage sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onRejectSubmit} disabled={!selectedReferral}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Referrals Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les parrainages</DialogTitle>
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