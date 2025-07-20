import React, { useState } from "react";
import { useStoreState, useStoreActions, storeUtils } from "../stores";
import { Inspection } from "../types/schema";
import { ApiIpModal } from "./api-ip-modal";

export const StoreExample: React.FC = () => {
  const { api_ip, offline_mode, offline_data, isInitialized } = useStoreState();
  const {
    setApiIp,
    setOfflineMode,
    toggleOfflineMode,
    addInspection,
    updateInspection,
    deleteInspection,
    getAllInspections,
    clearAllInspections,
  } = useStoreActions();

  const [showApiIpModal, setShowApiIpModal] = useState(false);

  const [newIp, setNewIp] = useState("");
  const [newInspection, setNewInspection] = useState<Omit<Inspection, "id">>({
    extinguisherId: "",
    location: "",
    condition: "good",
    inspectedBy: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleAddInspection = () => {
    const inspection = storeUtils.createInspection(newInspection);
    addInspection(inspection);
    setNewInspection({
      extinguisherId: "",
      location: "",
      condition: "good",
      inspectedBy: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleUpdateInspection = (id: string) => {
    updateInspection(id, { condition: "excellent" });
  };

  const stats = storeUtils.getInspectionStats(offline_data);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Zustand Store Example</h2>

      {/* API IP Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API IP Configuration</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            placeholder="Enter IPv4 address (e.g., 192.168.1.1)"
            className="px-3 py-2 border rounded"
          />
          <button
            onClick={() => setApiIp(newIp)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Set IP
          </button>
          <button
            onClick={() => setShowApiIpModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Open Modal
          </button>
        </div>
        <p>Current API IP: {api_ip || "Not set"}</p>
        <p className="text-sm text-gray-600">App Initialized: {isInitialized ? "Yes" : "No"}</p>
        {!api_ip && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800 text-sm">⚠️ API IP가 설정되지 않았습니다. 모달을 통해 설정해주세요.</p>
          </div>
        )}
      </div>

      {/* Offline Mode Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Offline Mode</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOfflineMode(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Enable Offline Mode
          </button>
          <button
            onClick={() => setOfflineMode(false)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disable Offline Mode
          </button>
          <button onClick={toggleOfflineMode} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Toggle Offline Mode
          </button>
        </div>
        <p>Offline Mode: {offline_mode ? "Enabled" : "Disabled"}</p>
      </div>

      {/* Inspection Management Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Inspection Management</h3>

        {/* Add New Inspection */}
        <div className="space-y-2">
          <h4 className="font-medium">Add New Inspection</h4>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newInspection.extinguisherId}
              onChange={(e) => setNewInspection((prev) => ({ ...prev, extinguisherId: e.target.value }))}
              placeholder="Extinguisher ID"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={newInspection.location}
              onChange={(e) => setNewInspection((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
              className="px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={newInspection.inspectedBy}
              onChange={(e) => setNewInspection((prev) => ({ ...prev, inspectedBy: e.target.value }))}
              placeholder="Inspected By"
              className="px-3 py-2 border rounded"
            />
            <select
              value={newInspection.condition}
              onChange={(e) =>
                setNewInspection((prev) => ({ ...prev, condition: e.target.value as Inspection["condition"] }))
              }
              className="px-3 py-2 border rounded"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
              <option value="needs-replacement">Needs Replacement</option>
            </select>
          </div>
          <button onClick={handleAddInspection} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Add Inspection
          </button>
        </div>

        {/* Statistics */}
        <div className="space-y-2">
          <h4 className="font-medium">Statistics</h4>
          <p>Total Inspections: {stats.total}</p>
          <div className="space-y-1">
            <p className="font-medium">By Condition:</p>
            {Object.entries(stats.byCondition).map(([condition, count]) => (
              <p key={condition} className="ml-4">
                • {condition}: {count}
              </p>
            ))}
          </div>
        </div>

        {/* Inspections List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Inspections ({offline_data.length})</h4>
            <button
              onClick={clearAllInspections}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {offline_data.map((inspection) => (
              <div key={inspection.id} className="p-3 border rounded space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">ID: {inspection.extinguisherId}</p>
                    <p>Location: {inspection.location}</p>
                    <p>Inspected By: {inspection.inspectedBy}</p>
                    <p>Date: {inspection.date}</p>
                    <p>Condition: {inspection.condition}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleUpdateInspection(inspection.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteInspection(inspection.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {offline_data.length === 0 && <p className="text-gray-500 text-center py-4">No inspections found</p>}
          </div>
        </div>
      </div>

      {/* API IP Modal */}
      <ApiIpModal isOpen={showApiIpModal} onClose={() => setShowApiIpModal(false)} />
    </div>
  );
};
