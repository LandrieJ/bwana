'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Check, X } from 'lucide-react';

interface Point {
  id: string;
  user: string;
  amount: number;
  date: string;
  status: string;
}

interface PointsProps {
  points: Point[];
  handlePointAction: (pointId: string, action: string) => void;
}

interface FormData {
  filterUser?: string;
  filterDate?: string;
}

export default function Points({ points: initialPoints, handlePointAction }: PointsProps) {
  const [points, setPoints] = useState<Point[]>(initialPoints);
  const [modalType, setModalType] = useState<'validate' | 'reject' | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<Point[]>(initialPoints);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const openModal = (type: 'validate' | 'reject', point: Point) => {
    setModalType(type);
    setSelectedPoint(point);
    reset();
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedPoint(null);
    reset();
  };

  const onValidateSubmit = () => {
    if (selectedPoint) {
      setPoints(points.map(p => p.id === selectedPoint.id ? { ...p, status: 'Validé' } : p));
      setFilteredPoints(filteredPoints.map(p => p.id === selectedPoint.id ? { ...p, status: 'Validé' } : p));
      handlePointAction(selectedPoint.id, 'Valider');
      console.log(`Point ${selectedPoint.id} validated`);
      closeModal();
    }
  };

  const onRejectSubmit = () => {
    if (selectedPoint) {
      setPoints(points.map(p => p.id === selectedPoint.id ? { ...p, status: 'Rejeté' } : p));
      setFilteredPoints(filteredPoints.map(p => p.id === selectedPoint.id ? { ...p, status: 'Rejeté' } : p));
      handlePointAction(selectedPoint.id, 'Rejeter');
      console.log(`Point ${selectedPoint.id} rejected`);
      closeModal();
    }
  };

  const onFilterSubmit = (data: FormData) => {
    let filtered = [...points];
    if (data.filterUser) {
      filtered = filtered.filter(p => p.user.toLowerCase().includes(data.filterUser!.toLowerCase()));
    }
    if (data.filterDate) {
      filtered = filtered.filter(p => p.date === data.filterDate);
    }
    setFilteredPoints(filtered);
  };

  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Gestion des points</h2>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Liste des points</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onFilterSubmit)} className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="text"
              placeholder="Filtrer par utilisateur"
              {...register('filterUser')}
              className="p-2 rounded-lg bg-white/10 text-white border-white/20 text-xs sm:text-sm"
            />
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
                  <th className="p-2 sm:p-3 text-left">Utilisateur</th>
                  <th className="p-2 sm:p-3 text-left">Montant</th>
                  <th className="p-2 sm:p-3 text-left">Date</th>
                  <th className="p-2 sm:p-3 text-left">Statut</th>
                  <th className="p-2 sm:p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPoints.map((point) => (
                  <tr key={point.id} className="border-b border-white/10">
                    <td className="p-2 sm:p-3">{point.user}</td>
                    <td className="p-2 sm:p-3">{point.amount} points</td>
                    <td className="p-2 sm:p-3">{point.date}</td>
                    <td className="p-2 sm:p-3">{point.status}</td>
                    <td className="p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-green-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('validate', point)}
                        aria-label="Valider les points"
                      >
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-white bg-red-600 border-white/20 hover:bg-white/20 text-xs sm:text-sm"
                        onClick={() => openModal('reject', point)}
                        aria-label="Rejeter les points"
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
      <Dialog open={modalType === 'validate' && !!selectedPoint} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Valider les points</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Valider {selectedPoint?.amount} points pour {selectedPoint?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onValidateSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={modalType === 'reject' && !!selectedPoint} onOpenChange={closeModal}>
        <DialogContent className="bg-gray-800 text-white border-white/20">
          <DialogHeader>
            <DialogTitle>Rejeter les points</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p>Rejeter {selectedPoint?.amount} points pour {selectedPoint?.user} ?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" className="text-white bg-gray-600" onClick={closeModal}>Annuler</Button>
            <Button className="bg-blue-600" onClick={onRejectSubmit}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}