import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, Loader2 } from "lucide-react";
import { useCreateTransaction } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SwapPage() {
  const [amount, setAmount] = useState("");
  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const { toast } = useToast();
  const createTx = useCreateTransaction();

  const handleSwap = () => {
    if (!amount) return;
    
    createTx.mutate({
      type: "swap",
      amount,
      symbol: fromToken,
      toSymbol: toToken,
      fromAmount: amount, // Simplified for mock
    }, {
      onSuccess: () => {
        toast({ title: "Swap Successful", description: `Swapped ${amount} ${fromToken} to ${toToken}` });
        setAmount("");
      },
      onError: (err) => {
        toast({ title: "Swap Failed", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
      <Card className="glass-card w-full max-w-md border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl font-display text-center">Swap Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">You Pay</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-2xl bg-black/20 border-white/10 h-14"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-24 bg-black/20 border-white/10 h-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">You Receive</label>
            <div className="flex gap-2">
              <Input
                readOnly
                placeholder="0.00"
                // Mock calculation
                value={amount ? (parseFloat(amount) * 2450).toFixed(2) : ""} 
                className="text-2xl bg-black/20 border-white/10 h-14"
              />
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-24 bg-black/20 border-white/10 h-14">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 mt-4 shadow-lg shadow-primary/25"
            onClick={handleSwap}
            disabled={createTx.isPending || !amount}
          >
            {createTx.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Swap Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
