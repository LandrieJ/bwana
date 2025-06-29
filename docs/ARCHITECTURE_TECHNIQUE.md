# 🏗️ Architecture Technique - McDonald's Investa

## 📋 Vue d'Ensemble

### 🎯 Objectifs Architecturaux
- **Scalabilité** : Support de 100 000+ utilisateurs
- **Sécurité** : Protection des données financières
- **Performance** : Temps de réponse < 200ms
- **Disponibilité** : 99.9% uptime
- **Maintenabilité** : Code modulaire et documenté

---

## 🏛️ Architecture Globale

### 🌐 Architecture 3-Tiers

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PRÉSENTATION  │    │     LOGIQUE     │    │    DONNÉES      │
│                 │    │                 │    │                 │
│ • Next.js 13+   │◄──►│ • API Routes    │◄──►│ • PostgreSQL    │
│ • React 18      │    │ • Middleware    │    │ • Redis Cache   │
│ • Tailwind CSS  │    │ • Auth System   │    │ • File Storage  │
│ • TypeScript    │    │ • Business Logic│    │ • Backup System │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Stack Technologique

#### Frontend
- **Framework** : Next.js 13+ (App Router)
- **UI Library** : React 18 avec TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **State Management** : Zustand / React Query
- **Animations** : Framer Motion
- **PWA** : Service Workers

#### Backend
- **Runtime** : Node.js 18+
- **Framework** : Next.js API Routes
- **Authentication** : NextAuth.js + JWT
- **Validation** : Zod
- **ORM** : Prisma
- **File Upload** : Multer + Sharp

#### Base de Données
- **Principal** : PostgreSQL 15+
- **Cache** : Redis 7+
- **Search** : Elasticsearch (optionnel)
- **Analytics** : ClickHouse (optionnel)

#### Infrastructure
- **Hosting** : Vercel / AWS / DigitalOcean
- **CDN** : Cloudflare
- **Monitoring** : Sentry + DataDog
- **CI/CD** : GitHub Actions

---

## 🗄️ Modèle de Données

### 📊 Schéma Principal

```sql
-- Utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(20) UNIQUE NOT NULL, -- USR_XXXXXX
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  withdraw_password_hash VARCHAR(255),
  full_name VARCHAR(255),
  avatar_url VARCHAR(500),
  referral_code VARCHAR(20),
  referred_by UUID REFERENCES users(id),
  status user_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Soldes
CREATE TABLE balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  main_balance DECIMAL(15,2) DEFAULT 0,
  points_balance INTEGER DEFAULT 0,
  investment_balance DECIMAL(15,2) DEFAULT 0,
  frozen_balance DECIMAL(15,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Plans d'investissement
CREATE TABLE investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- BURGER 1, BURGER 2, etc.
  min_amount DECIMAL(15,2) NOT NULL,
  max_amount DECIMAL(15,2) NOT NULL,
  min_add DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(5,2) NOT NULL, -- Pourcentage
  referral_commission DECIMAL(5,2) NOT NULL,
  team_l1_commission DECIMAL(5,2) NOT NULL,
  team_l2_commission DECIMAL(5,2) NOT NULL,
  team_l3_commission DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Investissements utilisateur
CREATE TABLE user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES investment_plans(id),
  amount DECIMAL(15,2) NOT NULL,
  daily_return DECIMAL(15,2) NOT NULL,
  total_returned DECIMAL(15,2) DEFAULT 0,
  status investment_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency currency_type DEFAULT 'Ar',
  status transaction_status DEFAULT 'pending',
  reference VARCHAR(50),
  proof_url VARCHAR(500),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- Micro-tâches
CREATE TABLE microtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  task_type task_type NOT NULL,
  points_reward INTEGER NOT NULL,
  max_executors INTEGER NOT NULL,
  current_executors INTEGER DEFAULT 0,
  validation_type validation_type DEFAULT 'manual',
  status task_status DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exécutions de tâches
CREATE TABLE task_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES microtasks(id),
  executor_id UUID REFERENCES users(id),
  proof_url VARCHAR(500),
  status execution_status DEFAULT 'pending',
  validated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Commissions
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  from_user_id UUID REFERENCES users(id),
  type commission_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  level INTEGER, -- 1, 2, 3 pour les niveaux
  reference_id UUID, -- ID de la transaction/investissement source
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 🔗 Relations Clés

```
Users (1) ──── (N) Balances
Users (1) ──── (N) Transactions
Users (1) ──── (N) User_Investments
Users (1) ──── (N) Microtasks (creator)
Users (1) ──── (N) Task_Executions (executor)
Users (1) ──── (N) Commissions
Investment_Plans (1) ──── (N) User_Investments
Microtasks (1) ──── (N) Task_Executions
```

---

## 🔐 Sécurité

### 🛡️ Authentification & Autorisation

```typescript
// JWT Token Structure
interface JWTPayload {
  userId: string;
  userRole: 'user' | 'admin' | 'super_admin';
  sessionId: string;
  iat: number;
  exp: number;
}

