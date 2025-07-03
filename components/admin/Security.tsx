'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Trash, Download, Check } from 'lucide-react';

interface SecurityLog {
  id: string;
  event: string;
  user: string;
  date: string;
  status: string;
  details: string;
}

interface SecurityProps {
  handleSecurityAction: (securityId: string, action: string) => void;
}

interface FormData {
  filterEvent?: string;
  filterUser?: string;
  filterStatus?: string;
  filterDate?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Security({ handleSecurityAction }: SecurityProps) {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    { id: 's1', event: 'Tentative de connexion', user: 'Admin 1', date: '2025-06-25', status: 'Échec', details: 'Connexion échouée avec mot de passe incorrect' },
    { id: 's2', event: 'Modification de mot de passe', user: 'Admin 2', date: '2025-06-24', status: 'Succès', details: 'Mot de passe modifié avec succès' },
  ]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>(securityLogs);
  const [modalType, setModalType] = useState<'view' | 'export' | 'delete' | null>(null);
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof SecurityLog | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const openModal = (type: 'view' | 'export' | 'delete', log?: SecurityLog) => {
    setModalType(type);
    setSelectedLog(log || null);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedLog(null);
    reset();
  };

  const onDeleteSubmit = () => {
    if (selectedLog) {
      setSecurityLogs(securityLogs.filter(l => l.id !== selectedLog.id));
      setFilteredLogs(filteredLogs.filter(l => l.id !== selectedLog.id));
      handleSecurityAction(selectedLog.id, 'Supprimer');
      console.log(`Log ${selectedLog.id} deleted`);
      closeModal();
    }
  };

  const onBulkDelete = () => {
    setSecurityLogs(securityLogs.filter(l => !selectedLogIds.includes(l.id)));
    setFilteredLogs(filteredLogs.filter(l => !selectedLogIds.includes(l.id)));
    selectedLogIds.forEach(id => handleSecurityAction(id, 'Supprimer'));
    console.log(`Bulk deleted logs:`, selectedLogIds);
    setSelectedLogIds([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredLogs.map(l => `${l.id},${l.event},${l.user},${l.date},${l.status},${l.details.replace(/,/g, '')}`).join('\n');
      const blob = new Blob([`id,event,user,date,status,details\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_logs_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting logs as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...securityLogs];
    if (data.filterEvent) {
      filtered = filtered.filter(l => l.event.toLowerCase().includes(data.filterEvent!.toLowerCase()));
    }
    if (data.filterUser) {
      filtered = filtered.filter(l => l.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(l => l.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(l => l.date === data.filterDate);
    }
    setFilteredLogs(filtered);
  };

  const sortTable = (field: keyof SecurityLog) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredLogs].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredLogs(sorted);
  };

  const toggleSelectLog = (id: string) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLogIds.length === filteredLogs.length) {
      setSelectedLogIds([]);
    } else {
      setSelectedLogIds(filteredLogs.map(l => l.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion de la sécurité</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Journaux de sécurité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            {selectedLogIds.length > 0 && (
              <Button
                className="bg-red-600 text-xs sm:text-sm"
                onClick={onBulkDelete}
                aria-label="Supprimer les journaux sélectionnés"
              >
                <Trash className="w-4 h-4 mr-2" />
                Supprimer sélection
              </Button>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les journaux"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par événement"
              {...register('filterEvent')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Succès">Succès</SelectItem>
                <SelectItem value="Échec">Échec</SelectItem>
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
                      checked={selectedLogIds.length === filteredLogs.length && filteredLogs.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les journaux"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('event')}
                  >
                    Événement {sortField === 'event' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('user')}
                  >
                    Utilisateur {sortField === 'user' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedLogIds.includes(log.id)}
                        onChange={() => toggleSelectLog(log.id)}
                        aria-label={`Sélectionner le journal ${log.event}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{log.event}</td>
                    <td className="p-2 sm:p-3">{log.user}</td>
                    <td className="p-2 sm:p-3">{log.date}</td>
                    <td className="p-2 sm:p-3">{log.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('view', log)}
                        aria-label={`Voir le journal ${log.event}`}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', log)}
                        aria-label={`Supprimer le journal ${log.event}`}
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

      {/* View Log Modal */}
      <Dialog open={modalType === 'view' && !!selectedLog} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Voir le journal</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            {selectedLog ? (
              <>
                <div>
                  <Label>Événement</Label>
                  <p className="text-xs sm:text-sm">{selectedLog.event}</p>
                </div>
                <div>
                  <Label>Utilisateur</Label>
                  <p className="text-xs sm:text-sm">{selectedLog.user}</p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-xs sm:text-sm">{selectedLog.date}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <p className="text-xs sm:text-sm">{selectedLog.status}</p>
                </div>
                <div>
                  <Label>Détails</Label>
                  <p className="text-xs sm:text-sm">{selectedLog.details}</p>
                </div>
              </>
            ) : (
              <p>Aucun journal sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Log Modal */}
      <Dialog open={modalType === 'delete' && !!selectedLog} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer le journal</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedLog ? (
              <p>Supprimer le journal "{selectedLog.event}" de {selectedLog.user} ({selectedLog.date}) ?</p>
            ) : (
              <p>Aucun journal sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedLog}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Logs Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les journaux</DialogTitle>
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