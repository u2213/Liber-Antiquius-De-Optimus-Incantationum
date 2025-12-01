# D&D Spell Book Application

## Overview

This is a medieval fantasy spell book application that displays spells from Iron's Spells n Spellbooks Minecraft mod. The application presents spells in an immersive, page-turning book interface inspired by medieval grimoires and fantasy RPG aesthetics. Users can browse through different spell schools (Blood, Eldritch, Ender, Evocation, Fire, Holy, Ice, Lightning, Nature), search for specific spells, and navigate through a beautifully designed digital tome.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, bundled using Vite

**Routing**: Wouter for lightweight client-side routing

**State Management**: TanStack React Query for server state, React hooks for local state

**UI Component Library**: Radix UI primitives with custom shadcn/ui components styled using Tailwind CSS

**Styling Approach**: 
- Tailwind CSS utility-first styling with custom theme configuration
- Medieval fantasy design system with parchment textures, serif fonts (Cinzel, Crimson Text, IM Fell English, Lora)
- Custom CSS variables for theming (light/dark modes)
- School-specific color coding for different spell types

**Key UI Patterns**:
- Page-flip book interface using the `page-flip` library for realistic page-turning animations
- Two-page spread layout (800px total width, 400px per page, 600px height)
- Responsive component architecture with examples provided for each major component
- Bookmark search functionality for quick spell lookup
- Navigation controls for page browsing (first, previous, next, last)

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Build System**: 
- esbuild for server bundling with dependency allowlist for optimal cold starts
- Vite for client bundling with HMR support in development
- Custom build script that bundles both client and server

**Development Features**:
- Vite middleware integration for hot module replacement
- Runtime error overlay for development debugging
- Request/response logging with timing
- Static file serving with fallback to index.html for SPA routing

**Storage Interface**: 
- Abstract IStorage interface for data operations
- In-memory storage implementation (MemStorage) as default
- Designed to be swappable with database-backed implementations

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Map structures

**Database Schema**: 
- Drizzle ORM configured for PostgreSQL (@neondatabase/serverless)
- User table defined with UUID primary keys, username/password fields
- Schema uses Drizzle-Zod for validation
- Migration support configured in drizzle.config.ts

**Spell Data**: 
- Client-side spell data stored in TypeScript constants
- Organized by spell schools with metadata (name, level, cooldown, mana, cast type, rarity, description)
- Image URLs for spell icons (Minecraft texture references)
- Search functionality implemented client-side

**Design Philosophy**: The storage layer is abstracted to allow future migration to a persistent database without changing the interface contracts.

### External Dependencies

**UI Components & Styling**:
- @radix-ui/* (comprehensive suite for accessible UI primitives)
- tailwindcss with autoprefixer for styling
- class-variance-authority and clsx for component variant management
- embla-carousel-react for carousel functionality
- page-flip library for book page-turning effects

**State & Data Management**:
- @tanstack/react-query for server state and caching
- react-hook-form with @hookform/resolvers for form handling
- zod and drizzle-zod for schema validation

**Database & Backend**:
- drizzle-orm for type-safe database queries
- @neondatabase/serverless for PostgreSQL connections
- connect-pg-simple for PostgreSQL session storage
- express-session with memorystore for session management

**Development Tools**:
- @replit/vite-plugin-* (runtime error modal, cartographer, dev banner) for Replit-specific development features
- tsx for TypeScript execution
- wouter for routing

**Fonts**: Google Fonts (Cinzel, Crimson Text, IM Fell English, Lora) loaded via CDN for medieval typography

**Note**: The application is currently configured for PostgreSQL via Drizzle ORM, but the actual database connection may need to be established. The storage interface supports both in-memory and database-backed implementations.