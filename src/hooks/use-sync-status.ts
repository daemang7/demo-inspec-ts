import { useState, useEffect } from "react";

export interface SyncStatus {
  isSyncing: boolean;
  isComplete: boolean;
  currentItem: number;
  totalItems: number;
  message: string;
}

export function useSyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    isComplete: false,
    currentItem: 0,
    totalItems: 0,
    message: "",
  });

  const startSync = (totalItems: number) => {
    setSyncStatus({
      isSyncing: true,
      isComplete: false,
      currentItem: 0,
      totalItems,
      message: "Starting sync...",
    });
  };

  const updateSyncProgress = (currentItem: number, message: string) => {
    setSyncStatus((prev) => ({
      ...prev,
      currentItem,
      message,
    }));
  };

  const completeSync = () => {
    setSyncStatus({
      isSyncing: false,
      isComplete: true,
      currentItem: 0,
      totalItems: 0,
      message: "",
    });
  };

  // 완료 후 3초 뒤에 상태 초기화
  useEffect(() => {
    if (syncStatus.isComplete) {
      const timer = setTimeout(() => {
        setSyncStatus({
          isSyncing: false,
          isComplete: false,
          currentItem: 0,
          totalItems: 0,
          message: "",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [syncStatus.isComplete]);

  return {
    syncStatus,
    startSync,
    updateSyncProgress,
    completeSync,
  };
}
