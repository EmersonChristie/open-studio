# Open Studio - Implementation Plan

This document outlines our phased implementation plan for converting the admin dashboard to a multi-tenant Next.js application for art galleries.

## Important Implementation Guidelines

- **Preserve UI Appearance**: The UI should remain identical to the previous Vite boilerplate. We are only changing Next.js-specific implementation details, not the visual design or UX.
- **Component Migration Strategy**: Prefer adapting existing Vite components to work with Next.js rather than creating new components. Modify the existing components in-place whenever possible.
- **Cleanup Process**: Remove old components only after they have been successfully migrated to Next.js patterns. Don't maintain parallel implementations.
- **Feature Parity**: Ensure that all features from the Vite implementation are preserved in the Next.js version.

## Current Progress Assessment (Updated)

Based on the current codebase, we've made the following progress:

- [x] Set up Next.js project structure

  - [x] Create basic `next.config.js`
  - [x] Set up TypeScript configuration for Next.js
  - [x] Create App Router directory structure

- [x] Migrate core dependencies

  - [x] Update package.json with Next.js dependencies
  - [x] Configure appropriate build and development scripts

- [x] Migrate styles and assets

  - [x] Configure Tailwind CSS for Next.js
  - [x] Move assets to appropriate directories

- [x] Implement tenant identification strategy

  - [x] Set up tenant resolution via path parameters: `/[tenant]/dashboard`
  - [x] Create basic tenant validation logic

- [x] Create tenant context and provider

  - [x] Build tenant context with React Context API
  - [x] Create useTenant hook for accessing tenant info

- [x] Implement tenant middleware
  - [x] Create Next.js middleware for tenant resolution
  - [x] Add tenant information to request headers

## Detailed Next.js 15 Migration Roadmap

### Phase 1: Clean Up and Structural Alignment (1 week)

- [x] Remove Vite-specific Files and Configurations

  - [x] Delete `vite.config.ts`, `vite-env.d.ts`, `main.tsx`
  - [x] Update `next.config.js` for all paths
  - [x] Remove Netlify configuration

- [x] Migrate Routes Structure

  - [x] Migrate settings components to be compatible with Next.js App Router
  - [x] Set up settings routes in Next.js App Router
  - [x] Migrate tasks routes to Next.js App Router
  - [x] Migrate users routes to Next.js App Router
  - [x] Migrate chats routes to Next.js App Router
  - [x] Migrate apps routes to Next.js App Router
  - [x] Migrate help-center routes to Next.js App Router
  - [x] Migrate auth routes (sign-in, sign-up, forgot-password, otp)
  - [x] Set up error pages (404, 500)
  - [x] Delete `routeTree.gen.ts`
  - [x] Remove TanStack Router dependencies from package.json
  - [x] Remove `/src/routes/` directory after migration
  - [x] Update dynamic route parameters to work with Next.js 15 async patterns
  - [x] Fix client/server component compatibility issues
  - [x] Fix metadata exports in page components
  - [x] Remove src/index.css (Vite leftover)
  - [x] Add 'use client' directives to feature components that use React hooks and client components
  - [x] Replace TanStack Router imports with Next.js equivalents:
    - [x] Update `Link` imports from TanStack Router to `import Link from 'next/link'`
    - [x] Update `useNavigate` and `useRouter` from TanStack to `import { useRouter } from 'next/navigation'`
    - [x] Update URL prop from `to` to `href` in Link components
    - [x] Update navigation methods from `navigate({ to: '/' })` to `router.push('/')`
    - [x] Update component type definitions to use Next.js types instead of TanStack Router types
  - [x] Fix dynamic imports with `ssr: false` in auth pages by:
    - [x] Creating client-side wrappers to handle Next.js dynamic imports with `ssr: false` option
    - [x] Splitting components into server and client parts to maintain proper component hierarchy
    - [x] Moving skeletons into separate components for better organization
  - [x] Fix routing issues with error pages by:
    - [x] Creating standalone page components for `/error` and `/not-found` routes
    - [x] Updating the middleware to properly skip tenant resolution for error pages
    - [x] Modifying sidebar navigation logic to handle error pages with proper routing
    - [x] Creating dedicated error components in `src/features/errors/`
  - [x] Add additional error pages:
    - [x] Creating `/unauthorized` (401) page for authentication errors
    - [x] Creating `/forbidden` (403) page for permission errors
    - [x] Creating `/maintenance` (503) page for service unavailable status
    - [x] Updating middleware to skip tenant resolution for all error pages
    - [x] Adding new error pages to the sidebar navigation
  - [ ] Convert complex client components to server components where possible
  - [ ] Update components that rely on router parameters to use Next.js useParams hook
  - [ ] Add tenant and other middleware for route protection

