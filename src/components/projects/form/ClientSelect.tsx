
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Client } from "@/lib/supabase";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ClientSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  clients: Client[];
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  withSearch?: boolean;
}

const ClientSelect = ({ 
  value, 
  onValueChange, 
  clients,
  disabled = false,
  label = "Client",
  placeholder = "Sélectionnez un client",
  withSearch = false
}: ClientSelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filtrer les clients en fonction de la recherche
  const filteredClients = searchQuery
    ? clients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : clients;

  return (
    <div className="grid gap-2">
      <Label htmlFor="client_id">{label}</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="client_id" className="border-input">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-y-auto">
          {withSearch && (
            <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-background z-10">
              <Search className="h-4 w-4 mr-2 opacity-50" />
              <Input
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <SelectItem 
                  key={client.id} 
                  value={client.id.toString()}
                  className="py-2 px-3"
                >
                  {client.name}
                </SelectItem>
              ))
            ) : (
              <div className="text-center py-2 text-muted-foreground">
                {searchQuery ? "Aucun client trouvé" : "Aucun client disponible"}
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelect;
