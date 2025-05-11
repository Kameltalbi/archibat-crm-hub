
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientMinimal } from "../types";

interface ClientFieldProps {
  value: string;
  onChange: (value: string) => void;
  clients: ClientMinimal[];
}

const ClientField = ({ value, onChange, clients }: ClientFieldProps) => {
  return (
    <div>
      <Label htmlFor="client">Client *</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="client" className="mt-1">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {clients && clients.length > 0 ? (
            clients.map(client => (
              <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
            ))
          ) : (
            <SelectItem value="no-client" disabled>Aucun client</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientField;
