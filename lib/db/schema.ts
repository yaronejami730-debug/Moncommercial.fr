import {
  pgTable,
  varchar,
  text,
  timestamp,
  uuid,
  pgEnum,
  boolean,
  decimal,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['commercial', 'regisseur', 'installateur']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'canceled', 'past_due', 'trialing']);
export const listingStatusEnum = pgEnum('listing_status', ['active', 'closed']);
export const listingCategoryEnum = pgEnum('listing_category', ['collaboration', 'rdv', 'project']);
export const connectionStatusEnum = pgEnum('connection_status', ['pending', 'accepted', 'blocked']);

// Users table
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email').unique().notNull(),
    passwordHash: varchar('password_hash'),
    name: varchar('name').notNull(),
    avatarUrl: varchar('avatar_url'),
    role: userRoleEnum('role'),
    onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
    bio: text('bio'),
    phone: varchar('phone'),
    location: varchar('location'),
    website: varchar('website'),
    specialties: jsonb('specialties').$type<string[]>(),
    rating: decimal('rating', { precision: 3, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
  })
);

// Subscriptions table
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: subscriptionStatusEnum('status').notNull(),
    stripeCustomerId: varchar('stripe_customer_id').unique(),
    stripeSubscriptionId: varchar('stripe_subscription_id').unique(),
    currentPeriodStart: timestamp('current_period_start'),
    currentPeriodEnd: timestamp('current_period_end'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('subscriptions_user_id_idx').on(table.userId),
    statusIdx: index('subscriptions_status_idx').on(table.status),
  })
);

// Listings table
export const listings = pgTable(
  'listings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title').notNull(),
    description: text('description').notNull(),
    category: listingCategoryEnum('category').notNull(),
    location: varchar('location'),
    budget: varchar('budget'),
    status: listingStatusEnum('status').notNull().default('active'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('listings_user_id_idx').on(table.userId),
    statusIdx: index('listings_status_idx').on(table.status),
    categoryIdx: index('listings_category_idx').on(table.category),
  })
);

// Conversations table
export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    participant1Id: uuid('participant_1_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    participant2Id: uuid('participant_2_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    listingId: uuid('listing_id').references(() => listings.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastMessageAt: timestamp('last_message_at'),
  },
  (table) => ({
    participant1Idx: index('conversations_participant_1_id_idx').on(table.participant1Id),
    participant2Idx: index('conversations_participant_2_id_idx').on(table.participant2Id),
    uniqueConversation: uniqueIndex('unique_conversation').on(table.participant1Id, table.participant2Id),
  })
);

// Messages table
export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    read: boolean('read').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    conversationIdIdx: index('messages_conversation_id_idx').on(table.conversationId),
    senderIdIdx: index('messages_sender_id_idx').on(table.senderId),
  })
);

// Connections table
export const connections = pgTable(
  'connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    connectedUserId: uuid('connected_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: connectionStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('connections_user_id_idx').on(table.userId),
    connectedUserIdIdx: index('connections_connected_user_id_idx').on(table.connectedUserId),
    uniqueConnection: uniqueIndex('unique_connection').on(table.userId, table.connectedUserId),
  })
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
  listings: many(listings),
  conversations: many(conversations),
  messages: many(messages),
  connections: many(connections),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));

export const listingsRelations = relations(listings, ({ one, many }) => ({
  user: one(users, {
    fields: [listings.userId],
    references: [users.id],
  }),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  participant1: one(users, {
    fields: [conversations.participant1Id],
    references: [users.id],
    relationName: 'participant1',
  }),
  participant2: one(users, {
    fields: [conversations.participant2Id],
    references: [users.id],
    relationName: 'participant2',
  }),
  listing: one(listings, {
    fields: [conversations.listingId],
    references: [listings.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

export const connectionsRelations = relations(connections, ({ one }) => ({
  user: one(users, {
    fields: [connections.userId],
    references: [users.id],
    relationName: 'user',
  }),
  connectedUser: one(users, {
    fields: [connections.connectedUserId],
    references: [users.id],
    relationName: 'connectedUser',
  }),
}));
