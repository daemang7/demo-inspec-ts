import React, { useState, useEffect } from "react";
import { useAppStore, storeUtils } from "../stores";

interface ApiIpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiIpModal: React.FC<ApiIpModalProps> = ({ isOpen, onClose }) => {
  const { setApiIp } = useAppStore();
  const [ipInput, setIpInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setIpInput("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ipInput.trim()) {
      setError("IP 주소를 입력해주세요.");
      return;
    }

    if (!storeUtils.isValidIPv4(ipInput.trim())) {
      setError("올바른 IPv4 형식을 입력해주세요. (예: 192.168.1.1)");
      return;
    }

    setApiIp(ipInput.trim());
    setError("");
    onClose();
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
          <h2 className="text-xl font-semibold text-gray-900">API 서버 IP 설정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="api-ip" className="block text-sm font-medium text-gray-700 mb-2">
              API 서버 IP 주소
            </label>
            <input
              id="api-ip"
              type="text"
              value={ipInput}
              onChange={(e) => {
                setIpInput(e.target.value);
                if (error) setError("");
              }}
              placeholder="예: 192.168.1.100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              설정
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>참고:</strong> IPv4 형식의 IP 주소를 입력해주세요.
            <br />
            예시: 192.168.1.100, 10.0.0.1, 172.16.0.1
          </p>
        </div>
      </div>
    </div>
  );
};
