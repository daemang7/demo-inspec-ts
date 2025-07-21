import { Wifi, WifiOff, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OfflineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OfflineModal({ isOpen, onClose }: OfflineModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-orange-500" />
            Network Connection Lost
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <WifiOff className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">You have entered a network-free area</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Data you are working on can be saved to your mobile device. Your inspection data will be stored locally
                and synchronized when the connection is restored.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Wifi className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your data will be saved locally</li>
                  <li>• You can continue working offline</li>
                  <li>• Data will sync when connection returns</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
