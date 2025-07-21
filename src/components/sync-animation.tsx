import { SyncStatus } from "@/hooks/use-sync-status";
import { Upload, CheckCircle, Loader2 } from "lucide-react";

interface SyncAnimationProps {
  syncStatus: SyncStatus;
}

export default function SyncAnimation({ syncStatus }: SyncAnimationProps) {
  if (!syncStatus.isSyncing && !syncStatus.isComplete) return null;

  const progress = syncStatus.totalItems > 0 ? (syncStatus.currentItem / syncStatus.totalItems) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            {syncStatus.isComplete ? (
              <div className="w-16 h-16 border-4 border-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <>
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              </>
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 animate-pulse">
            {syncStatus.isComplete ? "Sync Complete!" : "Syncing Data"}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {syncStatus.isComplete ? "All data has been synchronized successfully" : syncStatus.message}
          </p>
          <p className="text-xs text-gray-500">
            {syncStatus.isComplete
              ? `${syncStatus.totalItems} items synced`
              : `${syncStatus.currentItem} of ${syncStatus.totalItems} items`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className={`h-2 rounded-full transition-all duration-300 ease-out ${
              syncStatus.isComplete ? "bg-green-600" : "bg-blue-600"
            }`}
            style={{ width: `${syncStatus.isComplete ? 100 : progress}%` }}
          ></div>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>Starting</span>
          <span>Uploading</span>
          <span>Complete</span>
        </div>
      </div>
    </div>
  );
}
