import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      {/* Header */}
      <header className="container mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-display">
          AiWallet
        </h1>
        <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10 hover:text-primary">
          <a href="/api/login">Sign In</a>
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 container mx-auto px-6 flex flex-col lg:flex-row items-center justify-center gap-12 pt-12 lg:pt-0">
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-5xl lg:text-7xl font-bold leading-tight font-display mb-6">
              The Wallet That <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Thinks for You
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Manage your crypto with natural language. Swap, stake, and send assets just by chatting with your AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 border-0">
                <a href="/api/login">Get Started Free</a>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-white/10 hover:bg-white/5">
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            {/* Mock UI Card */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Total Balance</div>
                  <div className="text-3xl font-bold font-display">$24,562.00</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
              </div>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">E</div>
                  <div className="flex-1">
                    <div className="font-bold">Ethereum</div>
                    <div className="text-sm text-muted-foreground">4.2 ETH</div>
                  </div>
                  <div className="font-mono text-emerald-400">+$124.50</div>
                </div>
                <div className="bg-white/5 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">S</div>
                  <div className="flex-1">
                    <div className="font-bold">Solana</div>
                    <div className="text-sm text-muted-foreground">145 SOL</div>
                  </div>
                  <div className="font-mono text-emerald-400">+$89.20</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/5 text-center text-muted-foreground">
        <p>&copy; 2025 AiWallet. All rights reserved.</p>
      </footer>
    </div>
  );
}
