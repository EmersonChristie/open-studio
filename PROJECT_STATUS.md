# Open Studio - Project Status & Developer Guide

## 🎯 **Project Overview**
Multi-tenant SaaS platform for art galleries built with Next.js 15, TypeScript, and PostgreSQL. Successfully migrated from Vite to Next.js with full authentication and multi-tenancy working.

## ✅ **Current Status: FUNCTIONAL MVP**

### **✅ Completed Core Features**
- **Authentication**: Clerk integration with Google OAuth ✅
- **Multi-Tenancy**: Organization-based tenant isolation ✅  
- **Database**: PostgreSQL with Drizzle ORM ✅
- **Routing**: Dynamic tenant-based routing (`/{gallery-slug}`) ✅
- **Webhooks**: Real-time Clerk ↔ Database sync ✅
- **Subscription Management**: 3-tier pricing model implemented ✅

### **🏗️ Current Architecture**
```
Authentication Flow:
Landing (/) → Sign-in/Sign-up → Setup Organization → Gallery Dashboard (/{slug})

Database Schema:
- users (Clerk sync)
- tenants (galleries/organizations) 
- user_tenants (membership relationships)
- subscription management tables

Tech Stack:
- Next.js 15 (App Router)
- TypeScript
- Clerk (Auth + Organizations)
- PostgreSQL + Drizzle ORM
- Tailwind CSS + shadcn/ui
- Zustand (state) + React Query (server state)
```

## 📋 **Business Model (Implemented)**

### **🆓 Free Plan** - $0/month
- 5 artworks, 1 user, testing only

### **🎨 Artist Plan** - $19/month  
- 100 artworks, 2 users, single artist constraint

### **🏛️ Gallery Plan** - $49/month + $39/month per additional gallery
- 500 artworks per gallery, unlimited users, unlimited galleries

## 🚀 **Next Development Priorities**

### **Phase 1: Core Gallery Features (2-3 weeks)**
1. **Artwork Management**
   - Create/edit artwork records
   - Image upload and management
   - Artist relationships
   - Inventory tracking

2. **Artist Profiles**
   - Artist information management
   - Portfolio views
   - Artist-artwork relationships

3. **Client Management**
   - Client/collector database
   - Interaction tracking
   - Communication logs

### **Phase 2: Sales & Business Features (2-3 weeks)**
4. **Sales Pipeline**
   - Inquiry management
   - Sales tracking
   - Invoice generation
   - Payment tracking

5. **Gallery Settings**
   - Theme customization
   - Staff management
   - Gallery profile settings

### **Phase 3: Advanced Features (3-4 weeks)**
6. **Exhibition Management**
   - Exhibition planning
   - Artwork grouping
   - Event management

7. **Reporting & Analytics**
   - Sales reports
   - Inventory analytics
   - Performance metrics

8. **API & Integrations**
   - REST API for external integrations
   - Webhook system for third-party services

## 🛠️ **Development Environment**

### **Setup Commands**
```bash
# Install dependencies
pnpm install

# Database setup
npm run db:push
npm run db:seed

# Development
npm run dev

# Database management
npm run db:studio  # (currently has config issues)
```

### **Environment Variables Required**
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## 📁 **Project Structure**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── [tenant]/          # Tenant-specific routes
│   ├── api/webhooks/      # Webhook handlers
│   └── setup-organization/ # Organization creation
├── components/            # Shared UI components
│   └── {component}/      # Component-specific code
│       └── utils/        # Component-specific utilities
├── features/             # Feature-based modules
│   └── {feature}/       # Feature-specific code
│       └── utils/       # Feature-specific utilities
├── lib/
│   ├── auth/            # Authentication utilities
│   ├── db/              # Database schema & services
│   ├── middleware/      # Tenant resolution
│   └── utils/           # Core utilities
│       ├── api.ts       # API helpers
│       ├── auth.ts      # Auth utilities
│       ├── error.ts     # Error handling
│       ├── format.ts    # Formatting utilities
│       ├── storage.ts   # Storage helpers
│       ├── tenant.ts    # Tenant utilities
│       ├── ui.ts        # UI utilities
│       └── validation.ts # Validation helpers
└── context/             # React context providers
```

## 🔧 **Known Issues & Technical Debt**
1. **Drizzle Studio**: Configuration issues preventing database GUI access
2. **Organization API**: Some Clerk organization features may need plan upgrade
3. **Error Handling**: Need global error boundaries and better error states
4. **Testing**: No test suite implemented yet
5. **Performance**: Bundle analysis and optimization needed
6. **Utils Organization**: Need to reorganize utilities according to new structure

## 📝 **Development Notes**
- **Tenant Isolation**: All database queries must include tenant filtering
- **Authentication**: Use `auth()` from Clerk for server components
- **Routing**: Follow `/[tenant]/feature` pattern for all tenant-specific pages
- **Components**: Prefer Server Components, use `'use client'` only when necessary
- **Database**: Use Drizzle ORM with SQL template literals for type safety
- **Utilities**: Follow the new utility organization guidelines
  - Core utils in `src/lib/utils/`
  - Feature utils with their features
  - Component utils with their components
  - UI utils in `src/lib/utils/ui.ts`

## 🎯 **Success Metrics**
- ✅ User can sign up and create gallery
- ✅ Multi-tenant data isolation working
- ✅ Authentication flow complete
- ⏳ Core gallery features (artwork, artists, clients)
- ⏳ Sales pipeline functionality
- ⏳ Production deployment ready

---

**Last Updated**: Current session
**Status**: Ready for core feature development 