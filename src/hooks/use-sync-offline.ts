import { useEffect } from "react";
import { useOffline } from "./use-offline";
import { getSyncQueue, removeFromSyncQueue } from "@/lib/offline-storage";
import { apiRequest } from "@/lib/api-client";
import { useToast } from "./use-toast";
import { useAppStore } from "@/stores";
import { useSyncStatus } from "./use-sync-status";

export function useSyncOffline() {
  const isOffline = useOffline();
  const { toast } = useToast();
  const { offline_queue, removeFromOfflineQueue, clearOfflineQueue } = useAppStore();
  const { syncStatus, startSync, updateSyncProgress, completeSync } = useSyncStatus();

  useEffect(() => {
    // 온라인 상태가 되었을 때만 동기화 실행
    if (!isOffline) {
      syncOfflineData();
      syncOfflineQueue();
    }
  }, [isOffline]);

  const syncOfflineData = async () => {
    const syncQueue = getSyncQueue();

    if (syncQueue.length === 0) {
      return;
    }

    console.log(`Syncing ${syncQueue.length} offline items...`);

    let successCount = 0;
    let errorCount = 0;

    for (const item of syncQueue) {
      try {
        console.log(`Syncing item: ${item.id} to ${item.endpoint}`);

        const response = await apiRequest.post(item.endpoint, item.data);

        if (response.data) {
          // 성공적으로 동기화된 항목 제거
          removeFromSyncQueue(item.id);
          successCount++;
          console.log(`Successfully synced item: ${item.id}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Failed to sync item ${item.id}:`, error);
      }
    }

    // 동기화 결과 알림
    if (successCount > 0) {
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${successCount} items${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Sync Errors",
        description: `${errorCount} items failed to sync. They will be retried later.`,
        variant: "destructive",
      });
    }
  };

  const syncOfflineQueue = async () => {
    if (offline_queue.length === 0) {
      return;
    }

    console.log(`Syncing ${offline_queue.length} offline queue items...`);

    // 애니메이션 시작
    startSync(offline_queue.length);

    let successCount = 0;
    let errorCount = 0;

    // 순서대로 동기화 (FIFO)
    for (let i = 0; i < offline_queue.length; i++) {
      const inspection = offline_queue[i];

      try {
        console.log(`Syncing inspection: ${inspection.id} - ${inspection.extinguisherId}`);

        // 진행 상황 업데이트
        updateSyncProgress(i + 1, `Syncing ${inspection.extinguisherId}...`);

        const response = await apiRequest.post("/api/inspections", inspection);

        if (response.data) {
          // 성공적으로 동기화된 항목 제거
          removeFromOfflineQueue(inspection.id);
          successCount++;
          console.log(`Successfully synced inspection: ${inspection.id}`);
        }
      } catch (error: any) {
        errorCount++;
        // 409 Conflict 처리
        if (error?.response?.status === 409) {
          console.warn(`409 Conflict for inspection ${inspection.id}, removing from queue.`);
          removeFromOfflineQueue(inspection.id);
          toast({
            title: "Conflict",
            description: `Inspection ${inspection.extinguisherId} already exists. Removed from queue.`,
            variant: "destructive",
          });
        } else {
          console.error(`Failed to sync inspection ${inspection.id}:`, error);
        }
      }
    }

    // 애니메이션 완료
    completeSync();

    // 동기화 결과 알림
    if (successCount > 0) {
      toast({
        title: "Offline Queue Sync Complete",
        description: `Successfully synced ${successCount} inspections${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
      });
    }

    if (errorCount > 0) {
      toast({
        title: "Offline Queue Sync Errors",
        description: `${errorCount} inspections failed to sync. They will be retried later.`,
        variant: "destructive",
      });
    }
  };

  return { syncOfflineData, syncOfflineQueue, syncStatus };
}
