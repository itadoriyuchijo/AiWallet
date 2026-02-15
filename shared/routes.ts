import { z } from 'zod';
import { insertTransactionSchema, transactions, wallets, chats, messages, insertMessageSchema } from './schema';

// Shared error schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  // Wallet Endpoints
  wallet: {
    list: {
      method: 'GET' as const,
      path: '/api/wallet' as const,
      responses: {
        200: z.array(z.custom<typeof wallets.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/wallet/:symbol' as const,
      responses: {
        200: z.custom<typeof wallets.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },

  // Transaction Endpoints
  transactions: {
    list: {
      method: 'GET' as const,
      path: '/api/transactions' as const,
      input: z.object({
        limit: z.coerce.number().optional(),
        symbol: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof transactions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/transactions' as const,
      input: z.object({
        type: z.enum(['send', 'swap', 'stake']),
        amount: z.string(),
        symbol: z.string(),
        toAddress: z.string().optional(),
        memo: z.string().optional(),
        // Swap specific
        toSymbol: z.string().optional(),
        // Stake specific
        validator: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof transactions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },

  // Chat Endpoints
  chat: {
    list: {
      method: 'GET' as const,
      path: '/api/chats' as const,
      responses: {
        200: z.array(z.custom<typeof chats.$inferSelect>()),
      },
    },
    getMessages: {
      method: 'GET' as const,
      path: '/api/chats/:id/messages' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
    sendMessage: {
      method: 'POST' as const,
      path: '/api/chat/send' as const,
      input: z.object({
        message: z.string(),
        chatId: z.number().optional(),
      }),
      responses: {
        200: z.object({
          chatId: z.number(),
          message: z.custom<typeof messages.$inferSelect>(),
          response: z.custom<typeof messages.$inferSelect>(),
        }),
      },
    },
  },
  
  // Market Data (Mocked/Proxied)
  market: {
    prices: {
      method: 'GET' as const,
      path: '/api/market/prices' as const,
      responses: {
        200: z.record(z.string(), z.object({
          price: z.number(),
          change24h: z.number(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
