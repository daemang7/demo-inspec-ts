const OFFLINE_INSPECTIONS_KEY = "offline_inspections";
const OFFLINE_SYNC_QUEUE_KEY = "offline_sync_queue";

export interface OfflineInspection {
  id: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export interface SyncQueueItem {
  id: string;
  endpoint: string;
  data: any;
  timestamp: number;
}

// 오프라인 검사 데이터 저장
export function saveOfflineInspection(data: any): string {
  const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const inspection: OfflineInspection = {
    id,
    data,
    timestamp: Date.now(),
    synced: false,
  };

  const existing = getOfflineInspections();
  existing.push(inspection);
  localStorage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify(existing));

  console.log("Saved offline inspection:", inspection);
  return id;
}

// 오프라인 검사 데이터 가져오기
export function getOfflineInspections(): OfflineInspection[] {
  try {
    const stored = localStorage.getItem(OFFLINE_INSPECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading offline inspections:", error);
    return [];
  }
}

// 동기화된 검사 데이터 제거
export function removeSyncedInspection(id: string): void {
  const inspections = getOfflineInspections();
  const filtered = inspections.filter((inspection) => inspection.id !== id);
  localStorage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify(filtered));
}

// 동기화 큐에 추가
export function addToSyncQueue(endpoint: string, data: any): string {
  const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const queueItem: SyncQueueItem = {
    id,
    endpoint,
    data,
    timestamp: Date.now(),
  };

  const existing = getSyncQueue();
  existing.push(queueItem);
  localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(existing));

  console.log("Added to sync queue:", queueItem);
  return id;
}

// 동기화 큐 가져오기
export function getSyncQueue(): SyncQueueItem[] {
  try {
    const stored = localStorage.getItem(OFFLINE_SYNC_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading sync queue:", error);
    return [];
  }
}

// 동기화 큐에서 제거
export function removeFromSyncQueue(id: string): void {
  const queue = getSyncQueue();
  const filtered = queue.filter((item) => item.id !== id);
  localStorage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(filtered));
}

// 로컬 스토리지 정리
export function clearOfflineData(): void {
  localStorage.removeItem(OFFLINE_INSPECTIONS_KEY);
  localStorage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
  console.log("Cleared all offline data");
}

// 오프라인 데이터 개수 확인
export function getOfflineDataCount(): { inspections: number; syncQueue: number } {
  return {
    inspections: getOfflineInspections().length,
    syncQueue: getSyncQueue().length,
  };
}
