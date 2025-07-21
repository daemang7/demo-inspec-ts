import { useState } from "react";
import { Wifi, WifiOff, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOffline, setForcedOffline, getForcedOffline } from "@/hooks/use-offline";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function NetworkToggle() {
  const isOffline = useOffline();
  const { toast } = useToast();
  const { setOfflineMode, addInspection, clearAllInspections } = useAppStore();

  // 강제 오프라인 상태
  const isForcedOffline = getForcedOffline();
  const actualOfflineState = isOffline || isForcedOffline;

  // 현재 inspection 데이터 가져오기 (React Query 캐시에서)
  const queryClient = useQueryClient();
  const currentInspections = queryClient.getQueryData(["api", "inspections"]) as any[] | undefined;

  const toggleNetworkState = () => {
    const newForcedState = !isForcedOffline;
    setForcedOffline(newForcedState);

    if (newForcedState) {
      // 강제 오프라인으로 설정
      setOfflineMode(true);

      // 현재 inspection 데이터를 Zustand store에 저장
      if (currentInspections && Array.isArray(currentInspections) && currentInspections.length > 0) {
        console.log("Saving current inspections to offline_data:", currentInspections);
        currentInspections.forEach((inspection: any) => {
          addInspection(inspection);
        });

        toast({
          title: "Network Forced Offline",
          description: `${currentInspections.length} inspections saved to offline storage`,
        });
      } else {
        toast({
          title: "Network Forced Offline",
          description: "Network has been forced to offline mode for testing",
        });
      }
    } else {
      // 강제 온라인으로 설정
      setOfflineMode(false);

      // 오프라인 데이터 정리 (선택사항)
      // clearAllInspections();

      toast({
        title: "Network Forced Online",
        description: "Network has been forced to online mode",
      });
    }
  };

  const getNetworkStatus = () => {
    if (isForcedOffline) {
      return "Forced Offline";
    }
    if (isOffline) {
      return "Actually Offline";
    }
    return "Online";
  };

  const getStatusColor = () => {
    if (isForcedOffline) {
      return "bg-orange-500";
    }
    if (isOffline) {
      return "bg-red-500";
    }
    return "bg-green-500";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* 상태 표시 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{getNetworkStatus()}</span>
          </div>
        </div>

        {/* 플로팅 버튼 */}
        <Button
          onClick={toggleNetworkState}
          size="lg"
          className={`rounded-full shadow-lg transition-all duration-300 ${
            actualOfflineState
              ? "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {actualOfflineState ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
        </Button>

        {/* 설정 버튼 (추가 기능용) */}
        <Button
          size="sm"
          variant="outline"
          className="rounded-full shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          onClick={() => {
            toast({
              title: "Network Status",
              description: `Current: ${getNetworkStatus()}, Actual: ${isOffline ? "Offline" : "Online"}`,
            });
          }}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
