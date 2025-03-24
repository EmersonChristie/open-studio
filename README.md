# Open Studio

A production-ready admin dashboard built with Next.js, shadcn/ui, and modern best practices.

## Features

- 🚀 **Next.js 15** with App Router for server-side rendering, API routes, and server components
- 🎨 **shadcn/ui** for beautifully designed, accessible UI components
- 🔐 **Clerk Authentication** for secure user management
- 📊 **Drizzle ORM** for type-safe database access
- 🌐 **Internationalization** with next-intl
- 📱 **Responsive Design** built with Tailwind CSS
- 📈 **TanStack Query** for efficient data fetching and caching
- 🧠 **Zustand** for simple and effective state management
- 📝 **React Hook Form** with Zod validation for form handling
- 🧪 **Vitest & Playwright** for comprehensive testing
- 📊 **Sentry & Pino** for error tracking and logging
- 📚 **Storybook** for component documentation
- 🔍 **Bundle Analyzer** for optimizing bundle size
- 🚢 **CI/CD** with GitHub Actions

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/open-studio.git
cd open-studio

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Run the development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
# Build the application
npm run build
# or
pnpm build

# Start the production server
npm run start
# or
pnpm start
```

## Project Structure

The project follows a feature-based structure for better organization and scalability. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information about the project structure, coding styles, and best practices.

## Implementation Plan

Check out our [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for details on how we're enhancing the admin dashboard with production-ready features.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows our coding standards as documented in [ARCHITECTURE.md](./ARCHITECTURE.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [shadcn-admin](https://github.com/satnaing/shadcn-admin) - Admin UI components and design
- [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) - Production-ready features and patterns
