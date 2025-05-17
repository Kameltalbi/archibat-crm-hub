
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

const PROJECT_STATUSES: ProjectStatus[] = ['En cours', 'Planifié', 'Terminé', 'Suspendu'];

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
          {PROJECT_STATUSES.map((status) => (
            <SelectItem 
              key={status} 
              value={status}
            >
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelectField;
