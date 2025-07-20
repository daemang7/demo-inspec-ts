import { useState, useCallback } from "react";
import { useAppStore } from "../stores";
import { ApiError } from "../lib/api-client";

export const useApiErrorHandler = () => {
  const { api_ip } = useAppStore();
  const [showApiIpModal, setShowApiIpModal] = useState(false);

  const handleApiError = useCallback(
    (error: ApiError | Error) => {
      console.error("API Error handled:", error);

      // API IP가 설정되지 않은 경우
      if (!api_ip) {
        setShowApiIpModal(true);
        return;
      }

      // 네트워크 에러인 경우 (서버에 연결할 수 없음)
      if ("isNetworkError" in error && error.isNetworkError) {
        setShowApiIpModal(true);
        return;
      }

      // CORS 에러인 경우 - HTTP 응답이 오는 경우는 성공으로 처리
      if ("isCorsError" in error && error.isCorsError) {
        // CORS 에러가 발생해도 실제로는 서버가 응답한 것일 수 있음
        console.warn("CORS error detected, but this might be a false positive:", error.message);
        return;
      }

      // HTTP 에러 (404, 502 등)
      if ("status" in error && error.status) {
        // 서버 연결은 되지만 API 엔드포인트가 없는 경우
        if (error.status === 404) {
          console.warn("API endpoint not found. Please check the server configuration.");
          return;
        }

        // 서버 에러 (502, 503, 500 등)
        if (error.status >= 500) {
          console.error("Server error:", error.message);
          return;
        }

        // 클라이언트 에러 (400, 401, 403 등)
        if (error.status >= 400 && error.status < 500) {
          console.error("Client error:", error.message);
          return;
        }
      }

      // 기타 에러는 콘솔에만 출력
      console.error("Unhandled API error:", error);
    },
    [api_ip]
  );

  const closeApiIpModal = useCallback(() => {
    setShowApiIpModal(false);
  }, []);

  return {
    showApiIpModal,
    handleApiError,
    closeApiIpModal,
  };
};
