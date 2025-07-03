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

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastModified: string;
}

interface AdminsProps {
  admins: Admin[];
  handleAdminAction: (adminId: string, action: string) => void;
}

interface FormData {
  filterName?: string;
  filterRole?: string;
  filterStatus?: string;
  filterDate?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  lastModified?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Admins({ admins: initialAdmins, handleAdminAction }: AdminsProps) {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins.map(admin => ({
    ...admin,
    email: admin.email || `${admin.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    lastModified: admin.lastModified || new Date().toISOString().split('T')[0],
  })));
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>(admins);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'export' | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Admin | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'export', admin?: Admin) => {
    setModalType(type);
    setSelectedAdmin(admin || null);
    if (admin && type === 'edit') {
      setValue('name', admin.name);
      setValue('email', admin.email);
      setValue('role', admin.role);
      setValue('status', admin.status);
      setValue('lastModified', admin.lastModified);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAdmin(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.name && data.email && data.role && data.status) {
      const newAdmin: Admin = {
        id: `a${admins.length + 1}`,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setAdmins([...admins, newAdmin]);
      setFilteredAdmins([...filteredAdmins, newAdmin]);
      handleAdminAction(newAdmin.id, 'Ajouter');
      console.log(`Admin added:`, newAdmin);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedAdmin && data.name && data.email && data.role && data.status) {
      const updatedAdmin = {
        ...selectedAdmin,
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setAdmins(admins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
      setFilteredAdmins(filteredAdmins.map(a => a.id === selectedAdmin.id ? updatedAdmin : a));
      handleAdminAction(selectedAdmin.id, 'Modifier');
      console.log(`Admin ${selectedAdmin.id} edited:`, updatedAdmin);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedAdmin) {
      setAdmins(admins.filter(a => a.id !== selectedAdmin.id));
      setFilteredAdmins(filteredAdmins.filter(a => a.id !== selectedAdmin.id));
      handleAdminAction(selectedAdmin.id, 'Supprimer');
      console.log(`Admin ${selectedAdmin.id} deleted`);
      closeModal();
    }
  };

  const onBulkActivate = () => {
    setAdmins(admins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Actif', lastModified: new Date().toISOString().split('T')[0] } : a));
    setFilteredAdmins(filteredAdmins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Actif', lastModified: new Date().toISOString().split('T')[0] } : a));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Activer'));
    console.log(`Bulk activated admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onBulkDeactivate = () => {
    setAdmins(admins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Inactif', lastModified: new Date().toISOString().split('T')[0] } : a));
    setFilteredAdmins(filteredAdmins.map(a => selectedAdminIds.includes(a.id) ? { ...a, status: 'Inactif', lastModified: new Date().toISOString().split('T')[0] } : a));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Désactiver'));
    console.log(`Bulk deactivated admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onBulkDelete = () => {
    setAdmins(admins.filter(a => !selectedAdminIds.includes(a.id)));
    setFilteredAdmins(filteredAdmins.filter(a => !selectedAdminIds.includes(a.id)));
    selectedAdminIds.forEach(id => handleAdminAction(id, 'Supprimer'));
    console.log(`Bulk deleted admins:`, selectedAdminIds);
    setSelectedAdminIds([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredAdmins.map(a => `${a.id},${a.name},${a.email},${a.role},${a.status},${a.lastModified}`).join('\n');
      const blob = new Blob([`id,name,email,role,status,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `admins_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting admins as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...admins];
    if (data.filterName) {
      filtered = filtered.filter(a => a.name.toLowerCase().includes(data.filterName!.toLowerCase()));
    }
    if (data.filterRole) {
      filtered = filtered.filter(a => a.role.toLowerCase().includes(data.filterRole!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(a => a.lastModified === data.filterDate);
    }
    setFilteredAdmins(filtered);
  };

  const sortTable = (field: keyof Admin) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredAdmins].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredAdmins(sorted);
  };

  const toggleSelectAdmin = (id: string) => {
    setSelectedAdminIds(prev =>
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedAdminIds.length === filteredAdmins.length) {
      setSelectedAdminIds([]);
    } else {
      setSelectedAdminIds(filteredAdmins.map(a => a.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion multi-admin</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des administrateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-500 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter un administrateur"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un administrateur
            </Button>
            {selectedAdminIds.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkActivate}
                  aria-label="Activer les administrateurs sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Activer sélection
                </Button>
                <Button
                  className="bg-yellow-600 text-xs sm:text-sm"
                  onClick={onBulkDeactivate}
                  aria-label="Désactiver les administrateurs sélectionnés"
                >
                  <X className="w-4 h-4 mr-2" />
                  Désactiver sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkDelete}
                  aria-label="Supprimer les administrateurs sélectionnés"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Supprimer sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-400 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les administrateurs"
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
              type="text"
              placeholder="Filtrer par rôle"
              {...register('filterRole')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Actif">Actif</SelectItem>
                <SelectItem value="Inactif">Inactif</SelectItem>
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
                      checked={selectedAdminIds.length === filteredAdmins.length && filteredAdmins.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les administrateurs"
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
                    onClick={() => sortTable('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('role')}
                  >
                    Rôle {sortField === 'role' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('status')}
                  >
                    Statut {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('lastModified')}
                  >
                    Dernière modification {sortField === 'lastModified' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedAdminIds.includes(admin.id)}
                        onChange={() => toggleSelectAdmin(admin.id)}
                        aria-label={`Sélectionner l'administrateur ${admin.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{admin.name}</td>
                    <td className="p-2 sm:p-3">{admin.email}</td>
                    <td className="p-2 sm:p-3">{admin.role}</td>
                    <td className="p-2 sm:p-3">{admin.status}</td>
                    <td className="p-2 sm:p-3">{admin.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-500 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => handleAdminAction(admin.id, admin.status === 'Actif' ? 'Désactiver' : 'Activer')}
                        aria-label={admin.status === 'Actif' ? `Désactiver l'administrateur ${admin.name}` : `Activer l'administrateur ${admin.name}`}
                      >
                        {admin.status === 'Actif' ? <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> : <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />}
                        {admin.status === 'Actif' ? 'Désactiver' : 'Activer'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', admin)}
                        aria-label={`Modifier l'administrateur ${admin.name}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', admin)}
                        aria-label={`Supprimer l'administrateur ${admin.name}`}
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

      {/* Add Admin Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un administrateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select {...register('role', { required: 'Rôle requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Modérateur">Modérateur</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastModified">Dernière modification</Label>
              <Input
                id="lastModified"
                type="date"
                {...register('lastModified')}
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

      {/* Edit Admin Modal */}
      <Dialog open={modalType === 'edit' && !!selectedAdmin} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l'administrateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                {...register('name', { required: 'Nom requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email requis', pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' } })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select {...register('role', { required: 'Rôle requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Modérateur">Modérateur</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastModified">Dernière modification</Label>
              <Input
                id="lastModified"
                type="date"
                {...register('lastModified')}
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

      {/* Delete Admin Modal */}
      <Dialog open={modalType === 'delete' && !!selectedAdmin} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer l'administrateur</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedAdmin ? (
              <p>Supprimer l'administrateur "{selectedAdmin.name}" ({selectedAdmin.email}) ?</p>
            ) : (
              <p>Aucun administrateur sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedAdmin}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Admins Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les administrateurs</DialogTitle>
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