// Middleware de sécurité
export async function authMiddleware(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = payload;
    return NextResponse.next();
  } catch (error) {
    return new Response('Invalid token', { status: 401 });
  }
}
```

### 🔒 Chiffrement des Données

```typescript
// Chiffrement des mots de passe
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

// Chiffrement des données sensibles
import crypto from 'crypto';

export function encryptSensitiveData(data: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY!);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

### 🚫 Protection OWASP

- **SQL Injection** : Prisma ORM + Parameterized queries
- **XSS** : Content Security Policy + Input sanitization
- **CSRF** : CSRF tokens + SameSite cookies
- **Rate Limiting** : Redis-based rate limiter
- **Input Validation** : Zod schemas

---

## 📊 Performance & Scalabilité

### ⚡ Optimisations Frontend

```typescript
// Code splitting par route
const DashboardPage = dynamic(() => import('./dashboard'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Optimisation des images
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="McDonald's Investa"
  width={200}
  height={100}
  priority
  placeholder="blur"
/>

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### 🗄️ Optimisations Base de Données

```sql
-- Index pour les requêtes fréquentes
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_transactions_user_status ON transactions(user_id, status);
CREATE INDEX idx_balances_user_id ON balances(user_id);

-- Partitioning pour les grandes tables
CREATE TABLE transactions_2024 PARTITION OF transactions
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- Vues matérialisées pour les statistiques
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  u.id,
  u.user_id,
  b.main_balance,
  COUNT(ui.id) as active_investments,
  SUM(ui.amount) as total_invested
FROM users u
LEFT JOIN balances b ON u.id = b.user_id
LEFT JOIN user_investments ui ON u.id = ui.user_id AND ui.status = 'active'
GROUP BY u.id, u.user_id, b.main_balance;
```

### 📈 Cache Strategy

```typescript
// Redis Cache
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

// Cache des données utilisateur
export async function getUserBalance(userId: string) {
  const cacheKey = `balance:${userId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const balance = await prisma.balance.findUnique({
    where: { userId }
  });
  
  await redis.setex(cacheKey, 300, JSON.stringify(balance)); // 5 min cache
  return balance;
}

// Cache des plans d'investissement
export async function getInvestmentPlans() {
  const cacheKey = 'investment_plans';
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const plans = await prisma.investmentPlan.findMany({
    where: { isActive: true }
  });
  
  await redis.setex(cacheKey, 3600, JSON.stringify(plans)); // 1 hour cache
  return plans;
}
```

---

## 🔄 APIs & Intégrations

### 📱 API REST Structure

```typescript
// Structure des endpoints
/api/auth/
  ├── login (POST)
  ├── register (POST)
  ├── logout (POST)
  └── refresh (POST)

/api/user/
  ├── profile (GET, PUT)
  ├── balance (GET)
  ├── transactions (GET)
  └── investments (GET, POST)

/api/transactions/
  ├── deposit (POST)
  ├── withdraw (POST)
  └── exchange (POST)

/api/microtasks/
  ├── create (POST)
  ├── list (GET)
  ├── execute (POST)
  └── validate (PUT)

/api/admin/
  ├── users (GET, PUT, DELETE)
  ├── transactions (GET, PUT)
  ├── plans (GET, POST, PUT, DELETE)
  └── stats (GET)
```

### 🔌 Intégrations Externes

```typescript
// Mobile Money API Integration
export class MobileMoneyService {
  async verifyPayment(reference: string, operator: 'mvola' | 'airtel' | 'orange') {
    const config = {
      mvola: { url: process.env.MVOLA_API_URL, key: process.env.MVOLA_API_KEY },
      airtel: { url: process.env.AIRTEL_API_URL, key: process.env.AIRTEL_API_KEY },
      orange: { url: process.env.ORANGE_API_URL, key: process.env.ORANGE_API_KEY }
    };
    
    const response = await fetch(`${config[operator].url}/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config[operator].key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reference })
    });
    
    return response.json();
  }
}

