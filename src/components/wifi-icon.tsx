import { Wifi, WifiOff, Signal } from "lucide-react";

interface WifiIconProps {
  isOnline: boolean;
  connectionType: string | null;
  className?: string;
}

export default function WifiIcon({ isOnline, connectionType, className = "w-3 h-3" }: WifiIconProps) {
  // 오프라인인 경우
  if (!isOnline) {
    return <WifiOff className={className} />;
  }

  // 연결 타입에 따른 아이콘 선택
  if (connectionType === "4g" || connectionType === "5g") {
    return <Signal className={className} />;
  }

  // 기본 WiFi 아이콘
  return <Wifi className={className} />;
}
