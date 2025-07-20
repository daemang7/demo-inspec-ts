import { useState, useEffect } from "react";

interface DeviceStatus {
  isOnline: boolean;
  connectionType: string | null;
  batteryLevel: number | null;
  isCharging: boolean | null;
}

export function useDeviceStatus(): DeviceStatus {
  const [status, setStatus] = useState<DeviceStatus>({
    isOnline: navigator.onLine,
    connectionType: null,
    batteryLevel: null,
    isCharging: null,
  });

  useEffect(() => {
    // 온라인/오프라인 상태 감지
    const handleOnline = () => setStatus((prev) => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus((prev) => ({ ...prev, isOnline: false }));

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 네트워크 연결 타입 감지 (Navigator.connection API)
    const updateConnectionType = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          setStatus((prev) => ({
            ...prev,
            connectionType: connection.effectiveType || connection.type || null,
          }));
        }
      }
    };

    // 배터리 상태 감지 (Battery API)
    const updateBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setStatus((prev) => ({
            ...prev,
            batteryLevel: battery.level,
            isCharging: battery.charging,
          }));

          // 배터리 상태 변경 이벤트 리스너
          const handleBatteryChange = () => {
            setStatus((prev) => ({
              ...prev,
              batteryLevel: battery.level,
              isCharging: battery.charging,
            }));
          };

          battery.addEventListener("levelchange", handleBatteryChange);
          battery.addEventListener("chargingchange", handleBatteryChange);

          return () => {
            battery.removeEventListener("levelchange", handleBatteryChange);
            battery.removeEventListener("chargingchange", handleBatteryChange);
          };
        } catch (error) {
          console.log("Battery API not supported");
        }
      }
    };

    updateConnectionType();
    updateBatteryStatus();

    // 네트워크 변경 감지
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener("change", updateConnectionType);
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          connection.removeEventListener("change", updateConnectionType);
        }
      }
    };
  }, []);

  return status;
}
