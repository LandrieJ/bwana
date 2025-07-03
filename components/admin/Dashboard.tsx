'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6">Tableau de bord</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <h3 className="text-white/80 text-xs sm:text-sm md:text-base">Utilisateurs totaux</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">1,247</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <h3 className="text-white/80 text-xs sm:text-sm md:text-base">Dépôts validés</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">1.5M Ar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <h3 className="text-white/80 text-xs sm:text-sm md:text-base">Retraits effectués</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-400">0.8M Ar</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="text-center">
              <h3 className="text-white/80 text-xs sm:text-sm md:text-base">Plans actifs</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-400">856</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-sm sm:text-lg md:text-xl">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
              <span className="text-white text-xs sm:text-sm">Nouveau dépôt en attente - 50,000 Ar</span>
              <span className="text-yellow-400 text-xs">Il y a 5 min</span>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
              <span className="text-white text-xs sm:text-sm">Retrait validé - 25,000 Ar</span>
              <span className="text-green-400 text-xs">Il y a 12 min</span>
            </div>
            <div className="flex justify-between items-center p-2 sm:p-3 bg-white/5 rounded-lg">
              <span className="text-white text-xs sm:text-sm">Nouvel investissement BURGER 2</span>
              <span className="text-blue-400 text-xs">Il y a 1 heure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}