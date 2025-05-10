
import { useEffect, useState } from "react";
import { Category } from "@/lib/supabase";
import { categoryService } from "@/services/categoryService";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  isOpen: boolean;
}

const CategorySelect = ({ 
  value, 
  onValueChange, 
  disabled = false,
  isOpen 
}: CategorySelectProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;
      
      setLoadingCategories(true);
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories. Veuillez réessayer.",
          variant: "destructive",
        });
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, [isOpen, toast]);

  return (
    <div className="grid gap-2">
      <label htmlFor="category" className="text-sm font-medium">
        Catégorie *
      </label>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Sélectionner une catégorie" />
        </SelectTrigger>
        <SelectContent>
          {loadingCategories ? (
            <SelectItem value="loading" disabled>Chargement...</SelectItem>
          ) : categories.length > 0 ? (
            categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>Aucune catégorie disponible</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelect;
