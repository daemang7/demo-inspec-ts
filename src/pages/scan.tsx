import { useState } from "react";
import { QrCode, Camera, Scan } from "lucide-react";
import MobileLayout from "@/components/mobile-layout";
import QRScannerModal from "@/components/qr-scanner-modal";
import CameraModal from "@/components/camera-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ScanPage() {
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const { toast } = useToast();

  const handleQRScan = (code: string) => {
    setLastScanned(code);
    toast({
      title: "QR Code Scanned",
      description: `Extinguisher ID: ${code}`,
    });
  };

  const handlePhotoCapture = (photoUrl: string) => {
    setLastPhoto(photoUrl);
    toast({
      title: "Photo Captured",
      description: "Photo captured successfully",
    });
  };

  return (
    <MobileLayout title="Scan & Capture" subtitle="QR Codes & Photos">
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => setQrScannerOpen(true)}
          className="inspection-card p-6 h-auto flex flex-col items-center space-y-3 hover:shadow-md transition-shadow"
          variant="outline"
        >
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <QrCode className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">Scan QR Code</div>
            <div className="text-xs text-muted-foreground">Equipment ID</div>
          </div>
        </Button>

        <Button
          onClick={() => setCameraOpen(true)}
          className="inspection-card p-6 h-auto flex flex-col items-center space-y-3 hover:shadow-md transition-shadow"
          variant="outline"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Camera className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">Take Photo</div>
            <div className="text-xs text-muted-foreground">Equipment Image</div>
          </div>
        </Button>
      </div>

      {/* Last Scanned QR Code */}
      {lastScanned && (
        <div className="inspection-card p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <QrCode className="w-5 h-5 text-primary mr-2" />
            Last Scanned QR Code
          </h3>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-mono text-lg font-bold text-foreground">{lastScanned}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Scanned at {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Last Captured Photo */}
      {lastPhoto && (
        <div className="inspection-card p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center">
            <Camera className="w-5 h-5 text-green-600 mr-2" />
            Last Captured Photo
          </h3>
          <img 
            src={lastPhoto} 
            alt="Last captured photo"
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="text-sm text-muted-foreground mt-2">
            Captured at {new Date().toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="inspection-card p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center">
          <Scan className="w-5 h-5 text-primary mr-2" />
          Instructions
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <div>
              <div className="font-medium text-foreground">Scan QR Code</div>
              <div>Position the QR code within the scanning frame</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div>
              <div className="font-medium text-foreground">Capture Photo</div>
              <div>Take a clear photo of the fire extinguisher</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <div>
              <div className="font-medium text-foreground">Complete Inspection</div>
              <div>Return to home to fill out the inspection form</div>
            </div>
          </div>
        </div>
      </div>

      <QRScannerModal
        isOpen={qrScannerOpen}
        onClose={() => setQrScannerOpen(false)}
        onScan={handleQRScan}
      />

      <CameraModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handlePhotoCapture}
      />
    </MobileLayout>
  );
}