- [ ] Refine App Structure

  - [x] Update tenant layout to use existing AppSidebar component
  - [ ] Properly organize assets and static files
  - [ ] Merge any duplicate utility functions
  - [ ] Optimize component imports for better tree-shaking
  - [ ] Ensure consistent directory structure across features
  - [ ] Organize auth and middleware logic for tenant-aware authentication
  - [ ] Update components to follow Next.js 15 best practices

### Phase 2: Core Feature Migration (2-3 weeks)

- [ ] Authentication System

  - [x] Implement auth routes (`/app/(auth)/...`)
  - [ ] Integrate tenant-aware authentication
  - [ ] Set up protected routes with tenant validation

- [ ] Dashboard and Core Features

  - [ ] Complete dashboard implementation with proper data fetching
  - [ ] Migrate settings pages to Next.js format
  - [ ] Convert task management, user management, and other core features

- [ ] Optimize Server/Client Component Split
  - [ ] Audit all components with `'use client'` directive
  - [ ] Convert appropriate components to Server Components
  - [ ] Implement data fetching with React Server Components

### Phase 3: Database and API Integration (2 weeks)

- [ ] Database Integration

  - [ ] Set up proper database connection with tenant isolation
  - [ ] Implement schema with tenant ID in all relevant tables
  - [ ] Create tenant-aware query utilities

- [ ] API Routes

  - [ ] Create tenant-specific API routes in `/app/api/[tenant]/...`
  - [ ] Implement proper error handling and validation
  - [ ] Set up authentication for API routes

- [ ] Data Fetching Layer
  - [ ] Implement proper React Query integration for client-side state
  - [ ] Create Server Actions for form submissions
  - [ ] Set up caching strategy

### Phase 4: Production Readiness (1-2 weeks)

- [ ] Error Handling and Monitoring

  - [ ] Set up global error boundaries
  - [ ] Implement structured logging
  - [ ] Add Sentry or similar error tracking

- [ ] Performance Optimization

  - [ ] Implement proper image optimization
  - [ ] Add bundle analysis and optimization
  - [ ] Set up proper caching headers

- [ ] Testing and Quality Assurance

  - [ ] Set up Jest/Vitest for unit testing
  - [ ] Implement Playwright for E2E testing
  - [ ] Create CI pipeline with GitHub Actions

- [ ] Deployment Configuration
  - [ ] Configure proper build process
  - [ ] Set up environment variables for different environments
  - [ ] Create deployment pipeline

## Original Implementation Plan

### Phase 1: Vite to Next.js Migration

### 1. Basic Next.js Setup

- [ ] Set up Next.js project structure

  - [ ] Create basic `next.config.js`
  - [ ] Set up TypeScript configuration for Next.js
  - [ ] Create App Router directory structure

- [ ] Migrate core dependencies

  - [ ] Update package.json with Next.js dependencies
  - [ ] Configure appropriate build and development scripts

- [ ] Migrate styles and assets
  - [ ] Configure Tailwind CSS for Next.js
  - [ ] Move assets to appropriate directories

### 2. Component Migration

- [ ] Migrate shadcn/ui components

  - [ ] Ensure component compatibility with Next.js
  - [ ] Convert any client components with `'use client'` directive
  - [ ] Update imports and paths as needed

- [ ] Migrate layout components
  - [ ] Create Next.js specific layouts
  - [ ] Convert sidebar and navigation to work with App Router

### 3. Routing Conversion

- [ ] Convert TanStack Router to Next.js App Router

  - [ ] Map existing routes to page.tsx files
  - [ ] Implement proper nested routing
  - [ ] Set up loading and error states

- [ ] Implement basic data fetching
  - [ ] Convert client-side data fetching to Server Components where appropriate
  - [ ] Maintain React Query for client-side state management

### Phase 2: Multi-Tenant Foundation

### 1. Tenant Identification and Resolution

- [ ] Implement tenant identification strategy

  - [ ] Set up tenant resolution via path parameters: `/[tenant]/dashboard`
  - [ ] Create basic tenant validation logic

- [ ] Create tenant context and provider

  - [ ] Build tenant context with React Context API
  - [ ] Create useTenant hook for accessing tenant info

- [ ] Implement tenant middleware
  - [ ] Create Next.js middleware for tenant resolution
  - [ ] Add tenant information to request headers

### 2. Database and Schema Design

- [ ] Set up database with tenant isolation

  - [ ] Design schema with tenant ID in all relevant tables
  - [ ] Implement tenant-aware query builders
  - [ ] Create migration system

- [ ] Create tenant management
  - [ ] Build tenant creation and management system
  - [ ] Create tenant settings and configuration

### 3. Authentication with Tenant Awareness

- [ ] Set up authentication system
  - [ ] Implement sign in/sign up with tenant context
  - [ ] Create protected routes with tenant validation
  - [ ] Build role-based access control within tenants

