'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Play, 
  CheckCircle,
  Clock,
  Eye,
  Upload,
  Coins,
  Users,
  Sparkles,
  Timer,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Mission {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'like' | 'subscribe' | 'watch' | 'follow' | 'register';
  points: number;
  maxExecutors: number;
  currentExecutors: number;
  creatorId: string;
  status: 'active' | 'completed' | 'paused';
  validationType: 'manual' | 'automatic';
  createdAt: string;
}

interface TaskExecution {
  id: string;
  missionId: string;
  executorId: string;
  status: 'pending' | 'validated' | 'rejected';
  proofUrl?: string;
  submittedAt: string;
}

const SAMPLE_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Like vidéo YouTube',
    description: 'Liker cette vidéo YouTube sur les burgers McDonald\'s',
    url: 'https://youtube.com/watch?v=example',
    type: 'like',
    points: 1,
    maxExecutors: 100,
    currentExecutors: 45,
    creatorId: 'user123',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T10:00:00Z'
  },
  {
    id: '2',
    title: 'S\'abonner à la chaîne',
    description: 'S\'abonner à notre chaîne YouTube officielle',
    url: 'https://youtube.com/channel/example',
    type: 'subscribe',
    points: 2,
    maxExecutors: 50,
    currentExecutors: 12,
    creatorId: 'user456',
    status: 'active',
    validationType: 'manual',
    createdAt: '2025-06-25T09:30:00Z'
  }
];

