
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { productService } from "@/services/productService";
import { supabase } from "@/lib/supabase";
import { SaleFormData } from "./types";

export const useSalesForm = (
  projectId: string,
  projectCategory?: string,
  clientId?: string,
  onSaleAdded: () => void
) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<SaleFormData>({
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
        
        let products: any[] = [];
        
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
      
      // Catégorie du produit (ou du projet si pas de catégorie de produit)
      const productCategory = selectedProduct?.categories?.name || filteredCategory || "Service";
      
      // Créer la vente dans Supabase
      const { data, error } = await supabase
        .from('project_sales')
        .insert({
          project_id: projectId,
          label: formData.label,
          amount: parseFloat(formData.amount),
          date: formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date,
          product_name: selectedProduct ? selectedProduct.name : null,
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

  return {
    formData,
    isLoading,
    availableProducts,
    filteredCategory,
    handleChange,
    handleSave,
  };
};
