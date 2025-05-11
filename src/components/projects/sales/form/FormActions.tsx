
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isLoading: boolean;
}

const FormActions = ({ onCancel, onSave, isLoading }: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
      >
        Annuler
      </Button>
      <Button
        onClick={onSave}
        disabled={isLoading}
      >
        {isLoading ? "Enregistrement..." : "Enregistrer la vente"}
      </Button>
    </div>
  );
};

export default FormActions;
