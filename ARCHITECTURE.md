# Open Studio - Project Architecture

This document outlines the architecture, coding styles, best practices, and naming conventions for the Open Studio project - a multi-tenant SaaS platform for art galleries. Following these guidelines will ensure a readable, concise, well-structured, and uniform codebase.

## Multi-Tenant Architecture

Our application is designed as a multi-tenant SaaS platform where each tenant (art gallery) has isolated data but shares the application code. Key multi-tenancy principles:

1. **Tenant Isolation**: Each gallery's data is completely isolated from others
2. **Tenant Identification**: Tenants are identified via subdomain or path parameters
3. **Shared Infrastructure**: All tenants share the same application instance
4. **Custom Configurations**: Galleries can customize their experience within defined parameters

## Project Structure

```
open-studio/
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router integration
│   │   ├── api/               # API routes
│   │   │   └── [tenant]/      # Tenant-specific API routes
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── sign-in/       # Authentication pages
│   │   │   └── sign-up/       # Registration pages
│   │   ├── [tenant]/          # Tenant-specific routes
│   │   │   ├── (dashboard)/   # Dashboard route group
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── settings/      # Tenant settings
│   │   │   └── ...            # Other tenant-specific routes
│   │   └── ...
│   ├── assets/                # Images, fonts, etc.
│   ├── components/            # Shared components
│   │   ├── ui/                # UI components (shadcn/ui)
│   │   └── layout/            # Layout components
│   ├── config/                # Configuration files
│   ├── context/               # React context providers
│   │   └── tenant-context.tsx # Multi-tenant context
│   ├── features/              # Feature-based modules
│   │   ├── inventory/         # Inventory management feature
│   │   ├── sales/             # Sales pipeline feature
│   │   ├── marketing/         # Marketing features
│   │   └── ...                # Other feature modules
│   ├── hooks/                 # Custom hooks
│   │   └── use-tenant.ts      # Hook for accessing current tenant
│   ├── lib/                   # Core utilities and configurations
│   │   ├── api/               # API client and utilities
│   │   │   └── with-tenant.ts # HOF for wrapping API calls with tenant context
│   │   ├── auth/              # Authentication utilities
│   │   ├── db/                # Database utilities
│   │   │   ├── schema/        # Database schema definitions
│   │   │   └── services/      # Service modules
│   │   ├── middleware/        # Custom middleware
│   │   │   └── with-tenant.ts # Tenant resolution middleware
│   │   └── utils/             # Shared utilities
│   ├── stores/                # Zustand stores
│   │   └── tenant-store.ts    # Store for tenant state
│   └── types/                 # TypeScript types
│       └── tenant.ts          # Tenant-related types
└── ...
```

## Multi-Tenant Data Model

Our database schema will follow these principles:

1. **Tenant Identifier**: Each tenant has a unique identifier
2. **Data Partitioning**: Every table with tenant-specific data includes a tenant ID column
3. **Query Filtering**: All queries automatically filter by the current tenant ID
4. **Global Data**: Some data may be shared across all tenants (e.g., system configurations)

Example schema pattern:
```typescript
// Example schema with tenant isolation
const galleries = pgTable("galleries", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull(),
  name: varchar("name").notNull(),
  // other gallery fields
});

const artworks = pgTable("artworks", {
  id: serial("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull(),
  title: varchar("title").notNull(),
  // other artwork fields
});
```

## Coding Style and Patterns

### TypeScript Guidelines

1. **Type Everything**: Use TypeScript for all code. Define interfaces for props, state, and API responses.
```tsx
interface GalleryProfileProps {
  galleryId: string;
  isEditable?: boolean;
}

export function GalleryProfile({ galleryId, isEditable = false }: GalleryProfileProps) {
  // Component implementation
}
```

2. **Prefer Interfaces Over Types**: Use interfaces for object types and types for unions/utility types.
```tsx
// Preferred for object shapes
interface ArtworkData {
  id: string;
  title: string;
  artist: string;
  medium: string;
  price: number;
}

// Preferred for unions, mapped types, etc.
type ArtworkStatus = 'available' | 'sold' | 'reserved';
```

3. **Avoid Enums**: Use const objects or as-const arrays instead.
```tsx
// Instead of enum
export const ArtworkStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
} as const;

export type ArtworkStatus = typeof ArtworkStatus[keyof typeof ArtworkStatus];
```

### Multi-Tenant Patterns

1. **Tenant Context**: Use React Context to provide tenant information throughout the app.
```tsx
// Example tenant context
export const TenantContext = createContext<TenantContextType | null>(null);

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === null) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
```

2. **API Routes**: All API routes that handle tenant data should validate tenant access.
```tsx
// Example API route with tenant validation
export async function GET(
  request: Request,
  { params }: { params: { tenant: string } }
) {
  const tenant = params.tenant;
  
  // Validate tenant access
  const session = await auth();
  if (!session || !canAccessTenant(session, tenant)) {
    return new Response(null, { status: 403 });
  }
  
  // Proceed with tenant-specific logic
  const data = await db.query.artworks.findMany({
    where: { tenantId: tenant }
  });
  
  return Response.json(data);
}
```

