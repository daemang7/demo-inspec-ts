import { useAppStore } from "./app-store";
import { Inspection } from "../types/schema";

// Utility functions for working with the store
export const storeUtils = {
  // Validation helpers
  isValidIPv4: (ip: string): boolean => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
  },

  // Inspection helpers
  createInspection: (data: Omit<Inspection, "id">): Inspection => {
    return {
      ...data,
      id: crypto.randomUUID(),
    };
  },

  // Search and filter helpers
  searchInspections: (inspections: Inspection[], query: string): Inspection[] => {
    const lowerQuery = query.toLowerCase();
    return inspections.filter(
      (inspection) =>
        inspection.extinguisherId.toLowerCase().includes(lowerQuery) ||
        inspection.location.toLowerCase().includes(lowerQuery) ||
        inspection.inspectedBy.toLowerCase().includes(lowerQuery) ||
        inspection.description?.toLowerCase().includes(lowerQuery)
    );
  },

  // Statistics helpers
  getInspectionStats: (inspections: Inspection[]) => {
    const total = inspections.length;
    const byCondition = inspections.reduce((acc, inspection) => {
      acc[inspection.condition] = (acc[inspection.condition] || 0) + 1;
      return acc;
    }, {} as Record<Inspection["condition"], number>);

    const byLocation = inspections.reduce((acc, inspection) => {
      acc[inspection.location] = (acc[inspection.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byCondition,
      byLocation,
    };
  },
};

// Hook for getting store state with selectors
export const useStoreState = () => {
  const api_ip = useAppStore((state) => state.api_ip);
  const offline_mode = useAppStore((state) => state.offline_mode);
  const offline_data = useAppStore((state) => state.offline_data);
  const isInitialized = useAppStore((state) => state.isInitialized);

  return {
    api_ip,
    offline_mode,
    offline_data,
    isInitialized,
  };
};

// Hook for getting store actions
export const useStoreActions = () => {
  const setApiIp = useAppStore((state) => state.setApiIp);
  const getApiIp = useAppStore((state) => state.getApiIp);
  const setOfflineMode = useAppStore((state) => state.setOfflineMode);
  const toggleOfflineMode = useAppStore((state) => state.toggleOfflineMode);
  const getOfflineMode = useAppStore((state) => state.getOfflineMode);
  const addInspection = useAppStore((state) => state.addInspection);
  const updateInspection = useAppStore((state) => state.updateInspection);
  const deleteInspection = useAppStore((state) => state.deleteInspection);
  const getInspection = useAppStore((state) => state.getInspection);
  const getAllInspections = useAppStore((state) => state.getAllInspections);
  const clearAllInspections = useAppStore((state) => state.clearAllInspections);
  const getInspectionsByLocation = useAppStore((state) => state.getInspectionsByLocation);
  const getInspectionsByCondition = useAppStore((state) => state.getInspectionsByCondition);
  const setInitialized = useAppStore((state) => state.setInitialized);

  return {
    setApiIp,
    getApiIp,
    setOfflineMode,
    toggleOfflineMode,
    getOfflineMode,
    addInspection,
    updateInspection,
    deleteInspection,
    getInspection,
    getAllInspections,
    clearAllInspections,
    getInspectionsByLocation,
    getInspectionsByCondition,
    setInitialized,
  };
};

// DevTools 유틸리티 함수들
export const devToolsUtils = {
  // 현재 상태를 JSON으로 내보내기
  exportState: () => {
    const state = useAppStore.getState();
    const stateJson = JSON.stringify(state, null, 2);
    const blob = new Blob([stateJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `app-store-state-${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // 상태를 JSON에서 가져오기
  importState: (jsonString: string) => {
    try {
      const state = JSON.parse(jsonString);
      // 주의: 이는 위험할 수 있으므로 개발 환경에서만 사용
      if (process.env.NODE_ENV === "development") {
        console.log("Importing state:", state);
        // 실제 구현에서는 더 안전한 방법을 사용해야 함
      }
    } catch (error) {
      console.error("Failed to import state:", error);
    }
  },

  // 상태 통계 정보
  getStateStats: () => {
    const state = useAppStore.getState();
    return {
      totalInspections: state.offline_data.length,
      apiIpSet: !!state.api_ip,
      offlineMode: state.offline_mode,
      isInitialized: state.isInitialized,
      inspectionsByCondition: state.offline_data.reduce((acc, inspection) => {
        acc[inspection.condition] = (acc[inspection.condition] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },

  // 상태 리셋
  resetState: () => {
    if (process.env.NODE_ENV === "development") {
      useAppStore.setState({
        api_ip: "",
        offline_mode: false,
        offline_data: [],
        isInitialized: false,
      });
    }
  },
};
