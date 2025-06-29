# 👨‍💻 Guide de Développement - McDonald's Investa

## 🚀 Démarrage Rapide

### 📋 Prérequis
- **Node.js** 18+ 
- **PostgreSQL** 15+
- **Redis** 7+
- **Git**
- **VS Code** (recommandé)

### ⚡ Installation

```bash
# Cloner le projet
git clone https://github.com/your-org/mcdonalds-investa.git
cd mcdonalds-investa

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos configurations

# Initialiser la base de données
npx prisma migrate dev
npx prisma db seed

# Démarrer le serveur de développement
npm run dev
```

### 🌐 Accès Local
- **Frontend** : http://localhost:3000
- **API** : http://localhost:3000/api
- **Admin** : http://localhost:3000/admin

---

## 📁 Structure du Projet

```
mcdonalds-investa/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 (auth)/            # Groupe de routes auth
│   │   ├── 📄 login/page.tsx
│   │   └── 📄 register/page.tsx
│   ├── 📁 dashboard/          # Dashboard utilisateur
│   ├── 📁 admin/              # Panel administrateur
│   ├── 📁 api/                # API Routes
│   │   ├── 📁 auth/
│   │   ├── 📁 users/
│   │   ├── 📁 transactions/
│   │   └── 📁 admin/
│   ├── 📄 layout.tsx          # Layout racine
│   ├── 📄 page.tsx            # Page d'accueil
│   └── 📄 globals.css         # Styles globaux
├── 📁 components/             # Composants réutilisables
│   ├── 📁 ui/                 # Composants UI de base
│   ├── 📁 forms/              # Formulaires
│   ├── 📁 charts/             # Graphiques
│   └── 📁 layout/             # Composants de layout
├── 📁 lib/                    # Utilitaires et configurations
│   ├── 📄 auth.ts             # Configuration auth
│   ├── 📄 db.ts               # Client base de données
│   ├── 📄 utils.ts            # Fonctions utilitaires
│   └── 📄 validations.ts      # Schémas de validation
├── 📁 prisma/                 # Configuration Prisma
│   ├── 📄 schema.prisma       # Schéma de base de données
│   ├── 📁 migrations/         # Migrations
│   └── 📄 seed.ts             # Données de test
├── 📁 public/                 # Assets statiques
├── 📁 docs/                   # Documentation
├── 📁 tests/                  # Tests
├── 📄 package.json
├── 📄 tailwind.config.ts
├── 📄 next.config.js
└── 📄 README.md
```

---

## 🎨 Standards de Code

### 📝 Conventions de Nommage

```typescript
// ✅ Bon
const UserDashboard = () => { ... };
const calculateDailyReturn = (amount: number) => { ... };
const API_BASE_URL = 'https://api.example.com';

// ❌ Mauvais
const userDashboard = () => { ... };
const CalculateDailyReturn = (amount: number) => { ... };
const apiBaseUrl = 'https://api.example.com';
```

### 🏗️ Structure des Composants

```typescript
// components/dashboard/BalanceCard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface BalanceCardProps {
  balance: number;
  currency: 'Ar' | 'USDT';
  title: string;
  className?: string;
}

export function BalanceCard({ 
  balance, 
  currency, 
  title, 
  className 
}: BalanceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Logique d'effet
  }, [balance]);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      // Logique d'action
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {formatCurrency(balance, currency)}
        </p>
      </CardContent>
    </Card>
  );
}
```

### 🔧 Gestion des États

```typescript
// hooks/useBalance.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Balance {
  main: number;
  points: number;
  investment: number;
}

export function useBalance() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchBalance = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/balance');
        
        if (!response.ok) {
          throw new Error('Erreur lors du chargement du solde');
        }
        
        const data = await response.json();
        setBalance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [user]);

  return { balance, isLoading, error, refetch: fetchBalance };
}
```

---

## 🔐 Authentification & Sécurité

