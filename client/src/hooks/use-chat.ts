import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useChats() {
  return useQuery({
    queryKey: [api.chat.list.path],
    queryFn: async () => {
      const res = await fetch(api.chat.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chats");
      return api.chat.list.responses[200].parse(await res.json());
    },
  });
}

export function useChatMessages(chatId?: number) {
  return useQuery({
    queryKey: [api.chat.getMessages.path, chatId],
    queryFn: async () => {
      if (!chatId) return [];
      const url = buildUrl(api.chat.getMessages.path, { id: chatId });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.chat.getMessages.responses[200].parse(await res.json());
    },
    enabled: !!chatId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { message: string; chatId?: number }) => {
      const validated = api.chat.sendMessage.input.parse(data);
      const res = await fetch(api.chat.sendMessage.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.chat.sendMessage.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.chat.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.chat.getMessages.path, data.chatId] });
      // Also update wallet if the AI action resulted in a transaction
      queryClient.invalidateQueries({ queryKey: [api.wallet.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.transactions.list.path] });
    },
  });
}
