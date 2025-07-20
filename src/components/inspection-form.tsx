import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { QrCode, Camera, ClipboardCheck, Eraser, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import QRScannerModal from "./qr-scanner-modal";
import CameraModal from "./camera-modal";

const inspectionSchema = z.object({
  inspectedBy: z.string().min(1, "Inspector name is required"),
  date: z.string().min(1, "Date is required"),
  extinguisherId: z.string().min(1, "Extinguisher ID is required"),
  location: z.string().min(1, "Location is required"),
  pressure: z.string().optional(),
  condition: z.string().min(1, "Condition is required"),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
});

type InspectionFormData = z.infer<typeof inspectionSchema>;

export default function InspectionForm() {
  const [qrScannerOpen, setQrScannerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
    defaultValues: {
      inspectedBy: "",
      date: new Date().toISOString().split('T')[0],
      extinguisherId: "",
      location: "",
      pressure: "",
      condition: "",
      description: "",
      photoUrl: "",
    },
  });

  const createInspectionMutation = useMutation({
    mutationFn: async (data: InspectionFormData) => {
      const response = await apiRequest("POST", "/api/inspections", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inspections"] });
      toast({
        title: "Success",
        description: "Inspection saved successfully",
      });
      clearForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save inspection",
        variant: "destructive",
      });
    },
  });

  const handleQRScan = (code: string) => {
    form.setValue("extinguisherId", code);
    toast({
      title: "QR Code Scanned",
      description: `Extinguisher ID: ${code}`,
    });
  };

  const handlePhotoCapture = (photoUrl: string) => {
    setCapturedPhoto(photoUrl);
    form.setValue("photoUrl", photoUrl);
    toast({
      title: "Photo Captured",
      description: "Inspection photo captured successfully",
    });
  };

  const clearForm = () => {
    form.reset();
    setCapturedPhoto(null);
    toast({
      title: "Form Cleared",
      description: "All fields have been reset",
    });
  };

  const onSubmit = (data: InspectionFormData) => {
    createInspectionMutation.mutate(data);
  };

  return (
    <>
      <div className="inspection-card p-4">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <ClipboardCheck className="w-5 h-5 text-primary mr-2" />
          Inspection Details
        </h3>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Inspector Name */}
          <div>
            <Label htmlFor="inspectedBy" className="block text-sm font-medium text-foreground mb-2">
              Inspected By
            </Label>
            <Input
              id="inspectedBy"
              {...form.register("inspectedBy")}
              placeholder="Enter inspector name"
              className="w-full"
            />
            {form.formState.errors.inspectedBy && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.inspectedBy.message}
              </p>
            )}
          </div>

          {/* Date of Inspection */}
          <div>
            <Label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
              Date of Inspection
            </Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              className="w-full"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          {/* Extinguisher ID with QR Scanner */}
          <div>
            <Label htmlFor="extinguisherId" className="block text-sm font-medium text-foreground mb-2">
              Extinguisher ID #
            </Label>
            <div className="flex space-x-2">
              <Input
                id="extinguisherId"
                {...form.register("extinguisherId")}
                placeholder="Scan QR or enter ID"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={() => setQrScannerOpen(true)}
                className="btn-primary text-white px-4 py-2"
              >
                <QrCode className="w-5 h-5" />
              </Button>
            </div>
            {form.formState.errors.extinguisherId && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.extinguisherId.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Location
            </Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="Enter location"
              className="w-full"
            />
            {form.formState.errors.location && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.location.message}
              </p>
            )}
          </div>

          {/* Pressure */}
          <div>
            <Label htmlFor="pressure" className="block text-sm font-medium text-foreground mb-2">
              Pressure
            </Label>
            <Input
              id="pressure"
              {...form.register("pressure")}
              placeholder="Enter pressure reading"
              className="w-full"
            />
          </div>

          {/* Extinguisher Condition */}
          <div>
            <Label htmlFor="condition" className="block text-sm font-medium text-foreground mb-2">
              Extinguisher Condition
            </Label>
            <Select onValueChange={(value) => form.setValue("condition", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="needs-replacement">Needs Replacement</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.condition && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.condition.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Additional notes or observations"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Photo Capture */}
          <div>
            <Label className="block text-sm font-medium text-foreground mb-2">
              Inspection Photo
            </Label>
            {capturedPhoto ? (
              <div className="space-y-2">
                <img 
                  src={capturedPhoto} 
                  alt="Captured fire extinguisher" 
                  className="w-full h-32 object-cover rounded-lg" 
                />
                <Button
                  type="button"
                  onClick={() => setCameraOpen(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Retake Photo
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() => setCameraOpen(true)}
                variant="outline"
                className="w-full bg-gray-100 border-2 border-dashed border-border rounded-lg py-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-muted-foreground font-medium">TAKE PICTURE</span>
                <span className="text-xs text-muted-foreground mt-1">Capture equipment photo</span>
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button
          onClick={clearForm}
          variant="outline"
          className="py-3"
        >
          <Eraser className="w-4 h-4 mr-2" />
          CLEAR
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={createInspectionMutation.isPending}
          className="bg-green-500 hover:bg-green-600 text-white py-3"
        >
          <Save className="w-4 h-4 mr-2" />
          {createInspectionMutation.isPending ? "SAVING..." : "SAVE INSP"}
        </Button>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={createInspectionMutation.isPending}
          className="btn-primary text-white py-3"
        >
          <Check className="w-4 h-4 mr-2" />
          FINISH
        </Button>
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
    </>
  );
}
