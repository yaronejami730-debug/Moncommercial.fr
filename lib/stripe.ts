import Stripe from 'stripe';
import type { UserRole } from './types';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
});

export const STRIPE_PRICES: Partial<Record<UserRole, string | undefined>> = {
  regisseur: process.env.STRIPE_PRICE_REGISSEUR,
  installateur: process.env.STRIPE_PRICE_INSTALLATEUR,
};

export function priceIdForRole(role: UserRole): string | null {
  return STRIPE_PRICES[role] ?? null;
}
