# PayFlow AI

> UPI to Crypto Payment Infrastructure with AI Financial Copilot

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-red?style=flat-square&logo=nestjs)
![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat-square&logo=solana)
![Prisma](https://img.shields.io/badge/Prisma-2D2D42?style=flat-square&logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Pay users in INR via UPI, merchants receive USDC on Solana blockchain — powered by AI financial automation.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **UPI Payments** | Accept payments via PhonePe, GPay, Paytm |
| **Crypto Settlement** | Automatic INR → USDC conversion on Solana |
| **AI Copilot** | Financial insights, spending analysis & automation |
| **Phantom Wallet** | Secure browser extension wallet integration |
| **Social Login** | Google OAuth authentication |
| **Payment Links** | Create & share customizable payment links |
| **Real-time FX** | Live USD/INR exchange rates |
| **Transaction History** | Complete payment tracking & receipts |
| **Analytics Dashboard** | Revenue, volume & trend insights |
| **Merchant Portal** | Dedicated dashboard for businesses |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          PayFlow Architecture                          │
└─────────────────────────────────────────────────────────────────────┘

  Payer (₹)                    Backend                       Merchant ($)
  ┌────────┐                 ┌─────────────┐                 ┌────────────┐
  │  UPI   │                 │   NestJS   │                 │  Solana   │
  │ PhonePe│─────────UPI────▶│   :4000    │─────USDC Tx────▶│  Network  │
  │  GPay  │                 │            │                 │           │
  │  Paytm │                 │ ┌────────┐ │                 │ ┌───────┐ │
  └────────┘                 │ │Prisma  │ │                 │ │Phantom│ │
                              │ │SQLite  │ │                 │ │Wallet │ │
                              │ └────────┘ │                 │ └───────┘ │
                              └─────────────┘                 └────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ NextAuth.js │
                              │   Google    │
                              │ Credentials │
                              └─────────────┘
```

### Payment Flow

```
User selects amount (₹500)
        │
        ▼
User pays via UPI (PhonePe/GPay/Paytm)
        │
        ▼
Backend confirms UPI transaction
        │
        ▼
Backend converts INR → USDC at current rate
        │
        ▼
Backend initiates Solana transaction
        │
        ▼
Merchant receives USDC in Phantom wallet
        │
        ▼
Both parties see transaction in dashboard
```

---

## 📁 Project Structure

```
PayFlow/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── api/auth/            # NextAuth.js API routes
│   │   │   ├── dashboard/           # Dashboard pages
│   │   │   │   ├── wallet/         # Wallet management
│   │   │   │   ├── payments/       # Payment history
│   │   │   │   ├── analytics/      # Revenue insights
│   │   │   │   ├── merchant/       # Merchant portal
│   │   │   │   ├── ai-copilot/     # AI assistant
│   │   │   │   ├── automation/     # Auto-payments
│   │   │   │   ├── profile/       # User profile
│   │   │   │   └── settings/       # App settings
│   │   │   ├── login/             # Login page
│   │   │   ├── signup/            # Signup page
│   │   │   └── page.tsx           # Landing page
│   │   ├── components/
│   │   │   ├── providers/         # Context providers
│   │   │   │   ├── auth-provider.tsx       # NextAuth session
│   │   │   │   ├── phantom-provider.tsx     # Phantom wallet
│   │   │   │   └── theme-provider.tsx      # Dark mode
│   │   │   └── ui/                # UI components
│   │   │       ├── phantom-connect-button.tsx
│   │   │       ├── phantom-status.tsx
│   │   │       └── aurora-background.tsx
│   │   ├── hooks/                  # Custom React hooks
│   │   │   └── use-solana.ts       # Solana operations
│   │   └── lib/
│   │       ├── api.ts              # Axios API client
│   │       └── prisma.ts           # Prisma client
│   │
│   └── api/                        # NestJS backend
│       └── src/
│           ├── modules/
│           │   ├── auth/            # Authentication
│           │   │   ├── auth.controller.ts
│           │   │   ├── auth.service.ts
│           │   │   ├── jwt.strategy.ts
│           │   │   └── dto/
│           │   ├── payments/        # Payment processing
│           │   ├── blockchain/      # Solana integration
│           │   ├── ai/              # AI copilot
│           │   ├── merchant/        # Merchant features
│           │   └── crypto/          # Price conversion
│           ├── main.ts              # Entry point
│           └── app.module.ts        # Root module
│
├── database/
│   └── prisma/
│       ├── schema.prisma           # Database schema
│       └── seed.ts                # Demo data
│
├── packages/                       # Shared packages (future)
├── turbo.json                     # Turborepo config
└── pnpm-workspace.yaml            # Monorepo config
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥18
- **pnpm** ≥8
- **Phantom Wallet** browser extension (for wallet features)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/payflow.git
cd payflow

# Install dependencies
pnpm install

# Setup environment variables
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

### Environment Setup

**apps/web/.env**
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

NEXT_PUBLIC_API_URL=http://localhost:4000
```

**apps/api/.env**
```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your-jwt-secret-here
PORT=4000
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### Database Setup

```bash
# Push schema to database
pnpm db:push

# Seed demo data
pnpm db:seed
```

### Run Development Server

```bash
# Start all apps (web on :3000, api on :4000)
pnpm dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| API Docs | http://localhost:4000/api/docs |
| Prisma Studio | `pnpm db:studio` |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend Framework** | Next.js | 16.2 |
| **UI Library** | React | 19 |
| **Styling** | TailwindCSS | 4.x |
| **Components** | Radix UI + Aceternity | - |
| **Animations** | Framer Motion | 12.x |
| **Backend Framework** | NestJS | 10.x |
| **Database** | SQLite (dev) / PostgreSQL (prod) | - |
| **ORM** | Prisma | 5.x |
| **Authentication** | NextAuth.js | 4.x |
| **OAuth** | Google Provider | - |
| **Blockchain** | Solana | - |
| **Wallet SDK** | Phantom Browser SDK | 2.x |
| **Payments** | UPI Gateway | - |
| **API Docs** | Swagger/OpenAPI | - |

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/register` | Register new user |
| `POST` | `/api/v1/auth/login` | Login with credentials |
| `GET` | `/api/v1/auth/me` | Get current user |
| `POST` | `/api/v1/auth/wallet` | Link Solana wallet |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/payments/my` | User transactions |
| `POST` | `/api/v1/payments` | Create payment |
| `POST` | `/api/v1/payments/upi-callback` | UPI webhook |

### Blockchain

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/blockchain/balance/:address` | Wallet balance |
| `POST` | `/api/v1/blockchain/wallet` | Generate wallet |

### AI Copilot

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/ai/insights` | Financial insights |
| `POST` | `/api/v1/ai/chat` | Chat with AI |
| `POST` | `/api/v1/ai/analyze` | Analyze transactions |

---

## 🔐 Security

- **JWT Authentication** for API endpoints
- **bcrypt** password hashing (SHA-256)
- **NextAuth.js** session management
- **CORS** configuration
- **Rate limiting** on sensitive endpoints
- **Input validation** with class-validator

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all packages |
| `pnpm db:push` | Push Prisma schema to database |
| `pnpm db:seed` | Seed database with demo data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm clean` | Clean build artifacts |

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|---------|
| User | demo@payflow.ai | demo123 |
| User | test@payflow.ai | test123 |

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
cd apps/web
vercel
```

### Backend (Render/Railway)

```bash
cd apps/api
# Set environment variables in dashboard
# Deploy with: npm run start:prod
```

### Database (Neon/Supabase)

```env
DATABASE_URL=postgresql://user:pass@host:5432/payflow
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ by the PayFlow team
