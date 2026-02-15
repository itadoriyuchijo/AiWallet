import { useState, useRef, useEffect } from "react";
import { useChats, useChatMessages, useSendMessage } from "@/hooks/use-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function AiChat() {
  const [input, setInput] = useState("");
  const { data: messages = [] } = useChatMessages(1); // Default to chat ID 1 for MVP
  const sendMessage = useSendMessage();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessage.isPending) return;

    sendMessage.mutate(
      { message: input, chatId: 1 },
      { onSuccess: () => setInput("") }
    );
  };

  return (
    <Card className="glass-card h-full flex flex-col border-primary/20">
      <CardHeader className="border-b border-border/50 bg-card/50">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-4" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-center space-y-2">
                <Bot className="w-12 h-12 text-primary/50" />
                <p>Ask me anything about your wallet,<br/>or tell me to send crypto!</p>
              </div>
            )}
            
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto" : "mr-auto"
                  )}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-muted-foreground rounded-tl-none border border-border/50"
                    )}
                  >
                    {msg.content}
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {sendMessage.isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 mr-auto"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-2xl rounded-tl-none border border-border/50">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        <div className="p-4 bg-card/50 border-t border-border/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send 10 USDC to bob..."
              className="bg-background/50 border-border/50 focus:ring-primary/50"
              disabled={sendMessage.isPending}
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={sendMessage.isPending || !input.trim()}
              className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
