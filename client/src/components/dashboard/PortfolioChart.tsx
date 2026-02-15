import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "@shared/schema";
import { useMemo } from 'react';

interface PortfolioChartProps {
  wallet?: Wallet[];
}

export function PortfolioChart({ wallet }: PortfolioChartProps) {
  const data = useMemo(() => {
    // Generate mock history data based on current balance for visual appeal
    // In a real app, this would come from a historical balance API
    const totalBalance = wallet?.reduce((acc, w) => acc + parseFloat(w.balance), 0) || 0;
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      // Random fluctuation around the total balance
      const fluctuation = (Math.random() - 0.5) * (totalBalance * 0.1);
      return {
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        value: Math.max(0, totalBalance + fluctuation),
      };
    });
  }, [wallet]);

  const totalValue = wallet?.reduce((acc, w) => acc + parseFloat(w.balance), 0) || 0;

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold font-display text-white">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
            +2.4%
          </span>
        </div>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Value']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
