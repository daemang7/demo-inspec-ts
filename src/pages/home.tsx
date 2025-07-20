import { useQuery } from "@tanstack/react-query";
import { FireExtinguisher, History, CheckCircle, AlertTriangle } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";
import InspectionForm from "@/components/inspection-form";
import { Inspection } from "@shared/schema";

export default function Home() {
  const { data: inspections = [], isLoading } = useQuery<Inspection[]>({
    queryKey: ["/api/inspections"],
  });

  const recentInspections = inspections.slice(0, 3);
  const inspectedCount = inspections.length;

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
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <History className="w-5 h-5 text-primary mr-2" />
          Recent Inspections
        </h3>
        
        {isLoading ? (
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
              <div key={inspection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                  <p className="text-xs text-muted-foreground">
                    {new Date(inspection.date).toLocaleDateString()}
                  </p>
                  <p className={`text-xs capitalize ${getConditionColor(inspection.condition)}`}>
                    {inspection.condition}
                  </p>
                </div>
              </div>
            ))}
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
