import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, TrendingDown, Calendar, PieChart, FileText } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";
import { Inspection } from "@shared/schema";

export default function Report() {
  const {
    data: inspections,
    isLoading,
    error,
  } = useQuery<Inspection[]>({
    queryKey: ["/api/inspections"],
  });

  console.log("Report - inspections data:", inspections);
  console.log("Report - isLoading:", isLoading);
  console.log("Report - error:", error);

  // inspections가 undefined일 수 있으므로 안전하게 처리
  const inspectionsArray = Array.isArray(inspections) ? inspections : [];

  const totalInspections = inspectionsArray.length;
  const passedInspections = inspectionsArray.filter((i) => ["excellent", "good"].includes(i.condition)).length;
  const failedInspections = inspectionsArray.filter((i) =>
    ["fair", "poor", "needs-replacement"].includes(i.condition)
  ).length;
  const passRate = totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 0;

  const getConditionStats = () => {
    const stats = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      "needs-replacement": 0,
    };

    inspectionsArray.forEach((inspection) => {
      if (stats.hasOwnProperty(inspection.condition)) {
        stats[inspection.condition as keyof typeof stats]++;
      }
    });

    return stats;
  };

  const conditionStats = getConditionStats();

  return (
    <MobileLayout title="Reports" subtitle="Inspection Analytics">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="inspection-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{passRate}%</div>
              <div className="text-xs text-muted-foreground">Pass Rate</div>
            </div>
          </div>
        </div>

        <div className="inspection-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalInspections}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <PieChart className="w-5 h-5 text-primary mr-2" />
          Condition Breakdown
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Excellent</span>
            </div>
            <span className="text-sm font-medium">{conditionStats.excellent}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Good</span>
            </div>
            <span className="text-sm font-medium">{conditionStats.good}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">Fair</span>
            </div>
            <span className="text-sm font-medium">{conditionStats.fair}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Poor</span>
            </div>
            <span className="text-sm font-medium">{conditionStats.poor}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">Needs Replacement</span>
            </div>
            <span className="text-sm font-medium">{conditionStats["needs-replacement"]}</span>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="inspection-card p-4 mb-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-primary mr-2" />
          Monthly Trend
        </h3>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {["January", "February", "March", "April", "May", "June"].map((month, index) => {
              const monthInspections = inspectionsArray.filter((i) => new Date(i.date).getMonth() === index);
              const monthPassed = monthInspections.filter((i) => ["excellent", "good"].includes(i.condition)).length;
              const monthTotal = monthInspections.length;
              const monthPassRate = monthTotal > 0 ? Math.round((monthPassed / monthTotal) * 100) : 0;

              return (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${monthPassRate}%` }}></div>
                    </div>
                    <span className="text-xs font-medium">{monthPassRate}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Section */}
      <div className="inspection-card p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <FileText className="w-5 h-5 text-primary mr-2" />
          Export Reports
        </h3>

        <div className="space-y-3">
          <button className="w-full p-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Export PDF Report
          </button>
          <button className="w-full p-3 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
            Export CSV Data
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}
