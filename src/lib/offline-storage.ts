import { idbStorage } from "./indexeddb-storage";

const memoryStorage: Record<string, string> = {};

async function getBestStorage() {
  // 1. IndexedDB
  try {
    await idbStorage.setItem("__test__", "1");
    await idbStorage.removeItem("__test__");
    return idbStorage;
  } catch {}
  // 2. localStorage
  try {
    if (typeof window !== "undefined" && window.localStorage && typeof window.localStorage.setItem === "function") {
      window.localStorage.setItem("__test__", "1");
      window.localStorage.removeItem("__test__");
      return {
        getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),
        removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key)),
      };
    }
  } catch {}
  // 3. memory fallback
  return {
    getItem: (key: string) => Promise.resolve(memoryStorage[key] ?? null),
    setItem: (key: string, value: string) => {
      memoryStorage[key] = value;
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      delete memoryStorage[key];
      return Promise.resolve();
    },
  };
}

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
export async function saveOfflineInspection(data: any): Promise<string> {
  const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const inspection: OfflineInspection = {
    id,
    data,
    timestamp: Date.now(),
    synced: false,
  };
  const storage = await getBestStorage();
  const existingRaw = await storage.getItem(OFFLINE_INSPECTIONS_KEY);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  existing.push(inspection);
  await storage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify(existing));
  console.log("Saved offline inspection:", inspection);
  return id;
}

// 오프라인 검사 데이터 가져오기
export async function getOfflineInspections(): Promise<OfflineInspection[]> {
  try {
    const storage = await getBestStorage();
    const stored = await storage.getItem(OFFLINE_INSPECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading offline inspections:", error);
    return [];
  }
}

// 동기화된 검사 데이터 제거
export async function removeSyncedInspection(id: string): Promise<void> {
  const storage = await getBestStorage();
  const inspections = await getOfflineInspections();
  const filtered = inspections.filter((inspection) => inspection.id !== id);
  await storage.setItem(OFFLINE_INSPECTIONS_KEY, JSON.stringify(filtered));
}

// 동기화 큐에 추가
export async function addToSyncQueue(endpoint: string, data: any): Promise<string> {
  const id = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const queueItem: SyncQueueItem = {
    id,
    endpoint,
    data,
    timestamp: Date.now(),
  };
  const storage = await getBestStorage();
  const existingRaw = await storage.getItem(OFFLINE_SYNC_QUEUE_KEY);
  const existing = existingRaw ? JSON.parse(existingRaw) : [];
  existing.push(queueItem);
  await storage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(existing));
  console.log("Added to sync queue:", queueItem);
  return id;
}

// 동기화 큐 가져오기
export async function getSyncQueue(): Promise<SyncQueueItem[]> {
  try {
    const storage = await getBestStorage();
    const stored = await storage.getItem(OFFLINE_SYNC_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading sync queue:", error);
    return [];
  }
}

// 동기화 큐에서 제거
export async function removeFromSyncQueue(id: string): Promise<void> {
  const storage = await getBestStorage();
  const queue = await getSyncQueue();
  const filtered = queue.filter((item) => item.id !== id);
  await storage.setItem(OFFLINE_SYNC_QUEUE_KEY, JSON.stringify(filtered));
}

// 로컬 스토리지 정리
export async function clearOfflineData(): Promise<void> {
  const storage = await getBestStorage();
  await storage.removeItem(OFFLINE_INSPECTIONS_KEY);
  await storage.removeItem(OFFLINE_SYNC_QUEUE_KEY);
  console.log("Cleared all offline data");
}

// 오프라인 데이터 개수 확인
export async function getOfflineDataCount(): Promise<{ inspections: number; syncQueue: number }> {
  const inspections = await getOfflineInspections();
  const syncQueue = await getSyncQueue();
  return {
    inspections: inspections.length,
    syncQueue: syncQueue.length,
  };
}
