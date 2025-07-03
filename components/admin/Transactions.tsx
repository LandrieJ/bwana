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

interface Transaction {
  id: string;
  user: string;
  type: string;
  amount: number;
  date: string;
  status: string;
}

interface TransactionsProps {
  transactions: Transaction[];
  handleTransactionAction: (transactionId: string, action: string) => void;
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

export default function Transactions({ transactions: initialTransactions, handleTransactionAction }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(initialTransactions);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export' | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();

  const openModal = (type: 'add' | 'edit' | 'delete' | 'validate' | 'reject' | 'export', transaction?: Transaction) => {
    setModalType(type);
    setSelectedTransaction(transaction || null);
    if (transaction && type === 'edit') {
      setValue('user', transaction.user);
      setValue('type', transaction.type);
      setValue('amount', transaction.amount);
      setValue('date', transaction.date);
      setValue('status', transaction.status);
    }
    reset(type !== 'edit' ? {} : undefined);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedTransaction(null);
    reset();
  };

  const onAddSubmit = (data: FormData) => {
    if (data.user && data.type && data.amount && data.date && data.status) {
      const newTransaction: Transaction = {
        id: `txn${transactions.length + 1}`,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setTransactions([...transactions, newTransaction]);
      setFilteredTransactions([...filteredTransactions, newTransaction]);
      handleTransactionAction(newTransaction.id, 'Ajouter');
      console.log(`Transaction added:`, newTransaction);
      closeModal();
    }
  };

  const onEditSubmit = (data: FormData) => {
    if (selectedTransaction && data.user && data.type && data.amount && data.date && data.status) {
      const updatedTransaction = {
        ...selectedTransaction,
        user: data.user,
        type: data.type,
        amount: Number(data.amount),
        date: data.date,
        status: data.status,
      };
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t));
      handleTransactionAction(selectedTransaction.id, 'Modifier');
      console.log(`Transaction ${selectedTransaction.id} edited:`, updatedTransaction);
      closeModal();
    }
  };

