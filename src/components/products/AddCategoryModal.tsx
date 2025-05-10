
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { categoryService } from "@/services/categoryService";

interface CategoryFormData {
  name: string;
  description: string;
}

const AddCategoryModal = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
  });
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est requis",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newCategory = await categoryService.createCategory({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
      });
      
      if (newCategory) {
        toast({
          title: "Succès",
          description: "Catégorie ajoutée avec succès",
        });
        
        // Fermer le modal et réinitialiser le formulaire
        setOpen(false);
        setFormData({ name: "", description: "" });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la catégorie",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout de la catégorie",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Fermer le modal et réinitialiser le formulaire
    setOpen(false);
    setFormData({ name: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" /> Catégorie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Ajouter une nouvelle catégorie
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Créez une nouvelle catégorie pour vos produits et services
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Category Name */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom de la catégorie *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Saisissez le nom de la catégorie"
              className="border-input"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description (optionnelle)"
              className="border-input min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-terracotta hover:bg-ocre text-white"
            disabled={!formData.name.trim() || isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer la catégorie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
