
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { expenseService } from "@/services/expenseService";

interface AddSubcategoryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
  onSuccess: () => void;
}

const AddSubcategoryModal = ({
  isOpen,
  onOpenChange,
  categoryId,
  categoryName,
  onSuccess
}: AddSubcategoryModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le nom de la sous-catégorie est requis."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await expenseService.createExpenseSubcategory({
        name: name.trim(),
        description: description.trim() || null,
        category_id: categoryId
      });
      
      toast({
        title: "Sous-catégorie ajoutée",
        description: "La sous-catégorie a été ajoutée avec succès."
      });
      
      setName("");
      setDescription("");
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la création de la sous-catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la sous-catégorie. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Ajouter une sous-catégorie
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajouter une sous-catégorie pour "{categoryName}"
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subcategory-name" className="text-sm font-medium">
                Nom de la sous-catégorie *
              </label>
              <Input
                id="subcategory-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Saisissez le nom de la sous-catégorie"
                className="border-input"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="subcategory-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="subcategory-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optionnelle)"
                className="border-input min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-terracotta hover:bg-ocre text-white"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? "Ajout en cours..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubcategoryModal;
