import { useWallet, useMarketPrices } from "@/hooks/use-wallet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowUpRight, ArrowDownRight, Send, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function WalletPage() {
  const { data: wallet, isLoading } = useWallet();
  const { data: prices } = useMarketPrices();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <h1 className="text-3xl font-bold font-display">My Assets</h1>
      
      <div className="grid gap-6">
        {wallet?.map((asset, i) => {
          const marketData = prices?.[asset.symbol] || { price: 0, change24h: 0 };
          const value = parseFloat(asset.balance) * marketData.price;
          
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card hover:bg-card/80 transition-all duration-300">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{asset.symbol[0]}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{asset.name}</h3>
                      <p className="text-muted-foreground text-sm">{asset.symbol}</p>
                    </div>
                  </div>

                  <div className="flex-1 w-full sm:w-auto flex flex-col sm:items-end">
                    <div className="text-2xl font-mono font-bold">
                      {parseFloat(asset.balance).toLocaleString()} {asset.symbol}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ≈ ${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button className="flex-1 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/20 shadow-none">
                      <Send className="w-4 h-4 mr-2" /> Send
                    </Button>
                    <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                      <ArrowDownRight className="w-4 h-4 mr-2" /> Receive
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RefreshCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
