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
3. Make your changes
4. Commit your changes using one of our commit methods:

   **Option 1:** Interactive Commitizen CLI:

   ```bash
   pnpm commit
   ```

   This will launch an interactive prompt to create a conventional commit message

   **Option 2:** Direct commit with conventional format:

   ```bash
   pnpm commit:direct "feat(scope): your commit message"
   ```

   This allows you to directly specify a pre-formatted conventional commit message

5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Workflow

Our project uses Husky to manage Git hooks and enforce code quality:

- **Pre-commit hook**: Runs linting and formatting before each commit

  - Linting issues are reported but will not block your commit
  - Code formatting is applied automatically

- **Commit message hook**: Validates your commit message format
  - Ensures conventional commit format is followed
  - Provides feedback if the format is incorrect, but allows the commit to proceed

We use conventional commits to standardize our commit messages. The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types include:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

Our project includes predefined scopes for better organization. Use them when relevant:

- Feature scopes: `auth`, `ui`, `dashboard`, `settings`, `tasks`, `users`, `chats`, `apps`
- Technical scopes: `api`, `layout`, `types`, `context`, `hooks`, `utils`, `config`, `router`, `store`, `i18n`, `deps`
- Infrastructure scopes: `ci`, `build`, `deploy`, `docker`, `db`

Please ensure your code follows our coding standards as documented in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Versioning and Releases

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) to automate versioning and CHANGELOG generation. The versioning is based on [Semantic Versioning](https://semver.org/) principles.

### Creating a New Release

To create a new release:

```bash
# Automatic versioning based on commit history
pnpm release

# Specify version type explicitly
pnpm release:major  # For breaking changes (1.0.0 -> 2.0.0)
pnpm release:minor  # For new features (1.0.0 -> 1.1.0)
pnpm release:patch  # For bug fixes (1.0.0 -> 1.0.1)
```

This will:

1. Bump the version in package.json according to your commits
2. Update CHANGELOG.md with details of changes
3. Create a version commit and tag

After running the release command, push the tag and commits:

```bash
git push --follow-tags origin main
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [shadcn-admin](https://github.com/satnaing/shadcn-admin) - Admin UI components and design
- [Next.js Boilerplate](https://github.com/ixartz/Next-js-Boilerplate) - Production-ready features and patterns
