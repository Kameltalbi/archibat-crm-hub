import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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
import { productService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import DatePickerField from "./sales/DatePickerField";

// Définir le type du produit
interface Product {
  id: string;
  name: string;
  price: number;
  category_id?: string | null;
  description?: string | null;
  categories?: {
    id: string;
    name: string;
  };
}

// Props pour le composant
interface ClientMinimal {
  id: string;
  name: string;
}

interface ProjectSalesFormProps {
  projectId: string;
  projectName?: string;
  projectCategory?: string;
  clientId?: string;
  clients?: ClientMinimal[];
  onSaleAdded: () => void;
  onCancel: () => void;
}

const ProjectSalesForm = ({ 
  projectId, 
  projectName,
  projectCategory,
  clientId,
  clients = [],
  onSaleAdded, 
  onCancel 
}: ProjectSalesFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clientId: clientId || "",
    date: new Date(),
    amount: "",
    productId: "",
    label: "",
    remarks: "",
  });

  // Récupérer les produits depuis Supabase en fonction de la catégorie du projet
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        console.log("Catégorie du projet:", projectCategory);
        
        let products: Product[] = [];
        
        // Si une catégorie de projet est spécifiée, essayer de trouver les produits correspondants
        if (projectCategory) {
          // La catégorie exacte du projet est aussi une catégorie de produits
          products = await productService.getProductsByCategoryName(projectCategory);
          console.log("Produits pour la catégorie exacte:", products);
          
          if (products.length > 0) {
            setFilteredCategory(projectCategory);
          } else {
            // Si aucun produit n'est trouvé, essayons de mapper la catégorie
            const categoryMapping: Record<string, string[]> = {
              "Rénovation": ["Travaux", "Services"],
              "Construction": ["Travaux", "Matériaux"],
              "Aménagement": ["Services", "Fournitures"],
              "Design": ["Services", "Études"],
              "Études": ["Études", "Services"],
              "Conseils": ["Services"],
              "Publicité Magazine": ["Publicité", "Communication", "Services"],
              "Publicité": ["Communication", "Marketing"],
              "Communication": ["Publicité", "Marketing", "Services"]
            };
            
            const matchingCategories = categoryMapping[projectCategory] || [];
            
            if (matchingCategories.length > 0) {
              // Récupérer tous les produits et filtrer par catégories mappées
              const allProducts = await productService.getProductsWithCategories();
              products = allProducts.filter((product: any) => {
                const categoryName = product.categories?.name || "";
                return matchingCategories.includes(categoryName);
              });
              
              console.log(`Produits pour les catégories mappées (${matchingCategories.join(", ")}):`, products);
              
              if (products.length > 0) {
                setFilteredCategory(matchingCategories[0]);
              }
            }
          }
        }
        
        // Si aucun produit n'est trouvé avec les mappings, récupérer tous les produits
        if (products.length === 0) {
          console.log("Aucun produit trouvé pour cette catégorie, récupération de tous les produits");
          products = await productService.getProductsWithCategories();
          setFilteredCategory(null);
        }
        
        setAvailableProducts(products);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des produits"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [projectCategory, toast]);

  const handleChange = (field: string, value: any) => {
    // Si on change de produit, mettons à jour le montant avec le prix du produit sélectionné
    if (field === "productId") {
      const selectedProduct = availableProducts.find(p => p.id === value);
      if (selectedProduct) {
        setFormData({ 
          ...formData, 
          [field]: value,
          amount: selectedProduct.price.toString()
        });
      } else {
        setFormData({ ...formData, [field]: value });
      }
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = async () => {
    // Valider les données du formulaire
    if (!formData.label || !formData.date || !formData.amount || !formData.productId) {
      toast({
        variant: "destructive",
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Récupérer le produit sélectionné
      const selectedProduct = availableProducts.find(p => p.id === formData.productId);
      
      // Trouver le nom du client sélectionné
      const selectedClient = clients?.find(c => c.id === formData.clientId);
      const clientName = selectedClient ? selectedClient.name : null;
      
      // Catégorie du produit (ou du projet si pas de catégorie de produit)
      const productCategory = selectedProduct?.categories?.name || filteredCategory || "Service";
      
      // Créer la vente dans Supabase
      const { data, error } = await supabase
        .from('project_sales')
        .insert({
          project_id: projectId,
          label: formData.label,
          amount: parseFloat(formData.amount),
          date: format(formData.date, 'yyyy-MM-dd'),
          product_name: selectedProduct ? selectedProduct.name : null,
          client_name: clientName,
          category: productCategory,
          remarks: formData.remarks || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Vente ajoutée",
        description: "La vente a été ajoutée avec succès"
      });

      // Appeler la fonction de succès
      onSaleAdded();
      
      // Réinitialiser le formulaire
      setFormData({
        clientId: "",
        date: new Date(),
        amount: "",
        productId: "",
        label: "",
        remarks: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la vente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la vente"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {projectName && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Projet: <span className="font-semibold text-foreground">{projectName}</span>
            {projectCategory && ` - Catégorie: ${projectCategory}`}
            {filteredCategory && ` - Produits filtrés par: ${filteredCategory}`}
          </p>
        </div>
      )}
      
      <div className="grid gap-4">
        {/* Libellé */}
        <div>
          <Label htmlFor="label">Libellé *</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Entrez un libellé pour cette vente"
            className="mt-1"
          />
        </div>

        {/* Date */}
        <div>
          <DatePickerField
            date={formData.date}
            onDateChange={(date) => handleChange("date", date)}
            label="Date de vente *"
          />
        </div>

        {/* Product */}
        <div>
          <Label htmlFor="product">Produit *</Label>
          <Select
            value={formData.productId}
            onValueChange={(value) => handleChange("productId", value)}
          >
            <SelectTrigger id="product" className="mt-1">
              <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un produit"} />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <SelectItem value="loading" disabled>Chargement des produits...</SelectItem>
              ) : availableProducts.length > 0 ? (
                availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id} className="py-2">
                    {product.name} - {product.price} DT
                    {product.categories && ` (${product.categories.name})`}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-product" disabled>
                  Aucun produit disponible pour cette catégorie
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount">Montant (DT) *</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="Entrez le montant"
            className="mt-1"
          />
        </div>

        {/* Remarks */}
        <div>
          <Label htmlFor="remarks">Remarques</Label>
          <Textarea
            id="remarks"
            value={formData.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Ajouter des remarques ou commentaires (optionnel)"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer la vente"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectSalesForm;
