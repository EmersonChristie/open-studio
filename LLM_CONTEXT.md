# LLM Context - Open Studio Project

## 🎯 **Project Context for AI Assistants**

**Project**: Multi-tenant SaaS platform for art galleries  
**Status**: Functional MVP with authentication and multi-tenancy working  
**Tech Stack**: Next.js 15 + TypeScript + PostgreSQL + Clerk + Drizzle ORM  
**Architecture**: Multi-tenant with organization-based isolation  

## 🏗️ **Technical Architecture**

### **Multi-Tenancy Pattern**
- **Tenant Identification**: Via URL path `/{tenant-slug}/...`
- **Data Isolation**: All tables include tenant filtering via `tenantId` or `clerkOrgId`
- **Middleware**: `src/middleware.ts` extracts tenant from URL and adds to headers
- **Context**: `src/context/tenant-context.tsx` provides tenant info to components

### **Authentication Flow**
```
Unauthenticated → Landing (/) → Sign-in/Sign-up → Setup Organization → Gallery Dashboard
Authenticated → Landing (/) → Redirect to /{tenant-slug}
```

### **Database Schema (PostgreSQL + Drizzle)**
```typescript
// Core tables with tenant isolation
users: { clerkId, email, firstName, lastName, ... }
tenants: { clerkOrgId, slug, name, subscriptionPlan, ... }
user_tenants: { userId, tenantId, role }
user_subscriptions: { clerkUserId, subscriptionPlan, limits, ... }
```

### **Key File Locations**
- **Auth**: `src/lib/auth/user-dashboard.ts` (routing logic)
- **Database**: `src/lib/db/schema/` (all schemas)
- **Middleware**: `src/middleware.ts` (Clerk + tenant resolution)
- **Webhooks**: `src/app/api/webhooks/clerk/route.ts` (Clerk sync)
- **Tenant Context**: `src/context/tenant-context.tsx`

## 🔧 **Development Patterns & Rules**

### **Coding Standards**
- **TypeScript**: Strict typing, interfaces over types, no enums (use const objects)
- **Components**: Functional components, prefer Server Components
- **File Naming**: kebab-case for files, PascalCase for components
- **Database**: Use Drizzle ORM with SQL template literals for type safety

### **Multi-Tenant Requirements**
- **All database queries** must filter by tenant (use `getTenant()` or `getTenantOrThrow()`)
- **API routes** must validate tenant access via `canAccessTenant()`
- **Components** should use `useTenant()` hook for tenant context
- **URLs** follow pattern: `/{tenant-slug}/feature/sub-feature`

### **Authentication Patterns**
- **Server Components**: Use `auth()` from `@clerk/nextjs/server`
- **Client Components**: Use Clerk hooks (`useUser`, `useOrganization`)
- **Protected Routes**: Middleware handles auth, components assume authenticated
- **Tenant Access**: Always validate user has access to requested tenant

### **Error Handling**
- **Database Errors**: Use custom error classes in `src/lib/db/errors.ts`
- **Auth Errors**: Redirect to appropriate error pages (`/unauthorized`, `/forbidden`)
- **Tenant Errors**: Handle missing/invalid tenants gracefully

## 📋 **Business Logic**

### **Subscription Plans**
```typescript
Free: { artworks: 5, users: 1, galleries: 1 }
Artist: { artworks: 100, users: 2, galleries: 1, singleArtistConstraint: true }
Gallery: { artworks: 500, users: unlimited, galleries: unlimited }
```

### **Plan Enforcement**
- Limits stored in `tenants` table and `user_subscriptions` table
- Check limits before allowing creation of new records
- Artist plan enforces single artist constraint across all artworks

## 🚀 **Current Implementation Status**

### **✅ Completed**
- Next.js 15 migration from Vite
- Clerk authentication with Google OAuth
- Multi-tenant architecture with organization isolation
- PostgreSQL database with Drizzle ORM
- Webhook sync between Clerk and database
- Subscription plan structure
- Dynamic routing with tenant slugs
- Organization creation flow

### **⏳ Next Priorities**
1. **Artwork Management**: CRUD operations for artworks with image upload
2. **Artist Profiles**: Artist information and artwork relationships  
3. **Client Management**: Client/collector database and interaction tracking
4. **Sales Pipeline**: Inquiry management and sales tracking

