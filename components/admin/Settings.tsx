'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { Check, Edit, Trash, Plus, Download } from 'lucide-react';

interface Setting {
  id: string;
  name: string;
  value: boolean;
  description?: string;
  lastModified: string;
}

interface SettingsProps {
  handleSettingUpdate: (setting: string, value: boolean) => void;
}

interface FormData {
  filterName?: string;
  filterStatus?: string;
  name?: string;
  value?: boolean;
  description?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Settings({ handleSettingUpdate }: SettingsProps) {
  const [settings, setSettings] = useState<Setting[]>([
    { id: 'notifications', name: 'Activer les notifications', value: false, description: 'Envoie des notifications aux utilisateurs', lastModified: new Date().toISOString().split('T')[0] },
    { id: 'autoDeposits', name: 'Autoriser les dépôts automatiques', value: false, description: 'Permet les dépôts sans validation manuelle', lastModified: new Date().toISOString().split('T')[0] },
    { id: 'twoFactorAuth', name: 'Activer la 2FA pour les admins', value: false, description: 'Sécurise les comptes admin avec 2FA', lastModified: new Date().toISOString().split('T')[0] },
  ]);
  const [filteredSettings, setFilteredSettings] = useState<Setting[]>(settings);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'reset' | 'export' | null>(null);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [selectedSettingsIds, setSelectedSettingsIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Setting | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'reset' | 'export', setting?: Setting) => {
    setModalType(type);
    setSelectedSetting(setting || null);
    if (setting && type === 'edit') {
      setValue('name', setting.name);
      setValue('value', setting.value);
      setValue('description', setting.description || '');
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSetting(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.name) {
      const newSetting: Setting = {
        id: `setting${settings.length + 1}`,
        name: data.name,
        value: data.value ?? false,
        description: data.description,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings([...settings, newSetting]);
      setFilteredSettings([...filteredSettings, newSetting]);
      handleSettingUpdate(newSetting.id, newSetting.value);
      console.log(`Setting added:`, newSetting);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedSetting && data.name) {
      const updatedSetting = {
        ...selectedSetting,
        name: data.name,
        value: data.value ?? selectedSetting.value,
        description: data.description,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings(settings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      setFilteredSettings(filteredSettings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      handleSettingUpdate(selectedSetting.id, updatedSetting.value);
      console.log(`Setting ${selectedSetting.id} edited:`, updatedSetting);
      closeModal();
    }
  };

  const onResetSubmit = () => {
    if (selectedSetting) {
      const updatedSetting = {
        ...selectedSetting,
        value: false,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setSettings(settings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      setFilteredSettings(filteredSettings.map(s => s.id === selectedSetting.id ? updatedSetting : s));
      handleSettingUpdate(selectedSetting.id, updatedSetting.value);
      console.log(`Setting ${selectedSetting.id} reset to default`);
      closeModal();
    }
  };

  const onBulkEnable = () => {
    setSettings(settings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: true, lastModified: new Date().toISOString().split('T')[0] } : s));
    setFilteredSettings(filteredSettings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: true, lastModified: new Date().toISOString().split('T')[0] } : s));
    selectedSettingsIds.forEach(id => handleSettingUpdate(id, true));
    console.log(`Bulk enabled settings:`, selectedSettingsIds);
    setSelectedSettingsIds([]);
  };

  const onBulkDisable = () => {
    setSettings(settings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: false, lastModified: new Date().toISOString().split('T')[0] } : s));
    setFilteredSettings(filteredSettings.map(s => selectedSettingsIds.includes(s.id) ? { ...s, value: false, lastModified: new Date().toISOString().split('T')[0] } : s));
    selectedSettingsIds.forEach(id => handleSettingUpdate(id, false));
    console.log(`Bulk disabled settings:`, selectedSettingsIds);
    setSelectedSettingsIds([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredSettings.map(s => `${s.id},${s.name},${s.value},${s.description || ''},${s.lastModified}`).join('\n');
      const blob = new Blob([`id,name,value,description,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `settings_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting settings as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...settings];
    if (data.filterName) {
      filtered = filtered.filter(s => s.name.toLowerCase().includes(data.filterName!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(s => s.value === (data.filterStatus === 'enabled'));
    }
    setFilteredSettings(filtered);
  };

  const sortTable = (field: keyof Setting) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredSettings].sort((a, b) => {
      const aValue = field === 'value' ? a[field] : a[field] || '';
      const bValue = field === 'value' ? b[field] : b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredSettings(sorted);
  };

  const toggleSelectSetting = (id: string) => {
    setSelectedSettingsIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSettingsIds.length === filteredSettings.length) {
      setSelectedSettingsIds([]);
    } else {
      setSelectedSettingsIds(filteredSettings.map(s => s.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Réglages système</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Paramètres système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-600 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter un paramètre"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un paramètre
            </Button>
            {selectedSettingsIds.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkEnable}
                  aria-label="Activer les paramètres sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Activer sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkDisable}
                  aria-label="Désactiver les paramètres sélectionnés"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Désactiver sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les paramètres"
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
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="enabled">Activé</SelectItem>
                <SelectItem value="disabled">Désactivé</SelectItem>
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
                      checked={selectedSettingsIds.length === filteredSettings.length && filteredSettings.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les paramètres"
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
                    onClick={() => sortTable('value')}
                  >
                    Statut {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-3 text-left">Description</th>
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
                {filteredSettings.map((setting) => (
                  <tr key={setting.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedSettingsIds.includes(setting.id)}
                        onChange={() => toggleSelectSetting(setting.id)}
                        aria-label={`Sélectionner le paramètre ${setting.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{setting.name}</td>
                    <td className="p-2 sm:p-3">
                      <Switch
                        checked={setting.value}
                        onCheckedChange={(checked) => {
                          const updatedSetting = { ...setting, value: checked, lastModified: new Date().toISOString().split('T')[0] };
                          setSettings(settings.map(s => s.id === setting.id ? updatedSetting : s));
                          setFilteredSettings(filteredSettings.map(s => s.id === setting.id ? updatedSetting : s));
                          handleSettingUpdate(setting.id, checked);
                          console.log(`Setting ${setting.id} updated to ${checked}`);
                        }}
                        aria-label={`Activer/Désactiver ${setting.name}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{setting.description || '-'}</td>
                    <td className="p-2 sm:p-3">{setting.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', setting)}
                        aria-label={`Modifier le paramètre ${setting.name}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reset', setting)}
                        aria-label={`Réinitialiser le paramètre ${setting.name}`}
                      >
                        <Trash className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Réinitialiser
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Setting Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un paramètre</DialogTitle>
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
              <Label htmlFor="value">Statut</Label>
              <Switch
                {...register('value')}
                onCheckedChange={(checked) => setValue('value', checked)}
                aria-label="Activer/Désactiver le nouveau paramètre"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
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

      {/* Edit Setting Modal */}
      <Dialog open={modalType === 'edit' && !!selectedSetting} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le paramètre</DialogTitle>
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
              <Label htmlFor="value">Statut</Label>
              <Switch
                {...register('value')}
                onCheckedChange={(checked) => setValue('value', checked)}
                defaultChecked={selectedSetting?.value}
                aria-label="Activer/Désactiver le paramètre"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                {...register('description')}
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

      {/* Reset Setting Modal */}
      <Dialog open={modalType === 'reset' && !!selectedSetting} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Réinitialiser le paramètre</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedSetting ? (
              <p>Réinitialiser le paramètre "{selectedSetting.name}" à sa valeur par défaut (Désactivé) ?</p>
            ) : (
              <p>Aucun paramètre sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onResetSubmit} disabled={!selectedSetting}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Settings Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les paramètres</DialogTitle>
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