3. **Middleware**: Use middleware to resolve and validate tenant context.
```tsx
// Example middleware
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Extract tenant from subdomain or path
  const tenant = extractTenantFromRequest(request);
  
  // Add tenant to request headers for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-tenant', tenant);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

### React Best Practices

1. **Functional Components**: Use functional components with hooks.
```tsx
export function ArtworkCard({ artwork, onSelect }: ArtworkCardProps) {
  return (
    <div className="artwork-card" onClick={() => onSelect(artwork.id)}>
      <h3>{artwork.title}</h3>
      <p>{artwork.artist}</p>
    </div>
  );
}
```

2. **React Server Components**: Prefer React Server Components when possible, especially for tenant-specific data fetching.
   - Files without client-side interactivity should NOT include `'use client'`
   - Only add `'use client'` when component needs browser APIs or React hooks

3. **State Management**:
   - Use React Query for server state
   - Use Zustand for global UI state
   - Use React's built-in state for component-local state

4. **Component Organization**:
   - Export component as the default export
   - Define subcomponents as named exports within the same file
   - Group related components by feature

### File Structure

Within component files, organize in this order:
1. TypeScript interfaces/types
2. Component definition
3. Subcomponents
4. Helper functions
5. Constants/static values

Example:
```tsx
// Types at the top
interface ArtworkFormProps {
  initialData?: ArtworkData;
  onSave: (artwork: ArtworkData) => Promise<void>;
}

// Main component
export function ArtworkForm({
  initialData,
  onSave,
}: ArtworkFormProps) {
  // Component implementation
  return (
    <form>
      {/* Form fields */}
      <FormField label="Title" />
      <FormField label="Artist" />
      <SubmitButton />
    </form>
  );
}

// Subcomponents
function FormField({ label }: { label: string }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input />
    </div>
  );
}

function SubmitButton() {
  return <button type="submit">Save</button>;
}
```

## Naming Conventions

1. **Files and Directories**:
   - Use kebab-case for file and directory names: `artwork-details.tsx`, `tenant-context.tsx`
   - Exception: Next.js special files use their required naming: `page.tsx`, `layout.tsx`, `loading.tsx`

2. **Components**:
   - Use PascalCase for component names: `ArtworkDetails`, `TenantContext`
   - Component files should match component name in kebab-case: `ArtworkDetails` in `artwork-details.tsx`

3. **Hooks**:
   - Prefix with `use`: `useArtworkData`, `useTenant`
   - Hook files should match hook name in kebab-case: `useArtworkData` in `use-artwork-data.ts`

4. **Variables and Functions**:
   - Use camelCase: `artworkData`, `getTenantDetails`
   - Use auxiliary verbs for booleans: `isLoading`, `hasError`
   - Use present tense for functions: `getArtwork` (not `fetchArtwork`)
   - Use active verbs for event handlers: `handleSubmit`, `onSelect`

5. **Types and Interfaces**:
   - Use PascalCase: `ArtworkData`, `GallerySettings`
   - Suffix props with `Props`: `ArtworkCardProps`, `GalleryFormProps`
   - Suffix context with `Context`: `TenantContext`
   - Suffix providers with `Provider`: `TenantProvider`

## Data Fetching and API Patterns

1. **Tenant-Aware API Client**:
   - Create a tenant-aware API client that automatically includes tenant context
   - Organize API functions by feature/domain
   - Use React Query for data fetching, caching, and managing server state

2. **Error Handling**:
   - Use consistent error handling patterns
   - Create custom error classes for different error types
   - Handle tenant-specific errors appropriately

3. **Loading States**:
   - Show loading indicators for all async operations
   - Use React Suspense for loading states when possible

## Performance Best Practices

1. **Tenant Data Optimization**:
   - Cache tenant-specific data where appropriate
   - Implement proper invalidation strategies for tenant data
   - Consider tenant-specific performance optimizations

2. **Optimization**:
   - Use React.memo for expensive components
   - Memoize callbacks with useCallback when passed to child components
   - Memoize computed values with useMemo when expensive to calculate

3. **Code Splitting**:
   - Use dynamic imports for code splitting
   - Lazy load non-critical components and routes

4. **Image Optimization**:
   - Use Next.js Image component for optimized image loading
   - Implement proper image storage strategies for tenant assets

## Security Considerations

1. **Tenant Data Isolation**:
   - Ensure complete isolation between tenant data
   - Implement proper access controls at every layer
   - Regularly audit tenant data access

2. **Authentication and Authorization**:
   - Implement tenant-specific role-based access control
   - Validate tenant access for every authenticated request
   - Use principle of least privilege for all operations

3. **Data Validation**:
   - Validate all inputs on both client and server
   - Implement tenant-aware validation rules
   - Use Zod for schema validation

## Accessibility

1. Follow WCAG 2.1 guidelines (minimum Level AA)
2. Use semantic HTML
3. Implement keyboard navigation
4. Ensure sufficient color contrast
5. Provide text alternatives for non-text content
6. Make forms accessible with proper labels and error handling 