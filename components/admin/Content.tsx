'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Eye, Edit, Trash, Plus, Download, Check } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  status: string;
  content: string;
  lastModified: string;
}

interface ContentProps {
  handleContentAction: (contentId: string, action: string) => void;
}

interface FormData {
  filterTitle?: string;
  filterStatus?: string;
  filterDate?: string;
  title?: string;
  status?: string;
  content?: string;
  lastModified?: string;
  exportFormat?: string;
  exportStartDate?: string;
  exportEndDate?: string;
}

export default function Content({ handleContentAction }: ContentProps) {
  const [contents, setContents] = useState<Content[]>([
    { id: 'c1', title: 'Page d\'accueil', status: 'Publiée', content: 'Contenu de la page d\'accueil', lastModified: '2025-06-25' },
    { id: 'c2', title: 'FAQ', status: 'Brouillon', content: 'Questions fréquentes', lastModified: '2025-06-24' },
  ]);
  const [filteredContents, setFilteredContents] = useState<Content[]>(contents);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'delete' | 'export' | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedContentIds, setSelectedContentIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Content | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'view' | 'delete' | 'export', content?: Content) => {
    setModalType(type);
    setSelectedContent(content || null);
    if (content && (type === 'edit' || type === 'view')) {
      setValue('title', content.title);
      setValue('status', content.status);
      setValue('content', content.content);
      setValue('lastModified', content.lastModified);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedContent(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.title && data.status && data.content) {
      const newContent: Content = {
        id: `c${contents.length + 1}`,
        title: data.title,
        status: data.status,
        content: data.content,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setContents([...contents, newContent]);
      setFilteredContents([...filteredContents, newContent]);
      handleContentAction(newContent.id, 'Ajouter');
      console.log(`Content added:`, newContent);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedContent && data.title && data.status && data.content) {
      const updatedContent = {
        ...selectedContent,
        title: data.title,
        status: data.status,
        content: data.content,
        lastModified: data.lastModified || new Date().toISOString().split('T')[0],
      };
      setContents(contents.map(c => c.id === selectedContent.id ? updatedContent : c));
      setFilteredContents(filteredContents.map(c => c.id === selectedContent.id ? updatedContent : c));
      handleContentAction(selectedContent.id, 'Modifier');
      console.log(`Content ${selectedContent.id} edited:`, updatedContent);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedContent) {
      setContents(contents.filter(c => c.id !== selectedContent.id));
      setFilteredContents(filteredContents.filter(c => c.id !== selectedContent.id));
      handleContentAction(selectedContent.id, 'Supprimer');
      console.log(`Content ${selectedContent.id} deleted`);
      closeModal();
    }
  };

  const onBulkPublish = () => {
    setContents(contents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Publiée', lastModified: new Date().toISOString().split('T')[0] } : c));
    setFilteredContents(filteredContents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Publiée', lastModified: new Date().toISOString().split('T')[0] } : c));
    selectedContentIds.forEach(id => handleContentAction(id, 'Publier'));
    console.log(`Bulk published contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onBulkArchive = () => {
    setContents(contents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Archivée', lastModified: new Date().toISOString().split('T')[0] } : c));
    setFilteredContents(filteredContents.map(c => selectedContentIds.includes(c.id) ? { ...c, status: 'Archivée', lastModified: new Date().toISOString().split('T')[0] } : c));
    selectedContentIds.forEach(id => handleContentAction(id, 'Archiver'));
    console.log(`Bulk archived contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onBulkDelete = () => {
    setContents(contents.filter(c => !selectedContentIds.includes(c.id)));
    setFilteredContents(filteredContents.filter(c => !selectedContentIds.includes(c.id)));
    selectedContentIds.forEach(id => handleContentAction(id, 'Supprimer'));
    console.log(`Bulk deleted contents:`, selectedContentIds);
    setSelectedContentIds([]);
  };

  const onExportSubmit = (data: FormData) => {
    if (data.exportFormat === 'CSV') {
      const csv = filteredContents.map(c => `${c.id},${c.title},${c.status},${c.content.replace(/,/g, '')},${c.lastModified}`).join('\n');
      const blob = new Blob([`id,title,status,content,lastModified\n${csv}`], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contents_${data.exportStartDate}_${data.exportEndDate}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.log(`Exporting contents as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    }
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...contents];
    if (data.filterTitle) {
      filtered = filtered.filter(c => c.title.toLowerCase().includes(data.filterTitle!.toLowerCase()));
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === data.filterStatus);
    }
    if (data.filterDate) {
      filtered = filtered.filter(c => c.lastModified === data.filterDate);
    }
    setFilteredContents(filtered);
  };

  const sortTable = (field: keyof Content) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredContents].sort((a, b) => {
      const aValue = a[field] || '';
      const bValue = b[field] || '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredContents(sorted);
  };

  const toggleSelectContent = (id: string) => {
    setSelectedContentIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedContentIds.length === filteredContents.length) {
      setSelectedContentIds([]);
    } else {
      setSelectedContentIds(filteredContents.map(c => c.id));
    }
  };

  return (
    <div className="p-2 sm:p-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des pages et contenus</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des contenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-500 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter un contenu"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un contenu
            </Button>
            {selectedContentIds.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkPublish}
                  aria-label="Publier les contenus sélectionnés"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Publier sélection
                </Button>
                <Button
                  className="bg-yellow-600 text-xs sm:text-sm"
                  onClick={onBulkArchive}
                  aria-label="Archiver les contenus sélectionnés"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Archiver sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkDelete}
                  aria-label="Supprimer les contenus sélectionnés"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Supprimer sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-400 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les contenus"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par titre"
              {...register('filterTitle')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
            <Select {...register('filterStatus')}>
              <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-white/20">
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Publiée">Publiée</SelectItem>
                <SelectItem value="Brouillon">Brouillon</SelectItem>
                <SelectItem value="Archivée">Archivée</SelectItem>
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
                      checked={selectedContentIds.length === filteredContents.length && filteredContents.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner tous les contenus"
                    />
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('title')}
                  >
                    Titre {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredContents.map((content) => (
                  <tr key={content.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedContentIds.includes(content.id)}
                        onChange={() => toggleSelectContent(content.id)}
                        aria-label={`Sélectionner le contenu ${content.title}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{content.title}</td>
                    <td className="p-2 sm:p-3">{content.status}</td>
                    <td className="p-2 sm:p-3">{content.lastModified}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-400 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('view', content)}
                        aria-label={`Voir le contenu ${content.title}`}
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', content)}
                        aria-label={`Modifier le contenu ${content.title}`}
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', content)}
                        aria-label={`Supprimer le contenu ${content.title}`}
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

      {/* Add Content Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ajouter un contenu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                {...register('title', { required: 'Titre requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Publiée">Publiée</SelectItem>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="Archivée">Archivée</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Input
                id="content"
                {...register('content', { required: 'Contenu requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
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

      {/* View Content Modal */}
      <Dialog open={modalType === 'view' && !!selectedContent} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Voir le contenu</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            {selectedContent ? (
              <>
                <div>
                  <Label>Titre</Label>
                  <p className="text-xs sm:text-sm">{selectedContent.title}</p>
                </div>
                <div>
                  <Label>Statut</Label>
                  <p className="text-xs sm:text-sm">{selectedContent.status}</p>
                </div>
                <div>
                  <Label>Contenu</Label>
                  <p className="text-xs sm:text-sm">{selectedContent.content}</p>
                </div>
                <div>
                  <Label>Dernière modification</Label>
                  <p className="text-xs sm:text-sm">{selectedContent.lastModified}</p>
                </div>
              </>
            ) : (
              <p>Aucun contenu sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Content Modal */}
      <Dialog open={modalType === 'edit' && !!selectedContent} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier le contenu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                {...register('title', { required: 'Titre requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20 text-xs sm:text-sm">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Publiée">Publiée</SelectItem>
                  <SelectItem value="Brouillon">Brouillon</SelectItem>
                  <SelectItem value="Archivée">Archivée</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-red-500 text-xs">{errors.status.message}</p>}
            </div>
            <div>
              <Label htmlFor="content">Contenu</Label>
              <Input
                id="content"
                {...register('content', { required: 'Contenu requis' })}
                className="bg-white/10 text-white border-white/20 text-xs sm:text-sm"
              />
              {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
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

      {/* Delete Content Modal */}
      <Dialog open={modalType === 'delete' && !!selectedContent} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Supprimer le contenu</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedContent ? (
              <p>Supprimer le contenu "{selectedContent.title}" ?</p>
            ) : (
              <p>Aucun contenu sélectionné.</p>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="text-white bg-gray-600 text-xs sm:text-sm" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600 text-xs sm:text-sm" onClick={onDeleteSubmit} disabled={!selectedContent}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Contents Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20 max-w-[95vw] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Exporter les contenus</DialogTitle>
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