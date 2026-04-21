export type UserRole = 'commercial' | 'regisseur' | 'installateur';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type ListingStatus = 'active' | 'closed';
export type ListingCategory = 'collaboration' | 'rdv' | 'project';
export type ConnectionStatus = 'pending' | 'accepted' | 'blocked';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: UserRole | null;
  onboardingCompleted: boolean;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  specialties?: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: ListingCategory;
  location?: string;
  budget?: string;
  status: ListingStatus;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Conversation {
  id: string;
  participant1Id: string;
  participant2Id: string;
  listingId?: string;
  createdAt: Date;
  lastMessageAt?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Connection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: ConnectionStatus;
  createdAt: Date;
}
