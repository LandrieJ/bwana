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

interface Plan {
  id: string;
  name: string;
  roi: string;
  duration: string;
  status: string;
}

interface PlansProps {
  plans: Plan[];
  handlePlanAction: (planId: string, action: string) => void;
}

interface FormData {
  filterName?: string;
  filterROI?: number;
  filterDuration?: string;
  filterStatus?: string;
  name?: string;
  roi?: string;
  duration?: string;
  status?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Plans({ plans: initialPlans, handlePlanAction }: PlansProps) {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>(initialPlans);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'toggle' | 'export' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Plan | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'toggle' | 'export', plan?: Plan) => {
    setModalType(type);
    setSelectedPlan(plan || null);
    if (plan && type === 'edit') {
      setValue('name', plan.name);
      setValue('roi', plan.roi);
      setValue('duration', plan.duration);
      setValue('status', plan.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPlan(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.name && data.roi && data.duration && data.status) {
      const newPlan: Plan = {
        id: `plan${plans.length + 1}`,
        name: data.name,
        roi: data.roi,
        duration: data.duration,
        status: data.status,
      };
      setPlans([...plans, newPlan]);
      setFilteredPlans([...filteredPlans, newPlan]);
      handlePlanAction(newPlan.id, 'Ajouter');
      console.log(`Plan added:`, newPlan);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedPlan && data.name && data.roi && data.duration && data.status) {
      const updatedPlan = {
        ...selectedPlan,
        name: data.name,
        roi: data.roi,
        duration: data.duration,
        status: data.status,
      };
      setPlans(plans.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      setFilteredPlans(filteredPlans.map(p => p.id === selectedPlan.id ? updatedPlan : p));
      handlePlanAction(selectedPlan.id, 'Modifier');
      console.log(`Plan ${selectedPlan.id} edited:`, updatedPlan);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedPlan) {
      setPlans(plans.filter(p => p.id !== selectedPlan.id));
      setFilteredPlans(filteredPlans.filter(p => p.id !== selectedPlan.id));
      handlePlanAction(selectedPlan.id, 'Supprimer');
      console.log(`Plan ${selectedPlan.id} deleted`);
      closeModal();
    }
  };

  const onToggleSubmit = () => {
    if (selectedPlan) {
      const newStatus = selectedPlan.status === 'Actif' ? 'Désactivé' : 'Actif';
      setPlans(plans.map(p => p.id === selectedPlan.id ? { ...p, status: newStatus } : p));
      setFilteredPlans(filteredPlans.map(p => p.id === selectedPlan.id ? { ...p, status: newStatus } : p));
      handlePlanAction(selectedPlan.id, newStatus === 'Actif' ? 'Activer' : 'Désactiver');
      console.log(`Plan ${selectedPlan.id} ${newStatus}`);
      closeModal();
    }
  };

  const onBulkToggle = (action: 'Activer' | 'Désactiver') => {
    const newStatus = action === 'Activer' ? 'Actif' : 'Désactivé';
    setPlans(plans.map(p => selectedPlans.includes(p.id) ? { ...p, status: newStatus } : p));
    setFilteredPlans(filteredPlans.map(p => selectedPlans.includes(p.id) ? { ...p, status: newStatus } : p));
    selectedPlans.forEach(id => handlePlanAction(id, action));
    console.log(`Bulk ${action.toLowerCase()} plans:`, selectedPlans);
    setSelectedPlans([]);
  };

  const onExportSubmit = (data: FormData) => {
    console.log(`Exporting plans as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...plans];
    if (data.filterName) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(data.filterName!.toLowerCase()));
    }
    if (data.filterROI) {
      filtered = filtered.filter(p => parseFloat(p.roi) >= data.filterROI!);
    }
    if (data.filterDuration) {
      filtered = filtered.filter(p => p.duration.toLowerCase().includes(data.filterDuration!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === data.filterStatus);
    }
    setFilteredPlans(filtered);
  };

  const sortTable = (field: keyof Plan) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredPlans].sort((a, b) => {
      const aValue = field === 'roi' ? parseFloat(a[field]) : a[field];
      const bValue = field === 'roi' ? parseFloat(b[field]) : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredPlans(sorted);
  };

  const toggleSelectPlan = (id: string) => {
    setSelectedPlans(prev =>
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPlans.length === filteredPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(filteredPlans.map(p => p.id));
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des plans d'investissement</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-500 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter un plan"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un plan
            </Button>
            {selectedPlans.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={() => onBulkToggle('Activer')}
                  aria-label="Activer les plans sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Activer sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={() => onBulkToggle('Désactiver')}
                  aria-label="Désactiver les plans sélectionnés"
                >
                  <X className="w-4 h-4 mr-2" />
                  Désactiver sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les plans"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par nom"
              {...register('filterName')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Input
              type="number"
              placeholder="ROI minimum (%)"
              {...register('filterROI')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Input
              type="text"
              placeholder="Filtrer par durée"
              {...register('filterDuration')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Désactivé">Désactivé</SelectItem>
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
                      checked={selectedPlans.length === filteredPlans.length && filteredPlans.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les plans"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('name')}
                  >
                    Nom {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('roi')}
                  >
                    ROI {sortField === 'roi' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('duration')}
                  >
                    Durée {sortField === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedPlans.includes(plan.id)}
                        onChange={() => toggleSelectPlan(plan.id)}
                        aria-label={`Sélectionner le plan ${plan.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{plan.name}</td>
                    <td className="p-2 sm:p-3">{plan.roi}</td>
                    <td className="p-2 sm:p-3">{plan.duration}</td>
                    <td className="p-2 sm:p-3">{plan.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('toggle', plan)}
                        aria-label={plan.status === 'Actif' ? 'Désactiver le plan' : 'Activer le plan'}
                      >
                        {plan.status === 'Actif' ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {plan.status === 'Actif' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', plan)}
                        aria-label="Modifier le plan"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', plan)}
                        aria-label="Supprimer le plan"
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

      {/* Add Plan Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Ajouter un plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="roi">ROI (%)</Label>
              <Input
                id="roi"
                type="text"
                {...register('roi', {
                  required: 'ROI requis',
                  pattern: { value: /^\d+(\.\d+)?%$/, message: 'Format: nombre suivi de % (ex: 5%)' }
                })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.roi && <p className="text-red-500 text-xs">{errors.roi.message}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                {...register('duration', { required: 'Durée requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Désactivé">Désactivé</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Modal */}
      <Dialog open={modalType === 'edit' && !!selectedPlan} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Modifier le plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="roi">ROI (%)</Label>
              <Input
                id="roi"
                type="text"
                {...register('roi', {
                  required: 'ROI requis',
                  pattern: { value: /^\d+(\.\d+)?%$/, message: 'Format: nombre suivi de % (ex: 5%)' }
                })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.roi && <p className="text-red-500 text-xs">{errors.roi.message}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Durée</Label>
              <Input
                id="duration"
                {...register('duration', { required: 'Durée requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Désactivé">Désactivé</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Modal */}
      <Dialog open={modalType === 'delete' && !!selectedPlan} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Supprimer le plan</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Supprimer le plan {selectedPlan?.name} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onDeleteSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Modal */}
      <Dialog open={modalType === 'toggle' && !!selectedPlan} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.status === 'Actif' ? 'Désactiver' : 'Activer'} le plan</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>{selectedPlan?.status === 'Actif' ? 'Désactiver' : 'Activer'} le plan {selectedPlan?.name} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onToggleSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Plans Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Exporter les plans</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onExportSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="exportFormat">Format</Label>
              <Select {...register('exportFormat', { required: 'Format requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
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
                className="bg-white/10 text-white border-white/20"
              />
              {errors.exportStartDate && <p className="text-red-500 text-xs">{errors.exportStartDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="exportEndDate">Date de fin</Label>
              <Input
                id="exportEndDate"
                type="date"
                {...register('exportEndDate', { required: 'Date de fin requise' })}
                className="bg-white/10 text-white border-white/20"
              />
              {errors.exportEndDate && <p className="text-red-500 text-xs">{errors.exportEndDate.message}</p>}
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