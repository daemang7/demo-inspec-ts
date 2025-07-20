import { useState } from "react";
import { X, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScan }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);

  const simulateQRScan = () => {
    setIsScanning(true);
    // Simulate QR code scan with random codes
    const mockQRCodes = ['OF02861-CA', 'OF02862-CA', 'OF02863-CA', 'OF02864-CA', 'OF02865-CA'];
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    
    setTimeout(() => {
      setIsScanning(false);
      onScan(randomCode);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Scan QR Code</h2>
        <div></div>
      </div>
      
      <div className="flex-1 flex items-center justify-center relative">
        {/* QR Scanner Viewfinder */}
        <div className="relative w-64 h-64 border-2 border-white rounded-lg">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <QrCode className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">
                {isScanning ? "Scanning..." : "Position QR code within frame"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
          <p className="text-white text-center text-sm">
            {isScanning ? "Processing QR code..." : "Simulated QR Scanner Active"}
          </p>
        </div>
        <Button 
          onClick={simulateQRScan}
          disabled={isScanning}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium"
        >
          {isScanning ? "Scanning..." : "Simulate QR Scan"}
        </Button>
      </div>
    </div>
  );
}
