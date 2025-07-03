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

interface Microtask {
  id: string;
  user: string;
  task: string;
  status: string;
  date: string;
}

interface MicrotasksProps {
  microtasks: Microtask[];
  handleMicrotaskAction: (microtaskId: string, action: string) => void;
}

interface FormData {
  filterUser?: string;
  filterTask?: string;
  filterStatus?: string;
  filterDate?: string;
  user?: string;
  task?: string;
  status?: string;
  date?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Microtasks({ microtasks: initialMicrotasks, handleMicrotaskAction }: MicrotasksProps) {
  const [microtasks, setMicrotasks] = useState<Microtask[]>(initialMicrotasks);
  const [filteredMicrotasks, setFilteredMicrotasks] = useState<Microtask[]>(initialMicrotasks);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export' | null>(null);
  const [selectedMicrotask, setSelectedMicrotask] = useState<Microtask | null>(null);
  const [selectedMicrotasks, setSelectedMicrotasks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Microtask | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export', microtask?: Microtask) => {
    setModalType(type);
    setSelectedMicrotask(microtask || null);
    if (microtask && type === 'edit') {
      setValue('user', microtask.user);
      setValue('task', microtask.task);
      setValue('status', microtask.status);
      setValue('date', microtask.date);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMicrotask(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.user && data.task && data.status && data.date) {
      const newMicrotask: Microtask = {
        id: `task${microtasks.length + 1}`,
        user: data.user,
        task: data.task,
        status: data.status,
        date: data.date,
      };
      setMicrotasks([...microtasks, newMicrotask]);
      setFilteredMicrotasks([...filteredMicrotasks, newMicrotask]);
      handleMicrotaskAction(newMicrotask.id, 'Ajouter');
      console.log(`Microtask added:`, newMicrotask);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedMicrotask && data.user && data.task && data.status && data.date) {
      const updatedMicrotask = {
        ...selectedMicrotask,
        user: data.user,
        task: data.task,
        status: data.status,
        date: data.date,
      };
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? updatedMicrotask : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? updatedMicrotask : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Modifier');
      console.log(`Microtask ${selectedMicrotask.id} edited:`, updatedMicrotask);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.filter(t => t.id !== selectedMicrotask.id));
      setFilteredMicrotasks(filteredMicrotasks.filter(t => t.id !== selectedMicrotask.id));
      handleMicrotaskAction(selectedMicrotask.id, 'Supprimer');
      console.log(`Microtask ${selectedMicrotask.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Validé' } : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Validé' } : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Valider');
      console.log(`Microtask ${selectedMicrotask.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedMicrotask) {
      setMicrotasks(microtasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Rejeté' } : t));
      setFilteredMicrotasks(filteredMicrotasks.map(t => t.id === selectedMicrotask.id ? { ...t, status: 'Rejeté' } : t));
      handleMicrotaskAction(selectedMicrotask.id, 'Rejeter');
      console.log(`Microtask ${selectedMicrotask.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setMicrotasks(microtasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Validé' } : t));
    setFilteredMicrotasks(filteredMicrotasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Validé' } : t));
    selectedMicrotasks.forEach(id => handleMicrotaskAction(id, 'Valider'));
    console.log(`Bulk validated microtasks:`, selectedMicrotasks);
    setSelectedMicrotasks([]);
  };

  const onBulkReject = () => {
    setMicrotasks(microtasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    setFilteredMicrotasks(filteredMicrotasks.map(t => selectedMicrotasks.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    selectedMicrotasks.forEach(id => handleMicrotaskAction(id, 'Rejeter'));
    console.log(`Bulk rejected microtasks:`, selectedMicrotasks);
    setSelectedMicrotasks([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredMicrotasks.map(t => `${t.id},${t.user},${t.task},${t.status},${t.date}`).join('\n');
      const blob = new Blob([`id,user,task,status,date\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `microtasks_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting microtasks as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...microtasks];
    if (data.filterUser) {
      filtered = filtered.filter(t => t.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterTask) {
      filtered = filtered.filter(t => t.task.toLowerCase().includes(data.filterTask!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(t => t.date === data.filterDate);
    }
    setFilteredMicrotasks(filtered);
  };

  const sortTable = (field: keyof Microtask) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredMicrotasks].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredMicrotasks(sorted);
  };

  const toggleSelectMicrotask = (id: string) => {
    setSelectedMicrotasks(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMicrotasks.length === filteredMicrotasks.length) {
      setSelectedMicrotasks([]);
    } else {
      setSelectedMicrotasks(filteredMicrotasks.map(t => t.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des micro-tâches</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des micro-tâches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-600 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter une micro-tâche"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une micro-tâche
            </Button>
            {selectedMicrotasks.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkValidate}
                  aria-label="Valider les micro-tâches sélectionnées"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkReject}
                  aria-label="Rejeter les micro-tâches sélectionnées"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les micro-tâches"
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
              placeholder="Filtrer par tâche"
              {...register('filterTask')}
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
                      checked={selectedMicrotasks.length === filteredMicrotasks.length && filteredMicrotasks.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les micro-tâches"
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
                    onClick={() => sortTable('task')}
                  >
                    Tâche {sortField === 'task' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredMicrotasks.map((microtask) => (
                  <tr key={microtask.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedMicrotasks.includes(microtask.id)}
                        onChange={() => toggleSelectMicrotask(microtask.id)}
                        aria-label={`Sélectionner la micro-tâche ${microtask.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{microtask.user}</td>
                    <td className="p-2 sm:p-3">{microtask.task}</td>
                    <td className="p-2 sm:p-3">{microtask.status}</td>
                    <td className="p-2 sm:p-3">{microtask.date}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', microtask)}
                        aria-label="Valider la micro-tâche"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', microtask)}
                        aria-label="Rejeter la micro-tâche"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', microtask)}
                        aria-label="Modifier la micro-tâche"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', microtask)}
                        aria-label="Supprimer la micro-tâche"
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

      {/* Add Microtask Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter une micro-tâche</DialogTitle>
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
              <Label htmlFor="task">Tâche</Label>
              <Input
                id="task"
                {...register('task', { required: 'Tâche requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.task && <p className="text-red-500 text-xs">{errors.task.message}</p>}
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
                {...register('date', { required: 'Date requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Microtask Modal */}
      <Dialog open={modalType === 'edit' && !!selectedMicrotask} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la micro-tâche</DialogTitle>
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
              <Label htmlFor="task">Tâche</Label>
              <Input
                id="task"
                {...register('task', { required: 'Tâche requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.task && <p className="text-red-500 text-xs">{errors.task.message}</p>}
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
                {...register('date', { required: 'Date requise' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600 text-xs sm:text-sm">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Microtask Modal */}
      <Dialog open={modalType === 'delete' && !!selectedMicrotask} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer la micro-tâche</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Supprimer la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedMicrotask}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Microtask Modal */}
      <Dialog open={modalType === 'validate' && !!selectedMicrotask} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Valider la micro-tâche</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Valider la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onValidateSubmit} disabled={!selectedMicrotask}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Microtask Modal */}
      <Dialog open={modalType === 'reject' && !!selectedMicrotask} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rejeter la micro-tâche</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedMicrotask ? (
              <p>Rejeter la micro-tâche "{selectedMicrotask.task}" pour {selectedMicrotask.user} ?</p>
            ) : (
              <p>Aucune micro-tâche sélectionnée.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onRejectSubmit} disabled={!selectedMicrotask}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Microtasks Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les micro-tâches</DialogTitle>
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