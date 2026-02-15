import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import WalletPage from "@/pages/WalletPage";
import SwapPage from "@/pages/SwapPage";
import NotFound from "@/pages/not-found";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <main className="flex-1 lg:pl-72 pt-16 lg:pt-0 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} /> {/* Redirect all other routes to landing */}
      </Switch>
    );
  }

  return (
    <PrivateLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/swap" component={SwapPage} />
        <Route path="/chat" component={Dashboard} /> {/* Reuse dashboard for chat focus */}
        <Route component={NotFound} />
      </Switch>
    </PrivateLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
