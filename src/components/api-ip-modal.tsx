import React, { useState, useEffect } from "react";
import { useAppStore, storeUtils } from "../stores";

// API 통신 테스트 함수
const testApiConnection = async (ipAddress: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Testing connection to: http://${ipAddress}/api/inspections`);

    // CORS 문제를 우회하기 위해 mode: 'no-cors' 사용
    const response = await fetch(`http://${ipAddress}/api/inspections`, {
      method: "GET",
      mode: "no-cors", // CORS 정책 무시
      headers: {
        "Content-Type": "application/json",
      },
      // 5초 타임아웃 설정
      signal: AbortSignal.timeout(5000),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    console.log(`Response type: ${response.type}`);

    // no-cors 모드에서는 response.ok가 항상 false이므로 다른 방법으로 확인
    if (response.type === "opaque") {
      // opaque 응답은 서버에 도달했다는 의미
      return { success: true };
    }

    return { success: response.ok };
  } catch (error) {
    console.error("API connection test failed:", error);

    // CORS 에러인지 확인
    if (error instanceof TypeError && error.message.includes("CORS")) {
      return {
        success: false,
        error:
          "CORS error: The server doesn't allow cross-origin requests. This is likely a server configuration issue.",
      };
    }

    // 네트워크 에러인지 확인
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error: "Network error: Unable to connect to the server. Please check the IP address and network connection.",
      };
    }

    return {
      success: false,
      error: `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

interface ApiIpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiIpModal: React.FC<ApiIpModalProps> = ({ isOpen, onClose }) => {
  const { setApiIp } = useAppStore();
  const [ipInput, setIpInput] = useState("");
  const [error, setError] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [skipConnectionTest, setSkipConnectionTest] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIpInput("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ipInput.trim()) {
      setError("Please enter an IP address.");
      return;
    }

    if (!storeUtils.isValidIPv4(ipInput.trim())) {
      setError("Please enter a valid IPv4 format. (e.g., 192.168.1.1)");
      return;
    }

    // 연결 테스트를 건너뛰는 옵션이 활성화된 경우
    if (skipConnectionTest) {
      setApiIp(ipInput.trim());
      setError("");
      onClose();
      return;
    }

    setIsTesting(true);
    setError("");

    try {
      const result = await testApiConnection(ipInput.trim());

      if (result.success) {
        setApiIp(ipInput.trim());
        setError("");
        onClose();
      } else {
        setError(result.error || "Failed to connect to the API server. Please check the IP address and try again.");
      }
    } catch (error) {
      setError("Connection test failed. Please check the IP address and network connection.");
    } finally {
      setIsTesting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Alumlab - API Demo Server</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-ip" className="block text-sm font-medium text-gray-700 mb-2">
              API Server IP Address
            </label>
            <input
              id="api-ip"
              type="text"
              value={ipInput}
              onChange={(e) => {
                setIpInput(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., 192.168.1.100"
              disabled={isTesting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          {/* Skip connection test option */}
          <div className="flex items-center space-x-2">
            <input
              id="skip-test"
              type="checkbox"
              checked={skipConnectionTest}
              onChange={(e) => setSkipConnectionTest(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="skip-test" className="text-sm text-gray-700">
              Skip connection test (use if CORS errors occur)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isTesting}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTesting}
              className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTesting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Testing...
                </div>
              ) : (
                "Set"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Please enter an IPv4 format IP address.
            <br />
            e.g., 192.168.1.100, 10.0.0.1, 172.16.0.1
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};
