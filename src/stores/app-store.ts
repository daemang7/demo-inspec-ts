import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Inspection } from "../types/schema";

interface AppState {
  // State
  api_ip: string;
  offline_mode: boolean;
  offline_data: Inspection[];
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

  // Initialization
  setInitialized: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      api_ip: "",
      offline_mode: false,
      offline_data: [],
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

      // Initialization
      setInitialized: () => {
        set({ isInitialized: true }, false, "setInitialized");
      },
    }),
    {
      name: "app-store", // Redux DevTools에서 표시될 이름
      enabled: process.env.NODE_ENV === "development", // 개발 환경에서만 활성화
    }
  )
);
