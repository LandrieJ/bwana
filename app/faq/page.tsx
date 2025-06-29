'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Sparkles,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'Comment créer un compte ?',
    answer: 'Allez sur le site www.mcdonald-s-investa.com ou cliquez sur lien d\'invitation. Cliquez sur "S\'inscrire". Remplissez les champs requis (numéro téléphone WhatsApp, mot de passe, code d\'invitation). Cliquez sur "Créer mon compte". La page dirigera vers l\'espace membre.',
    category: 'Compte'
  },
  {
    id: '2',
    question: 'Comment faire un dépôt ?',
    answer: 'Avant d\'acheter un plan, vous devez alimenter votre compte. Option 1: Mobile Money - Cliquez sur "Déposer", sélectionnez votre opérateur (MVola, Airtel, Orange), entrez le montant, envoyez l\'argent au numéro affiché, prenez une capture d\'écran, téléversez la preuve. Option 2: USDT TRC20 - Sélectionnez "Crypto USDT", copiez l\'adresse, envoyez depuis votre wallet, téléversez la capture.',
    category: 'Dépôt'
  },
  {
    id: '3',
    question: 'Comment acheter un plan d\'investissement ?',
    answer: 'Une fois votre solde crédité, allez dans "Plans d\'investissement". Parcourez les offres BURGER 1 à 7. Choisissez votre plan selon votre budget. Entrez le montant à investir. Cliquez sur "Investir". Vous verrez votre plan actif dans votre tableau de bord.',
    category: 'Investissement'
  },
  {
    id: '4',
    question: 'Comment demander un retrait ?',
    answer: 'Allez dans "Retraits". Sélectionnez la méthode (Mobile Money ou USDT TRC20). Entrez votre numéro/adresse et le montant. Saisissez votre mot de passe de retrait. Cliquez sur "Soumettre". Minimum: 4800 Ar ou 1 USDT. Frais: 10%. Validation manuelle sous 12h.',
    category: 'Retrait'
  },
  {
    id: '5',
    question: 'Comment fonctionne le parrainage ?',
    answer: 'Votre lien de parrainage est généré automatiquement avec votre USER ID. Partagez-le pour inviter de nouveaux membres. Vous recevez 10% de commission sur leurs investissements directs. Commissions d\'équipe: Niveau 1: 6%, Niveau 2: 3%, Niveau 3: 1% des gains journaliers.',
    category: 'Parrainage'
  },
  {
    id: '6',
    question: 'Qu\'est-ce que les micro-tâches ?',
    answer: 'Les micro-tâches sont des missions rémunérées en points (likes, abonnements, etc.). Achetez des points (1 point = 100 Ar pour investisseurs, 10 Ar pour non-investisseurs). Créez des missions ou exécutez celles des autres. Timer minimum 15 secondes. Validation avec capture d\'écran.',
    category: 'Micro-tâches'
  },
  {
    id: '7',
    question: 'Quels sont les plans d\'investissement disponibles ?',
    answer: 'BURGER 1: 10K-400K Ar (3%/jour), BURGER 2: 405K-1.2M Ar (3.5%/jour), BURGER 3: 1.205M-2.5M Ar (4%/jour), BURGER 4: 2.505M-3.75M Ar (4.5%/jour), BURGER 5: 3.755M-5M Ar (4.75%/jour), BURGER 6: 5.005M-7.5M Ar (5%/jour), BURGER 7: 7.505M-10M Ar (5.5%/jour).',
    category: 'Investissement'
  },
  {
    id: '8',
    question: 'Comment suivre mes transactions ?',
    answer: 'Historique des dépôts: section "Mes Dépôts". Historique des retraits: section "Mes Retraits". Plans actifs & revenus: Tableau de bord. Toutes les transactions sont visibles dans "Historique de transaction" avec filtres par catégorie.',
    category: 'Transactions'
  }
];

const CATEGORIES = ['Tous', 'Compte', 'Dépôt', 'Retrait', 'Investissement', 'Parrainage', 'Micro-tâches', 'Transactions'];

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (!loggedIn) {
      router.push('/auth/login');
    } else {
      setTimeout(() => setIsLoaded(true), 200);
    }
  }, [router]);

  const filteredFAQ = FAQ_DATA.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-700 animate-gradient"></div>
      
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
            <Sparkles className="w-2 h-2 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 btn-animated">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
          </div>

          {/* Title */}
          <div className={`text-center mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="relative inline-block">
              <h1 className="text-4xl font-bold text-white mb-4 text-glow">FAQ</h1>
              <div className="absolute -top-2 -right-8">
                <HelpCircle className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <p className="text-white/80 text-lg animate-shimmer">Foire Aux Questions</p>
          </div>

          {/* Search Bar */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Rechercher dans la FAQ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass border-white/30 text-gray-900 placeholder:text-gray-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className={`glass shadow-2xl mb-6 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category, index) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`btn-animated ${
                      selectedCategory === category 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'border-white/30 text-gray-700 hover:bg-white/20'
                    }`}
                    style={{animationDelay: `${0.1 * index}s`}}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Items */}
          <div className="space-y-4 mb-8">
            {filteredFAQ.map((item, index) => (
              <Card 
                key={item.id} 
                className={`glass shadow-2xl hover-lift ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`}
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleExpanded(item.id)}
                >
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-red-600 text-lg flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 animate-pulse" />
                      <span>{item.question}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      {expandedItems.includes(item.id) ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 animate-bounce" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                {expandedItems.includes(item.id) && (
                  <CardContent className="animate-slide-in-up">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className={`glass shadow-2xl ${isLoaded ? 'animate-slide-in-up' : 'opacity-0'}`} style={{animationDelay: '1s'}}>
            <CardHeader>
              <CardTitle className="text-red-600 text-center">Besoin d'aide supplémentaire ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="bg-green-600 hover:bg-green-700 btn-animated">
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp Support
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 btn-animated">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 btn-animated">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat en Direct
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom padding */}
          <div className="pb-24"></div>
        </div>
      </div>
    </div>
  );
}