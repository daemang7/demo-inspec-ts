import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FireExtinguisher, History, CheckCircle, AlertTriangle, WifiOff } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";
import { useAppStore } from "@/stores";
import InspectionForm from "@/components/inspection-form";

function removeDuplicates(inspections: any[]) {
  const seen = new Set();
  return inspections.filter((inspection) => {
    const hasRequiredData =
      inspection.inspectedBy && inspection.extinguisherId && inspection.location && inspection.pressure;
    if (!hasRequiredData) return false;
    const key = `${inspection.extinguisherId}-${inspection.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function Home() {
  const { api_ip, offline_mode, offline_data, offline_queue } = useAppStore();

  const {
    data: inspections,
    isLoading,
    error,
    refetch,
  } = useQuery<any[]>({
    queryKey: ["api", "inspections", api_ip],
    queryFn: async () => {
      const apiUrl = api_ip ? `http://${api_ip}/api/inspections` : "/api/inspections";
      const res = await fetch(apiUrl);
      return res.json();
    },
    staleTime: 0,
  });

  // api_ip가 바뀔 때마다 refetch
  useEffect(() => {
    if (api_ip) refetch();
  }, [api_ip, refetch]);

  // 화면이 활성화될 때마다 refetch
  useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refetch]);

  // fetch 디버깅: 실제로 어디로 요청되고, 응답이 뭔지 콘솔에 찍기
  useEffect(() => {
    const apiUrl = api_ip ? `http://${api_ip}/api/inspections` : "/api/inspections";
    fetch(apiUrl)
      .then((res) => {
        console.log("home.tsx fetch status", res.status, res.url);
        return res.json();
      })
      .then((data) => {
        console.log("home.tsx 실제 fetch 결과", data);
      })
      .catch((e) => {
        console.error("home.tsx fetch error", e);
      });
  }, [api_ip]);

  // 온라인/오프라인 모드에 따라 데이터 분리
  const onlineInspections = Array.isArray(inspections) ? inspections : [];
  const offlineInspections = removeDuplicates([...offline_data, ...offline_queue]);

  // 현재 모드에 따라 표시할 데이터 선택
  const displayInspections = offline_mode ? offlineInspections : onlineInspections;

  // 최신 inspections를 먼저 표시하도록 날짜순 정렬
  const sortedInspections = [...displayInspections].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const recentInspections = sortedInspections.slice(0, 3);
  const inspectedCount = displayInspections.length;

  // 디버깅 로그
  console.log("onlineInspections", onlineInspections);
  console.log("offlineInspections", offlineInspections);
  console.log("displayInspections", displayInspections);
  console.log("sortedInspections", sortedInspections);
  console.log("recentInspections", recentInspections);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return "text-green-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
      case "needs-replacement":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "fair":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "poor":
      case "needs-replacement":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <MobileLayout>
      {/* Inspection Status Card */}
      <div className="inspection-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FireExtinguisher className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Equipment Inspection</h2>
              <p className="text-sm text-muted-foreground">Fire Extinguisher</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
              {inspectedCount} INSPECTED
            </div>
            <p className="text-xs text-muted-foreground mt-1">EXTINGUISHERS</p>
          </div>
        </div>
      </div>

      {/* Inspection Form */}
      <InspectionForm />

      {/* Recent Inspections */}
      <div className="inspection-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            <History className="w-5 h-5 text-primary mr-2" />
            Recent Inspections
          </h3>
          {inspectedCount > 0 && <span className="text-xs text-muted-foreground">{inspectedCount} total</span>}
        </div>

        {!api_ip ? (
          <div className="text-center py-6 text-yellow-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">API IP not configured</p>
            <p className="text-xs">Please configure API IP in settings</p>
          </div>
        ) : offline_mode ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
              <WifiOff className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Offline Mode - {offline_data.length} stored, {offline_queue.length} pending
              </span>
            </div>
            {recentInspections.length > 0 ? (
              <>
                {recentInspections.map((inspection) => {
                  const isPending = offline_queue.some((item) => item.id === inspection.id);
                  return (
                    <div
                      key={inspection.id}
                      className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                        isPending ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          {getStatusIcon(inspection.condition)}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{inspection.extinguisherId}</p>
                          <p className="text-xs text-muted-foreground">
                            {inspection.location} • {inspection.inspectedBy}
                            {isPending && <span className="text-orange-600 ml-1">(Pending)</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {new Date(inspection.date).toLocaleDateString()}
                        </p>
                        <p className={`text-xs capitalize ${getConditionColor(inspection.condition)}`}>
                          {inspection.condition}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {inspectedCount > 3 && (
                  <div className="text-center pt-2">
                    <p className="text-xs text-muted-foreground">+{inspectedCount - 3} more inspections</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FireExtinguisher className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No offline inspections yet</p>
                <p className="text-xs">Complete your first offline inspection above</p>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-red-600">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Failed to load inspections</p>
            <p className="text-xs">Please check your connection</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentInspections.length > 0 ? (
          <div className="space-y-3">
            {recentInspections.map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(inspection.condition)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{inspection.extinguisherId}</p>
                    <p className="text-xs text-muted-foreground">
                      {inspection.location} • {inspection.inspectedBy}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{new Date(inspection.date).toLocaleDateString()}</p>
                  <p className={`text-xs capitalize ${getConditionColor(inspection.condition)}`}>
                    {inspection.condition}
                  </p>
                </div>
              </div>
            ))}
            {inspectedCount > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-muted-foreground">+{inspectedCount - 3} more inspections</p>
              </div>
            )}
          </div>
        ) : !api_ip ? (
          <div className="text-center py-8 text-muted-foreground">
            <FireExtinguisher className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">API IP not configured</p>
            <p className="text-xs">Configure API IP to load inspections</p>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FireExtinguisher className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No inspections yet</p>
            <p className="text-xs">Complete your first inspection above</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
