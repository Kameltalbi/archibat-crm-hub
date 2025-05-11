
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface LabelFieldProps {
  form: ReturnType<typeof useForm>;
}

const LabelField = ({ form }: LabelFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="label"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Libellé *</FormLabel>
          <FormControl>
            <Input 
              placeholder="Entrez un libellé pour cette vente" 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LabelField;
