export interface Inspection {
  id: string;
  extinguisherId: string;
  location: string;
  condition: "excellent" | "good" | "fair" | "poor" | "needs-replacement";
  inspectedBy: string;
  date: string;
  pressure?: string;
  description?: string;
  photoUrl?: string;
}
