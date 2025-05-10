
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CategorySelectFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const PROJECT_CATEGORIES = ['Rénovation', 'Construction', 'Aménagement', 'Réhabilitation', 'Extension'];

const CategorySelectField = ({ 
  value, 
  onValueChange, 
  disabled = false 
}: CategorySelectFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Catégorie</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="category" className="border-input">
          <SelectValue placeholder="Sélectionnez une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {PROJECT_CATEGORIES.map((category) => (
            <SelectItem 
              key={category} 
              value={category}
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelectField;
