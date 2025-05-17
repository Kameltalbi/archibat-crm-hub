
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AddHistoryItemForm } from "./AddHistoryItemForm";
import { useToast } from "@/hooks/use-toast";

export interface AddHistoryItemFormData {
  type: "modification" | "document" | "call" | "meeting" | "note";
  title: string;
  description?: string;
}

interface AddHistoryItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AddHistoryItemFormData) => Promise<void>;
  entityType: "client" | "project";
}

export const AddHistoryItemModal = ({
  open,
  onOpenChange,
  onSubmit,
  entityType,
}: AddHistoryItemModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (formData: AddHistoryItemFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
      toast({
        title: "Succès",
        description: `L'action a été ajoutée à l'historique du ${entityType === "client" ? "client" : "projet"}.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout à l'historique:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter cette action à l'historique.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une action à l'historique</DialogTitle>
          <DialogDescription>
            Enregistrez une nouvelle action dans l'historique du {entityType === "client" ? "client" : "projet"}.
          </DialogDescription>
        </DialogHeader>
        <AddHistoryItemForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};
