
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientMinimal } from "../types";
import { useForm } from "react-hook-form";

interface ClientFieldProps {
  form: ReturnType<typeof useForm>;
  clients: ClientMinimal[];
}

const ClientField = ({ form, clients }: ClientFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Client *</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
            </FormControl>
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
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ClientField;
