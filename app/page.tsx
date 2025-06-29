'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, LogIn, UserPlus, Download } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [language, setLanguage] = useState('fr');
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const languages = {
    fr: {
      title: "McDonald's Investa",
      slogan: "C'est tout ce que j'aime",
      login: "Se connecter",
      register: "S'inscrire",
      download: "Télécharger",
    },
    mg: {
      title: "McDonald's Investa",
      slogan: "Izay tiako rehetra",
      login: "Hiditra",
      register: "Hisoratra anarana",
      download: "Alaina",
    },
    en: {
      title: "McDonald's Investa",
      slogan: "I'm lovin' it",
      login: "Login",
      register: "Sign Up",
      download: "Download",
    },
  };

  const handleImageError = () => {
    console.error("Échec du chargement de l'image hero.jpg");
    setImageError(true);
  };
  const currentLang = languages[language as keyof typeof languages];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-600 to-red-600 relative overflow-hidden">
      {/* Logo McDonald's en haut à gauche */}
      <div className="absolute top-4 left-4 z-20">
        <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-red-600 font-bold text-2xl">
           {imageError ? (
                  <div className="text-red-600 font-semibold">
                    Image introuvable. Vérifiez que hero.jpg est dans D:\to\project\public\hero.jpg.
                  </div>
                ) : (
                  <Image
                    src="/logoe.png"
                    alt="Produits McDonald's"
                    layout="responsive"
                    width={400} // Ajustez selon les dimensions réelles si connues
                    height={300} // Ajustez selon les dimensions réelles si connues
                    className="rounded-2xl mx-auto object-cover"
                    priority
                    onError={handleImageError}
                  />
                )}
          </span>
        </div>
      </div>

      {/* Sélecteur de langue en haut à droite */}
      <div className={`absolute top-4 right-4 z-20 ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger
            className="w-32 bg-white/90 border-white/30 text-red-600 font-semibold hover:bg-white transition-all duration-300"
            aria-label="Sélection de la langue"
          >
            <Languages className="w-4 h-4 mr-2" aria-hidden="true" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="fr" className="text-red-600 hover:bg-red-50">
              Français
            </SelectItem>
            <SelectItem value="mg" className="text-red-600 hover:bg-red-50">
              Malagasy
            </SelectItem>
            <SelectItem value="en" className="text-red-600 hover:bg-red-50">
              English
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center min-h-screen p-2">
        <div className="w-full max-w-md">
          {/* Image principale avec produits McDonald's */}
          <div className={`relative mb-8 ${isLoaded ? 'animate-bounce-in' : 'opacity-0'}`}>
            <div className="bg-gradient-to-br from-cyan-100 via-blue-100
             to-purple-100 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Éléments décoratifs de fond */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/30 via-blue-300/30 to-purple-300/30" />

              {/* Contenu de l'image */}
              <div className="relative z-10 text-center">
                {imageError ? (
                  <div className="text-red-600 font-semibold">
                    Image introuvable. Vérifiez que hero.jpg est dans D:\to\project\public\hero.jpg.
                  </div>
                ) : (
                  <Image
                    src="/hero.png"
                    alt="Produits McDonald's"
                    layout="responsive"
                    width={400} // Ajustez selon les dimensions réelles si connues
                    height={300} // Ajustez selon les dimensions réelles si connues
                    className="rounded-2xl mx-auto object-cover"
                    priority
                    onError={handleImageError}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Boutons d'action */}
          <div className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button
                className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.5s' }}
                size="lg"
                aria-label={currentLang.login}
              >
                <LogIn className="w-5 h-5 mr-2" aria-hidden="true" />
                {currentLang.login}
              </Button>
            </Link>

            <Link href="/auth/register" className="block">
              <Button
                className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                  isLoaded ? 'animate-slide-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: '0.7s' }}
                size="lg"
                aria-label={currentLang.register}
              >
                <UserPlus className="w-5 h-5 mr-2" aria-hidden="true" />
                {currentLang.register}
              </Button>
            </Link>

            <Button
              className={`w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-red-600 py-6 text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-105 ${
                isLoaded ? 'animate-slide-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.9s' }}
              size="lg"
              aria-label={currentLang.download}
            >
              <Download className="w-5 h-5 mr-2" aria-hidden="true" />
              {currentLang.download}
            </Button>
          </div>

          {/* Footer */}
          <div
            className={`text-center mt-8 text-white/80 text-sm ${
              isLoaded ? 'animate-slide-in-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '1.1s' }}
          >
            <p>© 2025 McDonald's Investa. Tous droits réservés.</p>
          </div>
        </div>
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                Math.random() > 0.5 ? 'bg-yellow-300' : 'bg-white'
              } opacity-60`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}