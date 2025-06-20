# Full Stack Take-Home Project

A modern web application built with the [T3 Stack](https://create.t3.gg/), featuring authentication, database integration, and a responsive UI.

## Tech Stack

This project uses the following technologies:

- [Next.js 15](https://nextjs.org) - React framework with server components
- [NextAuth.js 5](https://next-auth.js.org) - Authentication for Next.js
- [Prisma 6](https://prisma.io) - Type-safe ORM for database access
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components
- [TypeScript](https://www.typescriptlang.org/) - Static typing for JavaScript
- [tRPC](https://trpc.io) - Type-safe API routes
- [Zod](https://zod.dev) - Type validation library
- [pnpm](https://pnpm.io) - Fast, disk space-efficient package manager
- [PostgreSQL](https://www.postgresql.org) - Relational database management system
- [Supabase](https://supabase.com) - Open source Firebase alternative with PostgreSQL database, authentication, and storage

## Getting Started

### Prerequisites

- Node.js (recommended version in package.json)
- PostgreSQL database
- pnpm package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` and fill in your database connection details and authentication secrets
4. Set up the database:
   - Run `pnpm prisma db:push` to create the database schema
5. Seed the database with initial data:
   - Run `pnpm prisma db seed` to populate the database with sample data

### Development

Start the development server:
The application will be available at [http://localhost:3000](http://localhost:3000).

### Database Management

- Generate Prisma client: `pnpm postinstall`
- Create migrations: `pnpm db:generate`
- Reset database: `pnpm db:reset`
- Deploy migrations: `pnpm db:migrate`
- Push schema changes: `pnpm db:push`
- Open Prisma Studio: `pnpm db:studio`

### Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm typecheck` - Check TypeScript types
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Format code

## Authentication and env

This project uses NextAuth.js for authentication. To set up authentication:

1. Create and add to your `.env`:

   - AUTH_SECRET - Secret string for auth
   - DATABASE_URL, DIRECT_URL - PostgreSQL connection strings from Supabase
   - GEMINI_API_KEY - API key for Gemini AI integration

## Environment Variables

All environment variables listed in the `.env.example` file are required for the application to run properly. Make sure to set them up before starting the application.

2. Set up provider credentials if using OAuth providers (Credentials by default).

## Project Structure

The project follows the standard Next.js structure with:

- `/src` - Application source code
- `/src/app` - Next.js application routes and components
- `/src/components` - Reusable UI components
- `/src/actions/` - Server actions for data fetching and mutations
- `/src/server` - Trpc setup, routers, and utilities, auth and database logic
- `/src/lib` - other utilities and libraries

- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles/globals.css` - Global styles and Tailwind configuration

## Deployment

This project can be deployed to:

- [Vercel](https://create.t3.gg/en/deployment/vercel)
- [Netlify](https://create.t3.gg/en/deployment/netlify)
- [Docker](https://create.t3.gg/en/deployment/docker)

Follow the respective deployment guides for more information.
