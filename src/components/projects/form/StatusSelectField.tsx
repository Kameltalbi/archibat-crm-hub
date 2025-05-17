
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProjectStatus } from "@/lib/supabase";

interface StatusSelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

// Mapping between status values and their display labels
const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "in_progress", label: "En cours" },
  { value: "planned", label: "Planifié" },
  { value: "completed", label: "Terminé" },
  { value: "cancelled", label: "Suspendu" },
];

const StatusSelectField = ({ 
  value, 
  onValueChange, 
  disabled = false 
}: StatusSelectFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="status">Statut</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="status" className="border-input">
          <SelectValue placeholder="Sélectionnez un statut" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Helper function to get the display label for a status value
export const getStatusLabel = (status: ProjectStatus): string => {
  return STATUS_OPTIONS.find(opt => opt.value === status)?.label || status;
};

export default StatusSelectField;