### **🔧 Known Issues**
- Drizzle Studio configuration needs fixing
- Some Clerk organization API calls return 403 (may need plan upgrade)
- No global error boundaries implemented
- No test suite yet

## 🎯 **Development Guidelines for LLMs**

### **When Adding New Features**
1. **Database First**: Design schema with tenant isolation
2. **API Routes**: Create in `/app/api/[tenant]/...` with proper validation
3. **Components**: Follow feature-based organization in `/src/features/`
4. **Types**: Define TypeScript interfaces for all data structures
5. **Error Handling**: Implement proper error states and boundaries

### **Multi-Tenant Checklist**
- [ ] Database queries include tenant filtering
- [ ] API routes validate tenant access
- [ ] Components use tenant context appropriately
- [ ] URLs follow `/{tenant}/...` pattern
- [ ] Subscription limits are enforced

### **Code Quality Standards**
- Use TypeScript strictly (no `any` types)
- Prefer Server Components over Client Components
- Implement proper loading and error states
- Follow existing naming conventions
- Add proper JSDoc comments for complex functions

### **Testing Approach**
- Unit tests for utility functions and services
- Integration tests for API routes with tenant isolation
- E2E tests for critical user flows (auth, organization creation)
- Database tests with proper cleanup and isolation

## 📚 **Key Dependencies**

### **Core Framework**
- `next@15.x` - App Router with Server Components
- `typescript@5.x` - Strict type checking
- `react@19.x` - Latest React features

### **Authentication & Multi-tenancy**
- `@clerk/nextjs` - Authentication and organization management
- `svix` - Webhook verification

### **Database & ORM**
- `drizzle-orm` - Type-safe database queries
- `postgres` - PostgreSQL driver
- `drizzle-kit` - Database migrations and introspection

### **UI & Styling**
- `tailwindcss` - Utility-first CSS
- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library

### **State Management**
- `zustand` - Global state management
- `@tanstack/react-query` - Server state management

## 🔄 **Migration History**

### **Vite → Next.js 15 Migration**
- Converted TanStack Router to App Router
- Updated all imports and routing patterns
- Fixed SSR/client component boundaries
- Migrated build and development scripts
- Updated middleware for Next.js patterns

### **Authentication Migration**
- Integrated Clerk for authentication
- Set up organization-based multi-tenancy
- Implemented webhook sync with database
- Created tenant resolution middleware

### **Utility Organization**
- **Core Utils** (`src/lib/utils/`): Shared utilities used across the entire application
  - `format.ts`: Date, number, and string formatting
  - `validation.ts`: Common validation functions
  - `storage.ts`: Local storage and session storage helpers
  - `api.ts`: API request helpers and interceptors
  - `error.ts`: Error handling utilities
  - `auth.ts`: Authentication-related utilities
  - `tenant.ts`: Tenant-related utilities

- **Feature Utils** (`src/features/{feature}/utils/`): Feature-specific utilities
  - Example: `src/features/artwork/utils/image-processing.ts`
  - Example: `src/features/gallery/utils/layout.ts`

- **Component Utils** (`src/components/{component}/utils/`): Component-specific utilities
  - Example: `src/components/layout/utils/sidebar-utils.ts`
  - Example: `src/components/form/utils/validation.ts`

- **UI Utils** (`src/lib/utils/ui.ts`): UI-related utilities
  - Class name merging
  - Style helpers
  - Theme utilities

### **Utility Guidelines**
1. **Location**:
   - Core utilities go in `src/lib/utils/`
   - Feature-specific utilities stay with their feature
   - Component-specific utilities stay with their component
   - UI utilities go in `src/lib/utils/ui.ts`

2. **Naming**:
   - Use descriptive names that indicate purpose
   - Group related utilities in appropriately named files
   - Use `.ts` extension for pure utilities, `.tsx` for React-specific utilities

3. **Organization**:
   - Keep utilities close to where they're used
   - Avoid circular dependencies
   - Export utilities through index files for cleaner imports

4. **Documentation**:
   - Add JSDoc comments for complex utilities
   - Include usage examples for non-obvious utilities
   - Document any side effects or dependencies

---

**For LLM Assistants**: This project has a solid foundation. Focus on maintaining multi-tenant patterns, following TypeScript best practices, and ensuring proper tenant isolation in all new features. Always validate tenant access and follow the established architectural patterns. 