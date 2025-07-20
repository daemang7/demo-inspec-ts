import React, { useState } from "react";
import { useApiRequest } from "../hooks";
import { ApiIpModal } from "./api-ip-modal";
import { Inspection } from "../types/schema";
import { debugApiClient } from "../lib/api-client";

export const ApiExample: React.FC = () => {
  const [showApiIpModal, setShowApiIpModal] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("/api/inspections");

  const {
    data: inspections,
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    showApiIpModal: showModal,
    closeApiIpModal: closeModal,
  } = useApiRequest<Inspection[]>();

  const handleGetInspections = async () => {
    try {
      await get(selectedEndpoint, {
        onSuccess: (data) => {
          console.log("Inspections loaded:", data);
        },
        onError: (error) => {
          console.error("Failed to load inspections:", error);
        },
      });
    } catch (error) {
      // 에러는 이미 useApiRequest에서 처리됨
    }
  };

  const handleCreateInspection = async () => {
    const newInspection: Omit<Inspection, "id"> = {
      extinguisherId: "EXT001",
      location: "Test Location",
      condition: "good",
      inspectedBy: "Test User",
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await post(selectedEndpoint, newInspection, {
        onSuccess: (data) => {
          console.log("Inspection created:", data);
        },
        onError: (error) => {
          console.error("Failed to create inspection:", error);
        },
      });
    } catch (error) {
      // 에러는 이미 useApiRequest에서 처리됨
    }
  };

  const handleUpdateInspection = async () => {
    const updateData = {
      condition: "excellent" as const,
    };

    try {
      await put(`${selectedEndpoint}/1`, updateData, {
        onSuccess: (data) => {
          console.log("Inspection updated:", data);
        },
        onError: (error) => {
          console.error("Failed to update inspection:", error);
        },
      });
    } catch (error) {
      // 에러는 이미 useApiRequest에서 처리됨
    }
  };

  const handleDeleteInspection = async () => {
    try {
      await del(`${selectedEndpoint}/1`, {
        onSuccess: (data) => {
          console.log("Inspection deleted:", data);
        },
        onError: (error) => {
          console.error("Failed to delete inspection:", error);
        },
      });
    } catch (error) {
      // 에러는 이미 useApiRequest에서 처리됨
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">API Client Example</h2>

      {/* API IP Modal */}
      <ApiIpModal isOpen={showModal} onClose={closeModal} />

      {/* Manual API IP Modal Trigger */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API Configuration</h3>
        <button
          onClick={() => setShowApiIpModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Configure API IP
        </button>
      </div>

      {/* API Endpoint Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API Endpoints</h3>
        <div className="flex gap-2">
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="/api/inspections">/api/inspections</option>
            <option value="/api/inspections/1">/api/inspections/1</option>
            <option value="/api/health">/api/health</option>
            <option value="/api/status">/api/status</option>
          </select>
        </div>
      </div>

      {/* API Actions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">API Actions</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleGetInspections}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "GET Inspections"}
          </button>

          <button
            onClick={handleCreateInspection}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "POST Inspection"}
          </button>

          <button
            onClick={handleUpdateInspection}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "PUT Inspection"}
          </button>

          <button
            onClick={handleDeleteInspection}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "DELETE Inspection"}
          </button>

          <button onClick={debugApiClient} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Debug API Client
          </button>
        </div>
      </div>

      {/* Status Display */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Status</h3>

        {loading && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800">Loading...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700">{error.message}</p>
            {error.status && <p className="text-red-600 text-sm">Status: {error.status}</p>}
            {error.isNetworkError && <p className="text-red-600 text-sm">Network Error</p>}
            {error.isCorsError && <p className="text-red-600 text-sm">CORS Error</p>}
          </div>
        )}

        {inspections && (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-medium">Success!</p>
            <p className="text-green-700">Loaded {inspections.length} inspections</p>
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(inspections, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* API IP Modal */}
      <ApiIpModal isOpen={showApiIpModal} onClose={() => setShowApiIpModal(false)} />
    </div>
  );
};
