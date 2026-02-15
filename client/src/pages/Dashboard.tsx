import { useWallet, useTransactions, useMarketPrices } from "@/hooks/use-wallet";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { AssetList } from "@/components/dashboard/AssetList";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";
import { AiChat } from "@/components/chat/AiChat";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data: transactions, isLoading: txLoading } = useTransactions({ limit: 5 });
  const { data: prices, isLoading: pricesLoading } = useMarketPrices();

  if (walletLoading || txLoading || pricesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-6 lg:p-10 space-y-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8 min-w-0">
          <motion.div variants={itemVariants}>
            <PortfolioChart wallet={wallet} />
          </motion.div>
          
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-8">
            <AssetList wallet={wallet || []} prices={prices || {}} />
            <TransactionHistory transactions={transactions || []} />
          </motion.div>
        </div>

        {/* Right Sidebar - AI Chat */}
        <motion.div variants={itemVariants} className="lg:w-96 shrink-0 h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-10">
          <AiChat />
        </motion.div>
      </div>
    </motion.div>
  );
}
