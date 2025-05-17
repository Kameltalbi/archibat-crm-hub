
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const StatusSelect = ({ 
  value, 
  onValueChange, 
  disabled = false 
}: StatusSelectProps) => {
  return (
    <div className="grid gap-2">
      <label htmlFor="status" className="text-sm font-medium">
        Statut *
      </label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="status" className="w-full">
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="En cours">En cours</SelectItem>
          <SelectItem value="Planifié">Planifié</SelectItem>
          <SelectItem value="Terminé">Terminé</SelectItem>
          <SelectItem value="Suspendu">Suspendu</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelect;
