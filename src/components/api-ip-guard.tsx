import React, { useState, useEffect } from "react";
import { useAppStore } from "../stores";
import { ApiIpModal } from "./api-ip-modal";

interface ApiIpGuardProps {
  children: React.ReactNode;
  showModalOnEmpty?: boolean;
  forceShowOnStart?: boolean;
}

export const ApiIpGuard: React.FC<ApiIpGuardProps> = ({
  children,
  showModalOnEmpty = true,
  forceShowOnStart = true,
}) => {
  const { api_ip, isInitialized, setInitialized } = useAppStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 앱 최초 시작 시에만 체크 (isInitialized가 false일 때)
    if (!isInitialized && forceShowOnStart && !api_ip) {
      setShowModal(true);
      setInitialized(); // 초기화 완료 표시
    }
  }, [api_ip, forceShowOnStart, isInitialized, setInitialized]);

  // api_ip가 변경될 때마다 체크 (최초 시작 이후)
  useEffect(() => {
    if (isInitialized && showModalOnEmpty && !api_ip) {
      setShowModal(true);
    }
  }, [api_ip, showModalOnEmpty, isInitialized]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {children}
      <ApiIpModal isOpen={showModal} onClose={handleCloseModal} />
    </>
  );
};
