import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { CheckCircle, AlertTriangle, Calendar, MapPin, User } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";
import { useAppStore } from "@/stores";

export default function Inspections() {
  const { api_ip } = useAppStore();
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
        console.log("fetch status", res.status, res.url);
        return res.json();
      })
      .then((data) => {
        console.log("실제 fetch 결과", data);
      })
      .catch((e) => {
        console.error("fetch error", e);
      });
  }, [api_ip]);

  // inspections가 undefined일 수 있으므로 안전하게 처리
  const inspectionsArray = Array.isArray(inspections) ? inspections : [];
  console.log("inspectionsArray", inspectionsArray);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return "text-green-600 bg-green-100";
      case "fair":
        return "text-yellow-600 bg-yellow-100";
      case "poor":
      case "needs-replacement":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (condition: string) => {
    switch (condition) {
      case "excellent":
      case "good":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "fair":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "poor":
      case "needs-replacement":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <MobileLayout title="Inspections" subtitle="All Inspection Records">
      {/* Summary Card */}
      <div className="inspection-card p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{inspectionsArray.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {inspectionsArray.filter((i) => ["excellent", "good"].includes(i.condition)).length}
            </div>
            <div className="text-xs text-muted-foreground">Passed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {inspectionsArray.filter((i) => ["fair", "poor", "needs-replacement"].includes(i.condition)).length}
            </div>
            <div className="text-xs text-muted-foreground">Need Attention</div>
          </div>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="inspection-card p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : inspectionsArray.length > 0 ? (
          inspectionsArray.map((inspection, idx) => (
            <div
              key={inspection.id || `${inspection.extinguisherId}-${inspection.date}-${idx}`}
              className="inspection-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(inspection.condition)}
                  <div>
                    <h3 className="font-semibold text-foreground">{inspection.extinguisherId}</h3>
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(
                        inspection.condition
                      )}`}
                    >
                      {inspection.condition.charAt(0).toUpperCase() + inspection.condition.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {new Date(inspection.date).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{inspection.inspectedBy}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{inspection.location}</span>
                </div>
                {inspection.pressure && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <span className="text-sm font-medium">Pressure:</span>
                    <span>{inspection.pressure}</span>
                  </div>
                )}
                {inspection.description && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">{inspection.description}</div>
                )}
                {inspection.photoUrl && (
                  <div className="mt-2">
                    <img
                      src={inspection.photoUrl}
                      alt="Inspection photo"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="inspection-card p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Inspections</h3>
            <p className="text-sm text-muted-foreground">Start by creating your first inspection from the home page.</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
