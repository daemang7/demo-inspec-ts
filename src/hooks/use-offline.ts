import { useState, useEffect } from "react";

// 전역 강제 오프라인 상태
let forcedOffline = false;

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);
  const [forcedState, setForcedState] = useState(forcedOffline);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Network connection restored");
      setIsOffline(false);
    };

    const handleOffline = () => {
      console.log("Network connection lost");
      setIsOffline(true);
    };

    const handleForcedOfflineChange = (event: CustomEvent) => {
      setForcedState(event.detail.forced);
    };

    // 초기 상태 설정
    setIsOffline(!navigator.onLine);

    // 이벤트 리스너 등록
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("forcedOfflineChange", handleForcedOfflineChange as EventListener);

    // 클린업
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("forcedOfflineChange", handleForcedOfflineChange as EventListener);
    };
  }, []);

  // 강제 오프라인 상태가 있으면 true 반환
  return isOffline || forcedState;
}

// 강제 오프라인 상태 설정 함수
export function setForcedOffline(forced: boolean) {
  forcedOffline = forced;
  // 모든 컴포넌트가 리렌더링되도록 이벤트 발생
  window.dispatchEvent(new CustomEvent("forcedOfflineChange", { detail: { forced } }));
}

// 강제 오프라인 상태 가져오기
export function getForcedOffline() {
  return forcedOffline;
}
