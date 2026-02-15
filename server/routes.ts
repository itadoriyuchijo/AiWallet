import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // OpenAI Client
  // Note: API Key should be set in secrets
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Middleware to check auth for API routes
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Wallet Routes
  app.get(api.wallet.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const wallets = await storage.getWallets(userId);
    res.json(wallets);
  });

  app.get(api.wallet.get.path, requireAuth, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const wallet = await storage.getWalletBySymbol(userId, req.params.symbol);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });
    res.json(wallet);
  });

  // Transaction Routes
  app.get(api.transactions.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const transactions = await storage.getTransactions(userId);
    res.json(transactions);
  });

  app.post(api.transactions.create.path, requireAuth, async (req: any, res) => {
    try {
      const input = api.transactions.create.input.parse(req.body);
      const userId = req.user.claims.sub;

      // Logic to handle transaction (update balances) would go here
      // For MVP, we just record it
      
      const transaction = await storage.createTransaction({
        ...input,
        userId,
        status: "completed",
        networkFee: "0.001", // Mock fee
        timestamp: new Date(),
      });

      // Update wallet balance (mock logic)
      const wallet = await storage.getWalletBySymbol(userId, input.symbol);
      if (wallet) {
        let newBalance = Number(wallet.balance);
        if (input.type === 'send') {
            newBalance -= Number(input.amount);
        } else if (input.type === 'receive') { // Not in input type but for completeness
            newBalance += Number(input.amount);
        }
        // Swap/Stake logic...
        
        await storage.updateWalletBalance(wallet.id, newBalance.toString());
      }

      res.status(201).json(transaction);
    } catch (error) {
       if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Chat Routes
  app.get(api.chat.list.path, requireAuth, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const chats = await storage.getChats(userId);
    res.json(chats);
  });

  app.get(api.chat.getMessages.path, requireAuth, async (req: any, res) => {
    const messages = await storage.getChatMessages(Number(req.params.id));
    res.json(messages);
  });

  app.post(api.chat.sendMessage.path, requireAuth, async (req: any, res) => {
    try {
      const { message, chatId } = api.chat.sendMessage.input.parse(req.body);
      const userId = req.user.claims.sub;

      let currentChatId = chatId;
      if (!currentChatId) {
        const newChat = await storage.createChat(userId, message.substring(0, 30) + "...");
        currentChatId = newChat.id;
      }

      // Save user message
      const userMsg = await storage.addMessage({
        chatId: currentChatId,
        role: "user",
        content: message,
      });

      // AI Logic
      // 1. Check if it's a transaction command
      const systemPrompt = `
        You are AiWallet, a helpful crypto assistant.
        You can help users with:
        - Checking prices
        - Analyzing portfolio (mock data)
        - Preparing transactions (send, swap, stake)
        
        If the user wants to perform a transaction, output JSON in this format:
        {
          "type": "transaction_preview",
          "action": "send|swap|stake",
          "details": { ... }
        }
        
        Otherwise, just reply normally.
        Keep responses concise.
      `;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
        });

        const aiContent = completion.choices[0].message.content || "I couldn't process that.";
        
        // Save AI message
        const aiMsg = await storage.addMessage({
          chatId: currentChatId,
          role: "assistant",
          content: aiContent,
        });

        res.json({
          chatId: currentChatId,
          message: userMsg,
          response: aiMsg,
        });
      } catch (openaiError) {
        console.error("OpenAI Error:", openaiError);
        res.status(500).json({ message: "AI Service Unavailable. Check API Key." });
      }

    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Market Data (Mock)
  app.get(api.market.prices.path, async (_req, res) => {
    res.json({
      "NEAR": { price: 3.45, change24h: 5.2 },
      "BTC": { price: 64200, change24h: 1.2 },
      "ETH": { price: 3450, change24h: -0.5 },
      "SOL": { price: 145, change24h: 8.4 },
    });
  });

  // Seed Data (if needed)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  // Check if we have any wallets, if not, create some for testing
  // We can't easily check 'any' wallet without a user ID, so we'll skip for now
  // or trigger it on user login/creation
}
