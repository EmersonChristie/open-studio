# Open Studio

A modern, multi-tenant SaaS platform for art galleries built with Next.js 15, TypeScript, and PostgreSQL.

## 🎯 **Project Status**

**Current Status**: ✅ **Functional MVP**

- Authentication with Clerk (Google OAuth)
- Multi-tenant architecture with organization isolation
- PostgreSQL database with real-time webhook sync
- Dynamic tenant-based routing
- 3-tier subscription model implemented

## 📚 **Documentation**

### **For Developers**

📋 **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current progress, architecture overview, next steps, and development environment setup

### **For AI Assistants**

🤖 **[LLM_CONTEXT.md](./LLM_CONTEXT.md)** - Comprehensive technical context, patterns, and guidelines for maintaining project consistency

### **Business Model**

💰 **[BUSINESS_MODEL.md](./BUSINESS_MODEL.md)** - Subscription plans, pricing strategy, and feature breakdown

### **Change History**

📝 **[CHANGELOG.md](./CHANGELOG.md)** - Detailed history of all changes and releases

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18.18.0+ (Next.js 15 requirement)
- PostgreSQL database
- Clerk account with organization features

### **Setup**

```bash
# Clone and install
git clone <repository>
cd open-studio
pnpm install

# Environment setup
cp .env.example .env
# Add your database URL and Clerk keys

# Database setup
npm run db:push
npm run db:seed

# Start development
npm run dev
```

### **Environment Variables**

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## 🏗️ **Architecture Overview**

### **Tech Stack**

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Clerk (with Organizations)
- **UI**: Tailwind CSS + shadcn/ui
- **State**: Zustand + React Query

### **Multi-Tenancy**

- **Tenant Isolation**: Organization-based with database-level filtering
- **Routing**: `/{tenant-slug}/feature` pattern
- **Authentication**: Clerk organizations with webhook sync
- **Data**: All tables include tenant filtering

### **Authentication Flow**

```
Landing (/) → Sign-in/Sign-up → Setup Organization → Gallery Dashboard (/{slug})
```

## 🎨 **Features**

### **✅ Implemented**

- User authentication with Google OAuth
- Multi-tenant gallery management
- Organization creation and management
- Real-time data synchronization
- Subscription plan structure
- Responsive UI with dark/light themes

### **🚧 In Development**

- Artwork inventory management
- Artist profile system
- Client relationship management
- Sales pipeline tracking

### **📋 Planned**

- Exhibition management
- Advanced reporting & analytics
- API integrations
- Mobile app

## 💰 **Subscription Plans**

- **🆓 Free**: 5 artworks, 1 user, testing ($0/month)
- **🎨 Artist**: 100 artworks, 2 users, single artist ($19/month)
- **🏛️ Gallery**: 500 artworks/gallery, unlimited users ($49/month + $39/additional gallery)

## 🛠️ **Development**

### **Key Commands**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:push      # Push schema changes
npm run db:studio    # Open database GUI
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### **Project Structure**

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── [tenant]/          # Tenant-specific routes
│   └── api/webhooks/      # Webhook handlers
├── components/            # Shared UI components
├── features/              # Feature-based modules
├── lib/                   # Core utilities
│   ├── auth/              # Authentication logic
│   ├── db/                # Database schema & services
│   └── middleware/        # Request middleware
└── context/               # React context providers
```

## 🤝 **Contributing**

1. Read [PROJECT_STATUS.md](./PROJECT_STATUS.md) for current priorities
2. Check [LLM_CONTEXT.md](./LLM_CONTEXT.md) for technical guidelines
3. Follow the established patterns for multi-tenancy
4. Ensure proper TypeScript typing
5. Test with multiple tenants

## 📄 **License**

MIT License - see [LICENSE](./LICENSE) file for details.

---

**Built for the art world** 🎨 **Powered by modern web technologies** ⚡
