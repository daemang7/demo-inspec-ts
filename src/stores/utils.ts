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