  const onDeleteSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
      setFilteredTransactions(filteredTransactions.filter(t => t.id !== selectedTransaction.id));
      handleTransactionAction(selectedTransaction.id, 'Supprimer');
      console.log(`Transaction ${selectedTransaction.id} deleted`);
      closeModal();
    }
  };

  const onValidateSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Validé' } : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Validé' } : t));
      handleTransactionAction(selectedTransaction.id, 'Valider');
      console.log(`Transaction ${selectedTransaction.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedTransaction) {
      setTransactions(transactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Rejeté' } : t));
      setFilteredTransactions(filteredTransactions.map(t => t.id === selectedTransaction.id ? { ...t, status: 'Rejeté' } : t));
      handleTransactionAction(selectedTransaction.id, 'Rejeter');
      console.log(`Transaction ${selectedTransaction.id} rejected`);
      closeModal();
    }
  };

  const onBulkValidate = () => {
    setTransactions(transactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Validé' } : t));
    setFilteredTransactions(filteredTransactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Validé' } : t));
    selectedTransactions.forEach(id => handleTransactionAction(id, 'Valider'));
    console.log(`Bulk validated transactions:`, selectedTransactions);
    setSelectedTransactions([]);
  };

  const onBulkReject = () => {
    setTransactions(transactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    setFilteredTransactions(filteredTransactions.map(t => selectedTransactions.includes(t.id) ? { ...t, status: 'Rejeté' } : t));
    selectedTransactions.forEach(id => handleTransactionAction(id, 'Rejeter'));
    console.log(`Bulk rejected transactions:`, selectedTransactions);
    setSelectedTransactions([]);
  };

  const onExportSubmit = (data: FormData) => {
    console.log(`Exporting transactions as ${data.exportFormat} from ${data.exportStartDate} to ${data.exportEndDate}`);
    closeModal();
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...transactions];
    if (data.filterUser) {
      filtered = filtered.filter(t => t.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterType && data.filterType !== 'all') {
      filtered = filtered.filter(t => t.type === data.filterType);
    }
    if (data.filterDate) {
      filtered = filtered.filter(t => t.date === data.filterDate);
    }
    if (data.filterStatus && data.filterStatus !== 'all') {
      filtered = filtered.filter(t => t.status === data.filterStatus);
    }
    setFilteredTransactions(filtered);
  };

  const sortTable = (field: keyof Transaction) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    const sorted = [...filteredTransactions].sort((a, b) => {
      const aValue = field === 'amount' ? a[field] : a[field];
      const bValue = field === 'amount' ? b[field] : b[field];
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setFilteredTransactions(sorted);
  };

  const toggleSelectTransaction = (id: string) => {
    setSelectedTransactions(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id));
    }
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des transactions</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-green-600 text-xs sm:text-sm"
              onClick={() => openModal('add')}
              aria-label="Ajouter une transaction"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une transaction
            </Button>
            {selectedTransactions.length > 0 && (
              <>
                <Button
                  className="bg-blue-600 text-xs sm:text-sm"
                  onClick={onBulkValidate}
                  aria-label="Valider les transactions sélectionnées"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Valider sélection
                </Button>
                <Button
                  className="bg-red-600 text-xs sm:text-sm"
                  onClick={onBulkReject}
                  aria-label="Rejeter les transactions sélectionnées"
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter sélection
                </Button>
              </>
            )}
            <Button
              className="bg-yellow-600 text-xs sm:text-sm"
              onClick={() => openModal('export')}
              aria-label="Exporter les transactions"
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
                <SelectItem value="Dépôt">Dépôt</SelectItem>
                <SelectItem value="Retrait">Retrait</SelectItem>
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
                      checked={selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0}
                      onChange={toggleSelectAll}
                      aria-label="Sélectionner toutes les transactions"
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
                    onClick={() => sortTable('type')}
                  >
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-3 text-left cursor-pointer"
                    onClick={() => sortTable('amount')}
                  >
                    Montant {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
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
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => toggleSelectTransaction(transaction.id)}
                        aria-label={`Sélectionner la transaction ${transaction.id}`}
                      />
                    </td>
                    <td className="p-2 sm:p-3">{transaction.user}</td>
                    <td className="p-2 sm:p-3">{transaction.type}</td>
                    <td className="p-2 sm:p-3">{transaction.amount.toLocaleString()} Ar</td>
                    <td className="p-2 sm:p-3">{transaction.date}</td>
                    <td className="p-2 sm:p-3">{transaction.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', transaction)}
                        aria-label="Valider la transaction"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', transaction)}
                        aria-label="Rejeter la transaction"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Rejeter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-blue-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('edit', transaction)}
                        aria-label="Modifier la transaction"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-yellow-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('delete', transaction)}
                        aria-label="Supprimer la transaction"
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

      {/* Add Transaction Modal */}
      <Dialog open={modalType === 'add'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Ajouter une transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onAddSubmit)} className="p-4 space-y-4">
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
              <Label htmlFor="type">Type</Label>
              <Select {...register('type', { required: 'Type requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Dépôt">Dépôt</SelectItem>
                  <SelectItem value="Retrait">Retrait</SelectItem>
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
                className="bg-white/10 text-white border-white/20"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
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
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
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
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Modal */}
      <Dialog open={modalType === 'edit' && !!selectedTransaction} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Modifier la transaction</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="p-4 space-y-4">
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
              <Label htmlFor="type">Type</Label>
              <Select {...register('type', { required: 'Type requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-white/20">
                  <SelectItem value="Dépôt">Dépôt</SelectItem>
                  <SelectItem value="Retrait">Retrait</SelectItem>
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
                className="bg-white/10 text-white border-white/20"
              />
              {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
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
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status', { required: 'Statut requis' })}>
                <SelectTrigger className="bg-white/10 text-white border-white/20">
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
            <DialogFooter>
              <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
              <Button type="submit" className="bg-blue-600">Confirmer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Transaction Modal */}
      <Dialog open={modalType === 'delete' && !!selectedTransaction} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Supprimer la transaction</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedTransaction ? (
              <p>Supprimer la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
            ) : (
              <p>Aucune transaction sélectionnée.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onDeleteSubmit} disabled={!selectedTransaction}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Validate Transaction Modal */}
      <Dialog open={modalType === 'validate' && !!selectedTransaction} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Valider la transaction</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedTransaction ? (
              <p>Valider la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
            ) : (
              <p>Aucune transaction sélectionnée.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onValidateSubmit} disabled={!selectedTransaction}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Transaction Modal */}
      <Dialog open={modalType === 'reject' && !!selectedTransaction} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Rejeter la transaction</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {selectedTransaction ? (
              <p>Rejeter la transaction de {selectedTransaction.amount.toLocaleString()} Ar pour {selectedTransaction.user} ?</p>
            ) : (
              <p>Aucune transaction sélectionnée.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onRejectSubmit} disabled={!selectedTransaction}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Transactions Modal */}
      <Dialog open={modalType === 'export'} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Exporter les transactions</DialogTitle>
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