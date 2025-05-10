
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Category } from "./AddProductModal";
import { Product } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Define the Product interface for form data
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string | number | null;
}

interface EditProductModalProps {
  product: Product & { category_name?: string };
  categories: Category[];
  onUpdate: () => void;
}

const EditProductModal = ({ product, categories, onUpdate }: EditProductModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category_id: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price.toString() || "",
        category_id: product.category_id || null,
      });
    }
  }, [product, open]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du produit est requis";
    }
    
    if (!formData.price) {
      newErrors.price = "Le prix est requis";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }
    
    if (!formData.category_id) {
      newErrors.category_id = "La catégorie est requise";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
    
    // Clear error when user selects
    if (errors.category_id) {
      setErrors((prev) => ({
        ...prev,
        category_id: undefined,
      }));
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            price: parseFloat(formData.price),
            category_id: formData.category_id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Produit modifié",
          description: "Le produit a été modifié avec succès."
        });
        
        // Close modal and refresh product list
        setOpen(false);
        onUpdate();
        
      } catch (error) {
        console.error('Erreur lors de la modification du produit:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier le produit. Veuillez réessayer."
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Modifier le produit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les informations du produit
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Product Name */}
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Nom du produit *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Saisissez le nom du produit"
              className={errors.name ? "border-destructive" : "border-input"}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description (optionnelle)"
              className="border-input min-h-[100px]"
            />
          </div>

          {/* Price */}
          <div className="grid gap-2">
            <Label htmlFor="price" className={errors.price ? "text-destructive" : ""}>
              Prix unitaire (DT HT) *
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              className={errors.price ? "border-destructive" : "border-input"}
            />
            {errors.price && (
              <p className="text-xs text-destructive">{errors.price}</p>
            )}
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category" className={errors.category_id ? "text-destructive" : ""}>
              Catégorie *
            </Label>
            <Select
              value={formData.category_id?.toString() || ""}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger 
                id="category"
                className={errors.category_id ? "border-destructive" : "border-input"}
              >
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem 
                    key={category.id} 
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-xs text-destructive">{errors.category_id}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSave}
            className="bg-terracotta hover:bg-ocre text-white"
          >
            Enregistrer les modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
