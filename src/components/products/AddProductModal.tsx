
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// Define the Category interface
export interface Category {
  id: string | number;
  name: string;
}

// Define the Product interface for form data
interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string | number | null; // Modifié: categoryId -> category_id pour correspondre au modèle de données Supabase
}

// Define the modal props
interface AddProductModalProps {
  categories: Category[];
  onSave?: (product: {
    name: string;
    description: string;
    price: number;
    category_id: string | number; // Modifié: categoryId -> category_id
  }) => void;
}

const AddProductModal = ({ categories, onSave }: AddProductModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category_id: null, // Modifié: categoryId -> category_id
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

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
    
    if (!formData.category_id) { // Modifié: categoryId -> category_id
      newErrors.category_id = "La catégorie est requise"; // Modifié: categoryId -> category_id
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
      category_id: value, // Modifié: categoryId -> category_id
    }));
    
    // Clear error when user selects
    if (errors.category_id) { // Modifié: categoryId -> category_id
      setErrors((prev) => ({
        ...prev,
        category_id: undefined, // Modifié: categoryId -> category_id
      }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      // This would typically send data to an API or state management
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: formData.category_id as string | number, // Modifié: categoryId -> category_id
      };
      
      console.log("Saving product:", productData);
      
      if (onSave) {
        onSave(productData);
      }
      
      // Close modal and reset form
      setOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        category_id: null, // Modifié: categoryId -> category_id
      });
      setErrors({});
    }
  };

  const handleCancel = () => {
    // Close modal and reset form
    setOpen(false);
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: null, // Modifié: categoryId -> category_id
    });
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-ocre text-white">
          <Plus className="mr-2 h-4 w-4" /> Produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Ajouter un nouveau produit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complétez le formulaire pour ajouter un produit ou service à votre catalogue
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
            onClick={handleCancel}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSave}
            className="bg-terracotta hover:bg-ocre text-white"
          >
            Enregistrer le produit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
