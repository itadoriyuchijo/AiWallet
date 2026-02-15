import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { users } from "./models/auth";

// Export auth models so they can be used in the rest of the app
export * from "./models/auth";

// === TABLE DEFINITIONS ===

// Wallets - stores user's crypto balances
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References users.id (which is a varchar)
  symbol: text("symbol").notNull(), // e.g., 'NEAR', 'USDC'
  name: text("name").notNull(), // e.g., 'NEAR Protocol', 'USD Coin'
  balance: numeric("balance", { precision: 20, scale: 8 }).notNull().default("0"),
  decimals: integer("decimals").notNull().default(24),
  iconUrl: text("icon_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions - history of sends, swaps, stakes
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'send', 'receive', 'swap', 'stake', 'unstake'
  
  // For transfers
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  amount: numeric("amount", { precision: 20, scale: 8 }),
  symbol: text("symbol"),
  
  // For swaps (input/output)
  fromSymbol: text("from_symbol"),
  fromAmount: numeric("from_amount", { precision: 20, scale: 8 }),
  toSymbol: text("to_symbol"),
  toAmount: numeric("to_amount", { precision: 20, scale: 8 }),
  
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'failed'
  hash: text("hash"), // Blockchain transaction hash
  networkFee: numeric("network_fee", { precision: 20, scale: 8 }),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: jsonb("metadata"), // Extra data like memos, staking validator, etc.
});

// Chats - history with AI assistant
export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull().default("New Chat"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages - individual messages in a chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id").notNull(), // References chats.id
  role: text("role").notNull(), // 'user', 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // For structured responses like transaction previews
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
  }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

// === ZOD SCHEMAS ===
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true, updatedAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, timestamp: true });
export const insertChatSchema = createInsertSchema(chats).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===
export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Chat = typeof chats.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// API Payloads
export type CreateTransactionRequest = {
  type: 'send' | 'swap' | 'stake';
  amount: string;
  symbol: string;
  toAddress?: string;
  memo?: string;
  // Swap specific
  toSymbol?: string;
  // Stake specific
  validator?: string;
};

export type ChatRequest = {
  message: string;
  chatId?: number;
};

export type ChatResponse = {
  chatId: number;
  message: Message;
  suggestedActions?: { label: string; action: string; data?: any }[];
};
