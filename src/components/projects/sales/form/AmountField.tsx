
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const AmountField = ({ value, onChange }: AmountFieldProps) => {
  return (
    <div>
      <Label htmlFor="amount">Montant (DT) *</Label>
      <Input
        id="amount"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Entrez le montant"
        className="mt-1"
      />
    </div>
  );
};

export default AmountField;
