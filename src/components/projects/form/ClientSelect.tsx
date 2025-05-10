
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "./ProjectEditForm";

interface ClientSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  clients: Client[];
  disabled?: boolean;
}

const ClientSelect = ({ 
  value, 
  onValueChange, 
  clients,
  disabled = false 
}: ClientSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="client_id">Client</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="client_id" className="border-input">
          <SelectValue placeholder="Sélectionnez un client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem 
              key={client.id} 
              value={client.id.toString()}
            >
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelect;
