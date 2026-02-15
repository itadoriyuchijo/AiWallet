import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  wallets, transactions, chats, messages,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type Chat, type Message, type InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Wallet
  getWallets(userId: string): Promise<Wallet[]>;
  getWalletBySymbol(userId: string, symbol: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, balance: string): Promise<Wallet>;

  // Transactions
  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Chat
  getChats(userId: string): Promise<Chat[]>;
  createChat(userId: string, title?: string): Promise<Chat>;
  getChatMessages(chatId: number): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
}

export class DatabaseStorage implements IStorage {
  // Wallet
  async getWallets(userId: string): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async getWalletBySymbol(userId: string, symbol: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets)
      .where(eq(wallets.userId, userId))
      .where(eq(wallets.symbol, symbol));
    return wallet;
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();
    return newWallet;
  }

  async updateWalletBalance(id: number, balance: string): Promise<Wallet> {
    const [updated] = await db.update(wallets)
      .set({ balance, updatedAt: new Date() })
      .where(eq(wallets.id, id))
      .returning();
    return updated;
  }

  // Transactions
  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.timestamp));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTx] = await db.insert(transactions).values(transaction).returning();
    return newTx;
  }

  // Chat
  async getChats(userId: string): Promise<Chat[]> {
    return await db.select().from(chats)
      .where(eq(chats.userId, userId))
      .orderBy(desc(chats.updatedAt));
  }

  async createChat(userId: string, title: string = "New Chat"): Promise<Chat> {
    const [chat] = await db.insert(chats)
      .values({ userId, title })
      .returning();
    return chat;
  }

  async getChatMessages(chatId: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt);
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const [msg] = await db.insert(messages).values(message).returning();
    
    // Update chat timestamp
    await db.update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, message.chatId));

    return msg;
  }
}

export const storage = new DatabaseStorage();
