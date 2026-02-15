import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useWallet() {
  return useQuery({
    queryKey: [api.wallet.list.path],
    queryFn: async () => {
      const res = await fetch(api.wallet.list.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch wallet");
      return api.wallet.list.responses[200].parse(await res.json());
    },
  });
}

export function useWalletAsset(symbol: string) {
  return useQuery({
    queryKey: [api.wallet.get.path, symbol],
    queryFn: async () => {
      const url = buildUrl(api.wallet.get.path, { symbol });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch asset");
      return api.wallet.get.responses[200].parse(await res.json());
    },
    enabled: !!symbol,
  });
}

export function useTransactions(params?: { limit?: number; symbol?: string }) {
  return useQuery({
    queryKey: [api.transactions.list.path, params],
    queryFn: async () => {
      const url = new URL(api.transactions.list.path, window.location.origin);
      if (params?.limit) url.searchParams.set("limit", params.limit.toString());
      if (params?.symbol) url.searchParams.set("symbol", params.symbol);
      
      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return api.transactions.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const validated = api.transactions.create.input.parse(data);
      const res = await fetch(api.transactions.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.transactions.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create transaction");
      }
      return api.transactions.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.wallet.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
    },
  });
}

export function useMarketPrices() {
  return useQuery({
    queryKey: [api.market.prices.path],
    queryFn: async () => {
      const res = await fetch(api.market.prices.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market prices");
      return api.market.prices.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}