export default function MicrotasksPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'execute' | 'validate'>('create');
  const [userPoints, setUserPoints] = useState(150);
  const [myMissions, setMyMissions] = useState(3);
  const [missions] = useState(SAMPLE_MISSIONS);
  const [isExecuting, setIsExecuting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  
  const [newMission, setNewMission] = useState({
    title: '',
    url: '',
    type: 'like' as const,
    maxExecutors: '',
    points: '',
    description: '',
    validationType: 'manual' as const
  });

  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, timer]);

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalCost = parseInt(newMission.points) * parseInt(newMission.maxExecutors);
    if (totalCost > userPoints) {
      toast.error('Points insuffisants pour créer cette mission');
      return;
    }

    // Simulation de création
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUserPoints(prev => prev - totalCost);
    setMyMissions(prev => prev + 1);
    
    toast.success('Mission créée avec succès !');
    
    // Reset form
    setNewMission({
      title: '',
      url: '',
      type: 'like',
      maxExecutors: '',
      points: '',
      description: '',
      validationType: 'manual'
    });
  };

  const handleExecuteMission = (mission: Mission) => {
    setSelectedMission(mission);
    setTimer(15);
    setIsExecuting(true);
  };

  const handleSubmitProof = async () => {
    if (!proofFile) {
      toast.error('Veuillez télécharger une capture d\'écran');
      return;
    }

    if (timer > 0) {
      toast.error('Veuillez attendre la fin du timer');
      return;
    }

    // Simulation de soumission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Mission soumise pour validation !');
    setIsExecuting(false);
    setSelectedMission(null);
    setProofFile(null);
    setTimer(0);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      like: 'Like',
      subscribe: 'S\'abonner',
      watch: 'Regarder',
      follow: 'Suivre',
      register: 'S\'inscrire'
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-emerald-900 animate-gradient"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="w-2 h-2 text-emerald-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-emerald-400 hover:bg-emerald-600/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-emerald-400 mb-4 text-glow">MICRO-TÂCHES</h1>
              <div className="absolute -top-2 -right-8">
                <Target className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-lg animate-shimmer">Créer et Exécuter des Missions</p>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 gap-4 mb-6 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-bounce" />
                <p className="text-emerald-400 text-sm">Mes Points</p>
                <p className="text-2xl font-bold text-white">{userPoints}</p>
              </CardContent>
            </Card>
            
            <Card className="glass-dark border-emerald-500/20">
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-float" />
                <p className="text-emerald-400 text-sm">Mes Missions</p>
                <p className="text-2xl font-bold text-white">{myMissions}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card className={`glass-dark border-emerald-500/20 mb-6 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === 'create' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('create')}
                  className={`btn-animated ${
                    activeTab === 'create' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer
                </Button>
                <Button
                  variant={activeTab === 'execute' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('execute')}
                  className={`btn-animated ${
                    activeTab === 'execute' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Exécuter
                </Button>
                <Button
                  variant={activeTab === 'validate' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('validate')}
                  className={`btn-animated ${
                    activeTab === 'validate' 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/20'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Valider
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Mission Tab */}
          {activeTab === 'create' && (
            <Card className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <CardTitle className="text-emerald-400">Créer une Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMission} className="space-y-6">
                  <div>
                    <Label className="text-white">Titre de la mission</Label>
                    <Input
                      placeholder="Ex: Liker ma vidéo YouTube"
                      value={newMission.title}
                      onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">Lien à promouvoir</Label>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      value={newMission.url}
                      onChange={(e) => setNewMission({...newMission, url: e.target.value})}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">Type de mission</Label>
                    <Select value={newMission.type} onValueChange={(value: any) => setNewMission({...newMission, type: value})}>
                      <SelectTrigger className="glass border-emerald-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark">
                        <SelectItem value="like" className="text-white hover:bg-white/20">Like</SelectItem>
                        <SelectItem value="subscribe" className="text-white hover:bg-white/20">S'abonner</SelectItem>
                        <SelectItem value="watch" className="text-white hover:bg-white/20">Regarder une vidéo</SelectItem>
                        <SelectItem value="follow" className="text-white hover:bg-white/20">Suivre une page</SelectItem>
                        <SelectItem value="register" className="text-white hover:bg-white/20">S'inscrire sur un site</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Nombre d'exécutants</Label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={newMission.maxExecutors}
                        onChange={(e) => setNewMission({...newMission, maxExecutors: e.target.value})}
                        className="glass border-emerald-500/30 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label className="text-white">Points par exécutant</Label>
                      <Input
                        type="number"
                        placeholder="1"
                        value={newMission.points}
                        onChange={(e) => setNewMission({...newMission, points: e.target.value})}
                        className="glass border-emerald-500/30 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Description</Label>
                    <Textarea
                      placeholder="Décrivez précisément ce que l'utilisateur doit faire..."
                      value={newMission.description}
                      onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                      className="glass border-emerald-500/30 text-white placeholder:text-gray-400"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-white">Type de validation</Label>
                    <Select value={newMission.validationType} onValueChange={(value: any) => setNewMission({...newMission, validationType: value})}>
                      <SelectTrigger className="glass border-emerald-500/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-dark">
                        <SelectItem value="manual" className="text-white hover:bg-white/20">Validation manuelle</SelectItem>
                        <SelectItem value="automatic" className="text-white hover:bg-white/20">Validation automatique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {newMission.maxExecutors && newMission.points && (
                    <div className="bg-emerald-900/20 p-4 rounded-lg">
                      <p className="text-emerald-400 text-sm">
                        Coût total: {parseInt(newMission.maxExecutors || '0') * parseInt(newMission.points || '0')} points
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 btn-animated"
                      disabled={!newMission.title || !newMission.url || !newMission.maxExecutors || !newMission.points}
                    >
                      Créer la Mission
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => setNewMission({
                        title: '',
                        url: '',
                        type: 'like',
                        maxExecutors: '',
                        points: '',
                        description: '',
                        validationType: 'manual'
                      })}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Execute Mission Tab */}
          {activeTab === 'execute' && !isExecuting && (
            <div className="space-y-4">
              {missions.map((mission, index) => (
                <Card 
                  key={mission.id} 
                  className={`glass-dark border-emerald-500/20 hover-lift ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                  style={{animationDelay: `${0.6 + index * 0.1}s`}}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-2">{mission.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{mission.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <Badge className="bg-emerald-600 text-white">
                            {getTypeLabel(mission.type)}
                          </Badge>
                          <span>{mission.currentExecutors}/{mission.maxExecutors} exécutants</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400 mb-2">
                          +{mission.points} points
                        </div>
                        <Button
                          onClick={() => handleExecuteMission(mission)}
                          className="bg-emerald-600 hover:bg-emerald-700 btn-animated"
                          disabled={mission.currentExecutors >= mission.maxExecutors}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Exécuter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Mission Execution */}
          {isExecuting && selectedMission && (
            <Card className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <CardTitle className="text-emerald-400 flex items-center space-x-2">
                  <Timer className="w-6 h-6 animate-spin" />
                  <span>Exécution de Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer */}
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${timer > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {timer}s
                  </div>
                  <p className="text-white">
                    {timer > 0 ? 'Temps restant avant validation' : 'Vous pouvez maintenant valider'}
                  </p>
                </div>

                {/* Mission Details */}
                <div className="bg-emerald-900/20 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">{selectedMission.title}</h3>
                  <p className="text-gray-300 text-sm mb-3">{selectedMission.description}</p>
                  <a 
                    href={selectedMission.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 underline"
                  >
                    {selectedMission.url}
                  </a>
                </div>

                {/* Proof Upload */}
                <div>
                  <Label className="text-white">Capture d'écran de preuve</Label>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="glass border-emerald-500/30 text-white file:bg-emerald-600 file:text-white file:border-0 file:rounded"
                      required
                    />
                    <Camera className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                  {proofFile && (
                    <p className="text-emerald-400 text-sm mt-1">
                      ✓ {proofFile.name}
                    </p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmitProof}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 btn-animated"
                    disabled={timer > 0 || !proofFile}
                  >
                    {timer > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Attendre {timer}s
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      setIsExecuting(false);
                      setSelectedMission(null);
                      setProofFile(null);
                      setTimer(0);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validate Tab */}
          {activeTab === 'validate' && (
            <Card className={`glass-dark border-emerald-500/20 ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <CardTitle className="text-emerald-400">Missions à Valider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-emerald-900/20 rounded-lg">
                    <div>
                      <p className="text-white font-semibold">User123</p>
                      <p className="text-gray-300 text-sm">Like vidéo YouTube</p>
                      <p className="text-xs text-gray-400">Soumis il y a 5 min</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Valider
                      </Button>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}