### 🛡️ Middleware d'Authentification

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques
  const publicRoutes = ['/', '/auth/login', '/auth/register'];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Vérifier le token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  try {
    const payload = await verifyJWT(token);
    
    // Ajouter les infos utilisateur aux headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### 🔒 Validation des Données

```typescript
// lib/validations.ts
import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string()
    .min(10, 'Le numéro doit contenir au moins 10 chiffres')
    .regex(/^\+?[0-9]+$/, 'Format de numéro invalide'),
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
});

export const investmentSchema = z.object({
  planId: z.string().uuid('ID de plan invalide'),
  amount: z.number()
    .positive('Le montant doit être positif')
    .max(10000000, 'Montant trop élevé')
});

export const withdrawalSchema = z.object({
  amount: z.number()
    .min(4800, 'Montant minimum: 4800 Ar')
    .positive('Le montant doit être positif'),
  method: z.enum(['mvola', 'airtel', 'orange', 'usdt']),
  recipient: z.string().min(1, 'Destinataire requis'),
  withdrawPassword: z.string().min(1, 'Mot de passe de retrait requis')
});

// Utilisation dans une API route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = loginSchema.parse(body);
    
    // Traitement avec données validées
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
```

---

## 🗄️ Base de Données

### 📊 Modèles Prisma

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(cuid())
  userId            String    @unique @map("user_id")
  phone             String    @unique
  email             String?
  passwordHash      String    @map("password_hash")
  withdrawPasswordHash String? @map("withdraw_password_hash")
  fullName          String?   @map("full_name")
  avatarUrl         String?   @map("avatar_url")
  referralCode      String?   @map("referral_code")
  referredBy        String?   @map("referred_by")
  status            UserStatus @default(ACTIVE)
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")

  // Relations
  balance           Balance?
  transactions      Transaction[]
  investments       UserInvestment[]
  createdTasks      Microtask[] @relation("TaskCreator")
  executedTasks     TaskExecution[]
  commissions       Commission[]
  referrer          User?       @relation("UserReferral", fields: [referredBy], references: [id])
  referrals         User[]      @relation("UserReferral")

  @@map("users")
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  BANNED
}

model Balance {
  id                String  @id @default(cuid())
  userId            String  @unique @map("user_id")
  mainBalance       Decimal @default(0) @map("main_balance") @db.Decimal(15, 2)
  pointsBalance     Int     @default(0) @map("points_balance")
  investmentBalance Decimal @default(0) @map("investment_balance") @db.Decimal(15, 2)
  frozenBalance     Decimal @default(0) @map("frozen_balance") @db.Decimal(15, 2)
  updatedAt         DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("balances")
}
```

### 🔄 Migrations

```sql
-- migrations/001_initial_schema.sql
-- Création des tables principales
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');
CREATE TYPE transaction_type AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'INVESTMENT', 'COMMISSION', 'EXCHANGE');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE currency_type AS ENUM ('Ar', 'USDT');

-- Table users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    withdraw_password_hash VARCHAR(255),
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),
    referral_code VARCHAR(20),
    referred_by UUID REFERENCES users(id),
    status user_status DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_referred_by ON users(referred_by);
```

### 🌱 Seed Data

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Créer un admin par défaut
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { phone: '+261340000000' },
    update: {},
    create: {
      userId: 'USR_000000',
      phone: '+261340000000',
      email: 'admin@mcdonalds-investa.com',
      passwordHash: adminPassword,
      fullName: 'Administrateur',
      status: 'ACTIVE',
      balance: {
        create: {
          mainBalance: 0,
          pointsBalance: 0,
          investmentBalance: 0,
          frozenBalance: 0
        }
      }
    }
  });

  // Créer les plans d'investissement
  const plans = [
    {
      name: 'BURGER 1',
      minAmount: 10000,
      maxAmount: 400000,
      minAdd: 10000,
      dailyReturn: 3.0,
      referralCommission: 10.0,
      teamL1Commission: 6.0,
      teamL2Commission: 3.0,
      teamL3Commission: 1.0
    },
    {
      name: 'BURGER 2',
      minAmount: 405000,
      maxAmount: 1200000,
      minAdd: 50000,
      dailyReturn: 3.5,
      referralCommission: 10.0,
      teamL1Commission: 6.0,
      teamL2Commission: 3.0,
      teamL3Commission: 1.0
    }
    // ... autres plans
  ];

  for (const plan of plans) {
    await prisma.investmentPlan.upsert({
      where: { name: plan.name },
      update: {},
      create: plan
    });
  }

  console.log('Seed data créé avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 🧪 Tests

### 🔬 Tests Unitaires

```typescript
// tests/utils/currency.test.ts
import { describe, it, expect } from 'vitest';
import { convertCurrency, formatCurrency } from '@/lib/utils';

describe('Currency Utils', () => {
  describe('convertCurrency', () => {
    it('should convert Ar to USDT correctly', () => {
      expect(convertCurrency(5000, 'Ar', 'USDT')).toBe(1);
      expect(convertCurrency(10000, 'Ar', 'USDT')).toBe(2);
    });

    it('should convert USDT to Ar correctly', () => {
      expect(convertCurrency(1, 'USDT', 'Ar')).toBe(5000);
      expect(convertCurrency(2.5, 'USDT', 'Ar')).toBe(12500);
    });
  });

  describe('formatCurrency', () => {
    it('should format Ar correctly', () => {
      expect(formatCurrency(10000, 'Ar')).toBe('10 000 Ar');
      expect(formatCurrency(1500000, 'Ar')).toBe('1 500 000 Ar');
    });

    it('should format USDT correctly', () => {
      expect(formatCurrency(2.5, 'USDT')).toBe('2.50 USDT');
      expect(formatCurrency(100, 'USDT')).toBe('100.00 USDT');
    });
  });
});
```

### 🌐 Tests d'Intégration

```typescript
// tests/api/auth.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { testClient } from '@/tests/setup';

