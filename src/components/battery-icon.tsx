import { Battery, BatteryCharging } from "lucide-react";

interface BatteryIconProps {
  level: number | null;
  isCharging: boolean | null;
  className?: string;
}

export default function BatteryIcon({ level, isCharging, className = "w-3 h-3" }: BatteryIconProps) {
  // 배터리 레벨이 없으면 기본 아이콘 표시
  if (level === null) {
    return <Battery className={className} />;
  }

  // 충전 중인 경우
  if (isCharging) {
    return <BatteryCharging className={className} />;
  }

  // 배터리 레벨에 따른 아이콘 선택 (모든 레벨에서 기본 Battery 아이콘 사용)
  return <Battery className={className} />;
}
