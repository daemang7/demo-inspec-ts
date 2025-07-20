import { useState } from "react";
import { X, Camera, RotateCcw, Image, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoUrl: string) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = () => {
    setIsCapturing(true);
    
    // Simulate photo capture with a mock fire extinguisher image
    setTimeout(() => {
      const mockPhotoUrl = "https://images.unsplash.com/photo-1563207153-f403bf289096?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
      setIsCapturing(false);
      onCapture(mockPhotoUrl);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
      <div className="flex justify-between items-center p-4 text-white">
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg font-semibold">Take Photo</h2>
        <button className="text-white">
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex-1 bg-gray-800 flex items-center justify-center">
        {/* Camera Viewfinder Simulation */}
        <div className="text-white text-center">
          <Camera className="w-24 h-24 mx-auto mb-4" />
          <p className="text-lg mb-2">
            {isCapturing ? "Capturing..." : "Camera Viewfinder"}
          </p>
          <p className="text-sm text-gray-300">Position equipment in frame</p>
        </div>
      </div>
      
      <div className="flex justify-center items-center py-8 space-x-8">
        <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <Image className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={capturePhoto}
          disabled={isCapturing}
          className="w-16 h-16 bg-white rounded-full flex items-center justify-center disabled:opacity-50"
        >
          <Camera className="w-8 h-8 text-gray-800" />
        </button>
        <button className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <Settings className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