// USDT TRC20 Verification
export class CryptoService {
  async verifyUSDTTransaction(txHash: string, address: string, amount: number) {
    const response = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}`);
    const transaction = await response.json();
    
    // Vérifier la transaction
    return {
      isValid: transaction.ret[0].contractRet === 'SUCCESS',
      amount: transaction.raw_data.contract[0].parameter.value.amount / 1000000,
      toAddress: transaction.raw_data.contract[0].parameter.value.to_address
    };
  }
}
```

---

## 📊 Monitoring & Analytics

### 📈 Métriques Business

```typescript
// Tracking des événements business
export class AnalyticsService {
  async trackUserRegistration(userId: string, referralCode?: string) {
    await this.track('user_registered', {
      userId,
      referralCode,
      timestamp: new Date(),
      source: referralCode ? 'referral' : 'direct'
    });
  }
  
  async trackInvestment(userId: string, planId: string, amount: number) {
    await this.track('investment_made', {
      userId,
      planId,
      amount,
      timestamp: new Date()
    });
  }
  
  async trackWithdrawal(userId: string, amount: number, method: string) {
    await this.track('withdrawal_requested', {
      userId,
      amount,
      method,
      timestamp: new Date()
    });
  }
}
```

### 🔍 Monitoring Système

```typescript
// Health Check Endpoint
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    external_apis: await checkExternalAPIs(),
    disk_space: await checkDiskSpace(),
    memory: process.memoryUsage()
  };
  
  const isHealthy = Object.values(checks).every(check => 
    typeof check === 'object' ? check.status === 'ok' : check
  );
  
  return Response.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  }, {
    status: isHealthy ? 200 : 503
  });
}
```

---

## 🚀 Déploiement & DevOps

### 🔄 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### 🐳 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Builder
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## 🔧 Configuration Environnement

### 🌍 Variables d'Environnement

```bash
# .env.example
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mcdonalds_investa"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Encryption
ENCRYPTION_KEY="your-encryption-key"

# Mobile Money APIs
MVOLA_API_URL="https://api.mvola.mg"
MVOLA_API_KEY="your-mvola-api-key"
AIRTEL_API_URL="https://api.airtel.mg"
AIRTEL_API_KEY="your-airtel-api-key"
ORANGE_API_URL="https://api.orange.mg"
ORANGE_API_KEY="your-orange-api-key"

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
ANALYTICS_ID="your-analytics-id"
```

---

## 📚 Documentation API

### 📖 OpenAPI Specification

```yaml
# openapi.yml
openapi: 3.0.0
info:
  title: McDonald's Investa API
  version: 1.0.0
  description: API pour la plateforme d'investissement McDonald's Investa

paths:
  /api/auth/login:
    post:
      summary: Connexion utilisateur
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                phone:
                  type: string
                  example: "+261341234567"
                password:
                  type: string
                  example: "password123"
      responses:
        200:
          description: Connexion réussie
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                  user:
                    $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        userId:
          type: string
          example: "USR_123456"
        phone:
          type: string
        fullName:
          type: string
        status:
          type: string
          enum: [active, suspended, banned]
```

---

Cette architecture technique garantit une plateforme robuste, sécurisée et scalable pour McDonald's Investa, capable de gérer une croissance importante tout en maintenant des performances optimales.