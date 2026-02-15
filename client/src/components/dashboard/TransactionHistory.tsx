import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@shared/schema";
import { ArrowUpRight, ArrowDownRight, RefreshCcw, Coins } from "lucide-react";
import { format } from "date-fns";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'receive': return <ArrowDownRight className="w-5 h-5 text-emerald-400" />;
      case 'send': return <ArrowUpRight className="w-5 h-5 text-rose-400" />;
      case 'swap': return <RefreshCcw className="w-5 h-5 text-blue-400" />;
      case 'stake': return <Coins className="w-5 h-5 text-purple-400" />;
      default: return <RefreshCcw className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getLabel = (tx: Transaction) => {
    switch (tx.type) {
      case 'receive': return `Received ${tx.symbol}`;
      case 'send': return `Sent ${tx.symbol}`;
      case 'swap': return `Swapped ${tx.fromSymbol} to ${tx.toSymbol}`;
      case 'stake': return `Staked ${tx.symbol}`;
      default: return 'Transaction';
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent transactions
          </div>
        ) : (
          transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-white/10 shadow-inner">
                  {getIcon(tx.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{getLabel(tx)}</h4>
                  <p className="text-xs text-muted-foreground">
                    {tx.timestamp ? format(new Date(tx.timestamp), 'MMM d, h:mm a') : 'Pending'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  tx.type === 'receive' ? 'text-emerald-400' : 
                  tx.type === 'send' ? 'text-rose-400' : 'text-foreground'
                }`}>
                  {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}
                  {tx.amount || tx.fromAmount} {tx.symbol || tx.fromSymbol}
                </span>
                <div className="text-xs text-muted-foreground capitalize">
                  {tx.status}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
