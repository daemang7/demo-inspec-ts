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
import { HashRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";

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
        <ApiIpGuard>
          <HashRouter>
            <SyncAnimationWrapper />
            <NetworkToggle />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/report" element={<Report />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </HashRouter>
        </ApiIpGuard>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