### Phase 3: Core Gallery Features

### 1. Inventory Management

- [ ] Artwork catalog

  - [ ] Create artwork database schema
  - [ ] Build CRUD operations for artworks
  - [ ] Implement artwork search and filtering

- [ ] Artist management
  - [ ] Create artist database schema
  - [ ] Build artist profiles and linking to artworks

### 2. Sales Pipeline

- [ ] Client management

  - [ ] Create client database schema
  - [ ] Build client interaction tracking

- [ ] Sales tracking
  - [ ] Design sales and transaction schema
  - [ ] Implement invoicing and payment tracking

### 3. Gallery Settings

- [ ] Tenant customization
  - [ ] Create gallery profile settings
  - [ ] Implement theme customization
  - [ ] Build staff management and permissions

### Phase 4: Advanced Features

### 1. Integration with Production-Ready Tools

- [ ] Error tracking and monitoring

  - [ ] Set up Sentry for error reporting
  - [ ] Implement structured logging with Pino

- [ ] Performance optimization
  - [ ] Set up bundle analyzer
  - [ ] Implement performance monitoring
  - [ ] Optimize image loading and rendering

### 2. Marketing Tools

- [ ] Email campaigns

  - [ ] Integrate with email service providers
  - [ ] Create template system for marketing emails

- [ ] Content management
  - [ ] Build exhibition and event management
  - [ ] Implement blog/news system

### 3. AI Features

- [ ] AI-assisted content creation

  - [ ] Integrate with AI APIs for content generation
  - [ ] Build art description generator

- [ ] Analytics and insights
  - [ ] Create dashboard for gallery analytics
  - [ ] Implement sales predictions and trends

### Phase 5: Testing and Deployment

### 1. Testing Infrastructure

- [ ] Unit and integration testing

  - [ ] Set up testing framework
  - [ ] Create test utilities for tenant context

- [ ] End-to-end testing
  - [ ] Implement Playwright for critical flows
  - [ ] Create tenant-aware testing utilities

### 2. Deployment Pipeline

- [ ] CI/CD setup

  - [ ] Configure GitHub Actions for testing and deployment
  - [ ] Set up staging and production environments

- [ ] Documentation
  - [ ] Create developer documentation
  - [ ] Build user guides for gallery admins

## Migration Priority

Our approach is to first create a solid foundation with Next.js and multi-tenancy before adding more advanced features:

1. **First**: Basic Next.js conversion to get the admin UI working in the new framework
2. **Second**: Multi-tenant architecture to support multiple galleries
3. **Third**: Core gallery features (inventory, sales, settings)
4. **Fourth**: Advanced features and integrations with production tools
5. **Last**: Additional specialized features (AI, marketing) and testing

## Revised Timeline

- **Phase 1 (Next.js Migration)**: 2-3 weeks
- **Phase 2 (Multi-Tenant Foundation)**: 3-4 weeks
- **Phase 3 (Core Gallery Features)**: 4-6 weeks
- **Phase 4 (Advanced Features)**: 3-4 weeks
- **Phase 5 (Testing and Deployment)**: 2-3 weeks

Total estimated time: 14-20 weeks, with the ability to launch an MVP after Phase 3

## Technology Choices

| Feature          | Technology            | Rationale                                              |
| ---------------- | --------------------- | ------------------------------------------------------ |
| Framework        | Next.js               | Server components, better SEO, improved performance    |
| UI Components    | shadcn/ui + Radix UI  | Accessible, customizable components with good DX       |
| State Management | Zustand + React Query | Simple global state + powerful data fetching           |
| Database         | Drizzle ORM           | Type-safe, lightweight ORM with good migration support |
| Authentication   | Clerk                 | Complete auth solution with good DX                    |
| Styling          | Tailwind CSS          | Utility-first CSS for rapid development                |
| Testing          | Vitest + Playwright   | Fast unit tests + powerful E2E testing                 |
| Monitoring       | Sentry + Pino         | Error tracking + structured logging                    |

## Timeline Estimate

- **Phase 1**: 1-2 weeks
- **Phase 2**: 2-3 weeks
- **Phase 3**: 1-2 weeks
- **Phase 4**: 1-2 weeks
- **Phase 5**: 1 week

Total estimated time: 6-10 weeks depending on team size and complexity

## Final Cleanup and Documentation

- [ ] Fix build warnings and errors
  - [x] Update JSON imports to use default imports instead of named exports
  - [ ] Fix any remaining ESLint or TypeScript errors
  - [ ] Ensure proper module resolution for all imports
- [ ] Remove all console logs and debugging code
- [ ] Remove any remaining Vite-specific code or comments
- [ ] Update README with new installation and development instructions
- [ ] Document the migration process and architecture decisions
- [ ] Perform final lint and format check