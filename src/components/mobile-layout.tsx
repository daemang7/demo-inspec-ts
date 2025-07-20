import { ReactNode } from "react";
import { Signal, Bell, UserCircle, Menu } from "lucide-react";
import BottomNavigation from "./bottom-navigation";
import { useDeviceStatus } from "@/hooks/use-device-status";
import WifiIcon from "./wifi-icon";
import BatteryIcon from "./battery-icon";

interface MobileLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function MobileLayout({
  children,
  title = "Fire Safety Inspection",
  subtitle = "Equipment Management",
}: MobileLayoutProps) {
  const { isOnline, connectionType, batteryLevel, isCharging } = useDeviceStatus();
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="mobile-container bg-white">
      {/* Status Bar */}
      <div className="status-bar text-white px-4 py-2 flex justify-between items-center text-sm">
        <div className="flex items-center space-x-1">
          {/* <Signal className="w-3 h-3" /> */}
          <span className="text-xs">AltumLab Sample Application</span>
        </div>
        <div className="flex items-center space-x-2">
          <WifiIcon isOnline={isOnline} connectionType={connectionType} />
          <div className="flex items-center space-x-1">
            <BatteryIcon level={batteryLevel} isCharging={isCharging} />
            {batteryLevel !== null && <span className="text-xs">{Math.round(batteryLevel * 100)}%</span>}
          </div>
          <span className="text-xs">{currentTime}</span>
        </div>
      </div>

      {/* App Header */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <UserCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 pb-20 space-y-4">{children}</div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