describe('/api/auth', () => {
  beforeEach(async () => {
    // Nettoyer la base de données de test
    await testClient.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        phone: '+261341234567',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(201);
      
      const data = await response.json();
      expect(data.user.phone).toBe(userData.phone);
      expect(data.user.userId).toMatch(/^USR_\d{6}$/);
      expect(data.token).toBeDefined();
    });

    it('should reject registration with invalid phone', async () => {
      const userData = {
        phone: 'invalid-phone',
        password: 'password123',
        confirmPassword: 'password123'
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Données invalides');
    });
  });
});
```

### 🎭 Tests E2E avec Playwright

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete registration flow', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur S'inscrire
    await page.click('text=S\'inscrire');
    
    // Remplir le formulaire
    await page.fill('[placeholder="+261 34 XX XXX XX"]', '341234567');
    await page.fill('[placeholder="Minimum 6 caractères"]', 'password123');
    await page.fill('[placeholder="Répétez votre mot de passe"]', 'password123');
    
    // Soumettre
    await page.click('text=S\'inscrire');
    
    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=McDonald\'s Investa')).toBeVisible();
  });

  test('should login existing user', async ({ page }) => {
    // Créer un utilisateur de test d'abord
    // ...

    await page.goto('/auth/login');
    
    await page.fill('[placeholder="+261 34 XX XXX XX"]', '341234567');
    await page.fill('[placeholder="Entrez votre mot de passe"]', 'password123');
    
    await page.click('text=Se connecter');
    
    await expect(page).toHaveURL('/dashboard');
  });
});
```

---

## 📊 Performance & Monitoring

### ⚡ Optimisations

```typescript
// lib/cache.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  static async set(key: string, value: any, ttl: number = 300): Promise<void> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  static async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }
}

// Utilisation dans une API route
export async function GET(request: Request) {
  const cacheKey = 'investment-plans';
  
  // Essayer le cache d'abord
  let plans = await CacheService.get(cacheKey);
  
  if (!plans) {
    // Charger depuis la base de données
    plans = await prisma.investmentPlan.findMany({
      where: { isActive: true }
    });
    
    // Mettre en cache pour 1 heure
    await CacheService.set(cacheKey, plans, 3600);
  }
  
  return Response.json(plans);
}
```

### 📈 Monitoring

```typescript
// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';

export class MonitoringService {
  static trackError(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, {
      tags: {
        component: context?.component || 'unknown',
        action: context?.action || 'unknown'
      },
      extra: context
    });
  }

  static trackEvent(event: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message: event,
      level: 'info',
      data
    });
  }

  static async trackPerformance<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const transaction = Sentry.startTransaction({
      name: operation,
      op: 'function'
    });

    try {
      const result = await fn();
      transaction.setStatus('ok');
      return result;
    } catch (error) {
      transaction.setStatus('internal_error');
      throw error;
    } finally {
      transaction.finish();
    }
  }
}
```

---

## 🚀 Déploiement

### 🔧 Configuration Production

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### 🐳 Docker Production

```dockerfile
# Dockerfile.prod
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 📚 Ressources Utiles

### 🔗 Liens Importants
- **Next.js Documentation** : https://nextjs.org/docs
- **Prisma Documentation** : https://www.prisma.io/docs
- **Tailwind CSS** : https://tailwindcss.com/docs
- **shadcn/ui** : https://ui.shadcn.com

### 🛠️ Outils Recommandés
- **VS Code Extensions** :
  - Prisma
  - Tailwind CSS IntelliSense
  - ES7+ React/Redux/React-Native snippets
  - Auto Rename Tag
  - Prettier
  - ESLint

### 📖 Commandes Utiles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement
npm run build           # Build de production
npm run start           # Démarrer en mode production
npm run lint            # Linter le code
npm run test            # Exécuter les tests

# Base de données
npx prisma generate     # Générer le client Prisma
npx prisma db push      # Pousser le schéma vers la DB
npx prisma migrate dev  # Créer et appliquer une migration
npx prisma studio       # Interface graphique pour la DB

# Tests
npm run test:unit       # Tests unitaires
npm run test:e2e        # Tests end-to-end
npm run test:coverage   # Couverture de tests

# Production
npm run build           # Build optimisé
npm run analyze         # Analyser le bundle
```

---

Ce guide de développement fournit toutes les informations nécessaires pour contribuer efficacement au projet McDonald's Investa. Suivez ces standards pour maintenir la qualité et la cohérence du code.