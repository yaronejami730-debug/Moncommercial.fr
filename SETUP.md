# MonCommercial.fr - Setup Guide

## 1. Environnement et Configuration

### Créer une base de données Neon
1. Allez sur [vercel.com/marketplace](https://vercel.com/marketplace)
2. Installez Neon PostgreSQL
3. Copiez la `DATABASE_URL` dans `.env.local`

### Configurer Clerk (Authentification)
1. Créez un compte sur [clerk.com](https://clerk.com)
2. Créez une nouvelle application
3. Copiez `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY` dans `.env.local`
4. Configurez le webhook Clerk vers `https://yourapp.com/api/webhooks/clerk`

### Configurer Stripe
1. Créez un compte sur [stripe.com](https://stripe.com)
2. Créez deux plans d'abonnement:
   - Régies/Installateurs: 9,99€/mois
3. Copiez les clés et `STRIPE_WEBHOOK_SECRET` dans `.env.local`

## 2. Setup Base de Données

```bash
npm install
npm run db:generate
npm run db:migrate
```

## 3. Démarrer le développement

```bash
npm run dev
```

L'app démarre sur `http://localhost:3000`

## 4. Structure du projet

- `/app` - Pages Next.js (UI)
- `/lib/db` - Schema Drizzle ORM
- `/lib` - Utilitaires (auth, stripe, types)
- `/app/api` - Routes API
- `/migrations` - Migrations DB

## 5. Variables d'environnement requises

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
DATABASE_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 6. Déployer sur Vercel

```bash
npm install -g vercel
vercel link
vercel
```
