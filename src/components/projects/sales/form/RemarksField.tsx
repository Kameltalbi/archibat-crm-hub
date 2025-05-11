
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RemarksFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const RemarksField = ({ value, onChange }: RemarksFieldProps) => {
  return (
    <div>
      <Label htmlFor="remarks">Remarques</Label>
      <Textarea
        id="remarks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ajouter des remarques ou commentaires (optionnel)"
        className="mt-1"
      />
    </div>
  );
};

export default RemarksField;
