import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "@shared/schema";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AssetListProps {
  wallet: Wallet[];
  prices: Record<string, { price: number; change24h: number }>;
}

export function AssetList({ wallet, prices }: AssetListProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallet.map((asset) => {
          const marketData = prices[asset.symbol] || { price: 0, change24h: 0 };
          const value = parseFloat(asset.balance) * marketData.price;
          const isPositive = marketData.change24h >= 0;

          return (
            <div 
              key={asset.id} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {asset.symbol[0]}
                </div>
                <div>
                  <h4 className="font-semibold">{asset.name}</h4>
                  <p className="text-sm text-muted-foreground">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="font-medium">${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className={`text-xs flex items-center justify-end ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {Math.abs(marketData.change24h)}%
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Send</DropdownMenuItem>
                    <DropdownMenuItem>Swap</DropdownMenuItem>
                    <DropdownMenuItem>History</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
