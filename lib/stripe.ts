import Stripe from 'stripe';
import type { UserRole } from './types';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe();
    const value = Reflect.get(client, prop);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export const STRIPE_PRICES: Partial<Record<UserRole, string | undefined>> = {
  regisseur: process.env.STRIPE_PRICE_REGISSEUR,
  installateur: process.env.STRIPE_PRICE_INSTALLATEUR,
};

export function priceIdForRole(role: UserRole): string | null {
  return STRIPE_PRICES[role] ?? null;
}
