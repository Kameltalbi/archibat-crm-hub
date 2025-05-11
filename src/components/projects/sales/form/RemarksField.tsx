
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface RemarksFieldProps {
  form: ReturnType<typeof useForm>;
}

const RemarksField = ({ form }: RemarksFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="remarks"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Remarques</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Ajouter des remarques ou commentaires (optionnel)" 
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RemarksField;
