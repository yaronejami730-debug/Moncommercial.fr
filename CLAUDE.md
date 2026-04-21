# MonCommercial.fr - Project Guide

## Project Overview
MonCommercial.fr is a B2B marketplace connecting:
- **Commerciaux** (Sales reps) - Free
- **Régies** (Companies) - €9.99/month
- **Installateurs** (Installers) - €9.99/month

In the energy sector (solar, HVAC, efficiency).

## Tech Stack
- **Frontend**: Next.js 16 (App Router) + React + Tailwind
- **Backend**: Vercel Functions + API Routes
- **Database**: PostgreSQL (Neon)
- **Auth**: session cookie (email + password hash, see `lib/auth.ts`)
- **Payments**: Stripe
- **ORM**: Drizzle

## Key Files
- `/lib/db/schema.ts` - Database schema (Drizzle)
- `/lib/auth.ts` - Authentication helpers
- `/lib/stripe.ts` - Stripe integration
- `/app/api/webhooks/` - Webhook handlers
- `/app/dashboard/` - Protected dashboard routes

## Setup
1. Copy `.env.example` to `.env.local`
2. Configure Clerk, Neon, and Stripe
3. Run `npm run db:generate && npm run db:migrate`
4. Run `npm run dev`

## Development Notes
- Session cookie auth: helpers in `lib/auth.ts`, middleware protects all routes except those listed in `PUBLIC_PATHS`
- All DB calls via Drizzle ORM in `/lib/db`
- API routes in `/app/api/` with auth checks (`requireAuth`, `requireOnboarded`, `requireSubscription`)
- Mobile-first design (Tailwind)
- No complex abstractions - keep MVP simple

## Priorities (MVP)
1. ✅ Auth setup with Clerk
2. ✅ DB schema with Drizzle
3. ⏳ User profiles + role selection
4. ⏳ Search users + listings
5. ⏳ Messaging system
6. ⏳ Stripe subscription flow
7. ⏳ Listing creation + management

## Notes
- Users are created via `POST /api/auth/signup`
- Subscription checks: commerciaux are always free, others need active sub
- No public listing view - require login first
- Real-time messaging optional (Phase 2)
