
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

interface AmountFieldProps {
  form: ReturnType<typeof useForm>;
}

const AmountField = ({ form }: AmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Montant (DT) *</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="Entrez le montant" 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AmountField;
