import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiIpGuard } from "@/components/api-ip-guard";
import NetworkToggle from "@/components/network-toggle";
import SyncAnimation from "@/components/sync-animation";
import NotFound from "@/pages/not-found";
import { useSyncOffline } from "@/hooks/use-sync-offline";
import { useAppStore } from "@/stores";
import { useEffect } from "react";
import Home from "@/pages/home";
import Inspections from "@/pages/inspections";
import Scan from "@/pages/scan";
import Report from "@/pages/report";
import Settings from "@/pages/settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/inspections" component={Inspections} />
      <Route path="/scan" component={Scan} />
      <Route path="/report" component={Report} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function SyncAnimationWrapper() {
  const { syncStatus } = useSyncOffline();
  const { testAction } = useAppStore();

  // Store 초기화 테스트
  useEffect(() => {
    console.log("Testing store initialization...");
    testAction();
  }, [testAction]);

  return <SyncAnimation syncStatus={syncStatus} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ApiIpGuard showModalOnEmpty={true} forceShowOnStart={true}>
          <Router />
        </ApiIpGuard>
        <NetworkToggle />
        <SyncAnimationWrapper />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
