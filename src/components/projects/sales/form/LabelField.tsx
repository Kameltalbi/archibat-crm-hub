
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LabelFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const LabelField = ({ value, onChange }: LabelFieldProps) => {
  return (
    <div>
      <Label htmlFor="label">Libellé *</Label>
      <Input
        id="label"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Entrez un libellé pour cette vente"
        className="mt-1"
      />
    </div>
  );
};

export default LabelField;
