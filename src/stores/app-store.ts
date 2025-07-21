import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Inspection } from "../types/schema";

interface AppState {
  // State
  api_ip: string;
  offline_mode: boolean;
  offline_data: Inspection[];
  offline_queue: Inspection[]; // 오프라인에서 추가된 대기열
  isInitialized: boolean;

  // Actions for api_ip
  setApiIp: (ip: string) => void;
  getApiIp: () => string;

  // Actions for offline_mode
  setOfflineMode: (mode: boolean) => void;
  toggleOfflineMode: () => void;
  getOfflineMode: () => boolean;

  // Actions for offline_data (CRUD operations)
  addInspection: (inspection: Inspection) => void;
  updateInspection: (id: string, updates: Partial<Inspection>) => void;
  deleteInspection: (id: string) => void;
  getInspection: (id: string) => Inspection | undefined;
  getAllInspections: () => Inspection[];
  clearAllInspections: () => void;
  getInspectionsByLocation: (location: string) => Inspection[];
  getInspectionsByCondition: (condition: Inspection["condition"]) => Inspection[];

  // Actions for offline_queue (대기열 관리)
  addToOfflineQueue: (inspection: Inspection) => void;
  removeFromOfflineQueue: (id: string) => void;
  getOfflineQueue: () => Inspection[];
  clearOfflineQueue: () => void;

  // Initialization
  setInitialized: () => void;

  // Test action for devtools
  testAction: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Store 초기화 로그
      _init: () => {
        console.log("Zustand store initialized with devtools");
      },
      // Initial state
      api_ip: "",
      offline_mode: false,
      offline_data: [],
      offline_queue: [],
      isInitialized: false,

      // api_ip actions
      setApiIp: (ip: string) => {
        // Validate IPv4 format
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        if (!ipv4Regex.test(ip)) {
          console.warn("Invalid IPv4 format:", ip);
          return;
        }
        set({ api_ip: ip }, false, "setApiIp"); // devtools 액션 이름 지정
      },

      getApiIp: () => get().api_ip,

      // offline_mode actions
      setOfflineMode: (mode: boolean) => set({ offline_mode: mode }, false, "setOfflineMode"),

      toggleOfflineMode: () => set((state) => ({ offline_mode: !state.offline_mode }), false, "toggleOfflineMode"),

      getOfflineMode: () => get().offline_mode,

      // offline_data CRUD actions
      addInspection: (inspection: Inspection) => {
        // 최소 필수 데이터 확인
        const hasRequiredData =
          inspection.inspectedBy && inspection.extinguisherId && inspection.location && inspection.pressure;

        if (!hasRequiredData) {
          console.log("Skipping inspection with missing required data:", inspection);
          return; // 필수 데이터가 없으면 추가하지 않음
        }

        // 중복 체크
        const currentState = get();
        const isDuplicate = currentState.offline_data.some(
          (existing) => existing.extinguisherId === inspection.extinguisherId && existing.date === inspection.date
        );

        if (isDuplicate) {
          console.log("Skipping duplicate inspection:", inspection);
          return; // 중복이면 추가하지 않음
        }

        set(
          (state) => ({
            offline_data: [...state.offline_data, inspection],
          }),
          false,
          `addInspection: ${inspection.extinguisherId}`
        );
      },

      updateInspection: (id: string, updates: Partial<Inspection>) => {
        set(
          (state) => ({
            offline_data: state.offline_data.map((inspection) =>
              inspection.id === id ? { ...inspection, ...updates } : inspection
            ),
          }),
          false,
          `updateInspection: ${id}`
        );
      },

      deleteInspection: (id: string) => {
        set(
          (state) => ({
            offline_data: state.offline_data.filter((inspection) => inspection.id !== id),
          }),
          false,
          `deleteInspection: ${id}`
        );
      },

      getInspection: (id: string) => {
        return get().offline_data.find((inspection) => inspection.id === id);
      },

      getAllInspections: () => get().offline_data,

      clearAllInspections: () => set({ offline_data: [] }, false, "clearAllInspections"),

      getInspectionsByLocation: (location: string) => {
        return get().offline_data.filter((inspection) =>
          inspection.location.toLowerCase().includes(location.toLowerCase())
        );
      },

      getInspectionsByCondition: (condition: Inspection["condition"]) => {
        return get().offline_data.filter((inspection) => inspection.condition === condition);
      },

      // offline_queue actions
      addToOfflineQueue: (inspection: Inspection) => {
        console.log("addToOfflineQueue called with:", inspection);

        // 최소 필수 데이터 확인
        const hasRequiredData =
          inspection.inspectedBy && inspection.extinguisherId && inspection.location && inspection.pressure;

        if (!hasRequiredData) {
          console.log("Skipping inspection with missing required data:", inspection);
          return; // 필수 데이터가 없으면 추가하지 않음
        }

        // 중복 체크 (더 엄격한 체크)
        const currentState = get();
        const isDuplicate = currentState.offline_queue.some(
          (existing) =>
            existing.extinguisherId === inspection.extinguisherId &&
            existing.inspectedBy === inspection.inspectedBy &&
            existing.date === inspection.date
        );

        if (isDuplicate) {
          console.log("Skipping duplicate inspection (extinguisherId + inspectedBy + date):", inspection);
          return; // 중복이면 추가하지 않음
        }

        console.log("Adding inspection to offline queue:", inspection);

        set(
          (state) => ({
            offline_queue: [...state.offline_queue, inspection],
          }),
          false,
          `addToOfflineQueue: ${inspection.extinguisherId}`
        );

        console.log("Offline queue updated successfully");
      },

      removeFromOfflineQueue: (id: string) => {
        set(
          (state) => ({
            offline_queue: state.offline_queue.filter((inspection) => inspection.id !== id),
          }),
          false,
          `removeFromOfflineQueue: ${id}`
        );
      },

      getOfflineQueue: () => get().offline_queue,

      clearOfflineQueue: () => set({ offline_queue: [] }, false, "clearOfflineQueue"),

      // Initialization
      setInitialized: () => {
        set({ isInitialized: true }, false, "setInitialized");
      },

      // Test action for devtools
      testAction: () => {
        console.log("Test action called");
        set(
          (state) => ({
            api_ip: state.api_ip + "_test",
          }),
          false,
          "testAction"
        );
      },
    }),
    {
      name: "Inspection App Store", // Redux DevTools에서 표시될 이름
      enabled: process.env.NODE_ENV === "development", // 개발 환경에서만 활성화
    }
  )
);
