import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import ClientSelect from "@/components/projects/form/ClientSelect";
import MultiProductSelect from "@/components/projects/sales/MultiProductSelect";
import PriceField from "@/components/projects/sales/PriceField";
import DatePickerField from "@/components/projects/sales/DatePickerField";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mapCategoryNames } from "./product-select/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

interface AddSaleDialogProps {
  projectId: string;
  projectName?: string;
  projectCategory?: string;
  onSaleAdded: () => void;
  triggerButton?: boolean; // Prop pour contrôler si on affiche le bouton trigger
  open?: boolean; // Nouvelle prop pour contrôler l'état d'ouverture depuis le parent
  onOpenChange?: (open: boolean) => void; // Nouvelle prop pour notifier le parent des changements d'état
}

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string | null;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const AddSaleDialog = ({ 
  projectId, 
  projectName, 
  projectCategory, 
  onSaleAdded, 
  triggerButton = true,
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}: AddSaleDialogProps) => {
  const { toast } = useToast();
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [saleDate, setSaleDate] = useState<Date>(new Date()); // Date d'encaissement
  const [remarks, setRemarks] = useState("");
  const [transactionDate, setTransactionDate] = useState<Date>(new Date()); // Date de la vente
  
  // Détermine si le contrôle est interne ou externe
  const isControlledExternally = externalOpen !== undefined && externalOnOpenChange !== undefined;
  
  // État d'ouverture final
  const isOpen = isControlledExternally ? externalOpen : internalOpen;
  
  // Fonction pour modifier l'état d'ouverture
  const setIsOpen = (value: boolean) => {
    if (isControlledExternally) {
      externalOnOpenChange!(value);
    } else {
      setInternalOpen(value);
    }
  };

  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, name, email, phone, address, created_at, updated_at')
          .order('name');
          
        if (error) throw error;
        setClients(data || []);
        console.log("Clients chargés:", data?.length || 0);
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      }
    };
    
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);
  
  // Charger les produits basés sur la catégorie du projet
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log(`Chargement des produits pour la catégorie: ${projectCategory || "toutes catégories"}`);
        
        // Utiliser le mappage de catégories pour trouver des catégories associées
        const relatedCategories = mapCategoryNames(projectCategory);
        console.log("Recherche de produits dans ces catégories:", relatedCategories);
        
        // Récupérer tous les produits avec leurs catégories
        const { data, error } = await supabase
          .from('products')
          .select(`
            id, 
            name, 
            price, 
            categories:category_id (id, name)
          `)
          .order('name');
        
        if (error) throw error;
        
        // Si nous avons des catégories associées, filtrer les produits
        let filteredProducts = data || [];
        if (relatedCategories.length > 0) {
          filteredProducts = filteredProducts.filter(product => 
            product.categories && relatedCategories.includes(product.categories.name)
          );
          
          console.log(`${filteredProducts.length} produits trouvés dans les catégories associées`);
        }
        
        // Si aucun produit n'est trouvé dans les catégories associées, utiliser tous les produits
        if (filteredProducts.length === 0) {
          console.log("Aucun produit trouvé dans les catégories associées, utilisation de tous les produits");
          filteredProducts = data || [];
        }
        
        console.log(`${filteredProducts.length} produits trouvés au total`);
        
        // Formater les produits pour l'interface
        const formattedProducts = filteredProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.categories?.name || null
        }));
        
        setProducts(formattedProducts);
        console.log("Produits disponibles pour la sélection:", formattedProducts.length);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };
    
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen, projectCategory]);
  
  // Mettre à jour le prix total lorsque les produits sélectionnés changent
  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    
    setTotalPrice(total);
  }, [selectedProducts]);
  
  const handleProductSelection = (selected: SelectedProduct[]) => {
    setSelectedProducts(selected);
  };
  
  const handlePriceChange = (newPrice: number) => {
    setTotalPrice(newPrice);
  };
  
  const resetForm = () => {
    setSelectedClientId("");
    setSelectedProducts([]);
    setTotalPrice(0);
    setSaleDate(new Date()); // Réinitialiser la date d'encaissement
    setTransactionDate(new Date()); // Réinitialiser la date de vente
    setRemarks("");
  };
  
  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };
  
  const handleSubmit = async () => {
    // Validation
    if (!selectedClientId) {
      toast({
        variant: "destructive",
        title: "Client requis",
        description: "Veuillez sélectionner un client pour cette vente."
      });
      return;
    }
    
    if (selectedProducts.length === 0) {
      toast({
        variant: "destructive",
        title: "Produit(s) requis",
        description: "Veuillez sélectionner au moins un produit."
      });
      return;
    }
    
    if (totalPrice <= 0) {
      toast({
        variant: "destructive",
        title: "Prix invalide",
        description: "Le prix total doit être supérieur à zéro."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Obtenir le nom du client pour la référence
      const client = clients.find(c => c.id === selectedClientId);
      
      // Générer une étiquette pour la vente
      const productNames = selectedProducts.map(p => p.name).join(', ');
      const label = `Vente de ${productNames} à ${client?.name || 'client'}`;
      
      // Format de date pour Supabase (YYYY-MM-DD)
      const formattedDate = saleDate.toISOString().split('T')[0];
      const formattedTransactionDate = transactionDate.toISOString().split('T')[0];
      
      // Insérer la vente principale
      const { data: saleData, error: saleError } = await supabase
        .from('project_sales')
        .insert({
          project_id: projectId,
          label: label,
          amount: totalPrice,
          date: formattedDate, // Date d'encaissement
          transaction_date: formattedTransactionDate, // Date de la vente
          category: projectCategory || 'Vente',
          client_name: client?.name || null,
          product_name: selectedProducts.length === 1 ? selectedProducts[0].name : 'Multiple',
          remarks: remarks || null
        })
        .select()
        .single();
      
      if (saleError) throw saleError;
      
      // Si nécessaire, ajouter les liens produit-projet
      for (const product of selectedProducts) {
        const { error: productLinkError } = await supabase
          .from('project_products')
          .insert({
            project_id: projectId,
            product_id: product.id,
            price_at_time: product.price,
            quantity: product.quantity
          });
        
        if (productLinkError) {
          console.error('Erreur lors de l\'enregistrement du lien produit-projet:', productLinkError);
        }
      }
      
      // Succès
      toast({
        title: "Vente ajoutée",
        description: "La vente a été enregistrée avec succès."
      });
      
      // Appeler la fonction de callback
      onSaleAdded();
      
      // Fermer le modal et réinitialiser le formulaire
      handleClose();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vente:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la vente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  console.log("AddSaleDialog rendu, isOpen:", isOpen);
  console.log("Produits disponibles:", products.length);
  console.log("Catégorie du projet:", projectCategory);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {triggerButton ? (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter une vente
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter une vente au projet {projectName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Sélection du client */}
          <div className="grid w-full items-center gap-2">
            <ClientSelect
              value={selectedClientId}
              onValueChange={setSelectedClientId}
              clients={clients}
              label="Client *"
              placeholder="Sélectionnez un client"
              withSearch
            />
          </div>
          
          {/* Sélection des produits */}
          <div className="grid w-full items-center gap-2">
            <MultiProductSelect
              products={products}
              selectedProducts={selectedProducts}
              onChange={handleProductSelection}
              projectCategory={projectCategory}
            />
          </div>
          
          {/* Prix HT */}
          <div className="grid w-full items-center gap-2">
            <PriceField
              value={totalPrice}
              onChange={handlePriceChange}
              selectedProducts={selectedProducts}
            />
          </div>
          
          {/* Date de la vente (Nouveau champ) */}
          <div className="grid w-full items-center gap-2">
            <DatePickerField
              date={transactionDate}
              onDateChange={setTransactionDate}
              label="Date de la vente *"
            />
          </div>
          
          {/* Date d'encaissement */}
          <div className="grid w-full items-center gap-2">
            <DatePickerField
              date={saleDate}
              onDateChange={setSaleDate}
              label="Date d'encaissement *"
            />
          </div>
          
          {/* Remarques (optionnel) */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="remarks">Remarques</Label>
            <Textarea
              id="remarks"
              placeholder="Ajouter des remarques ou commentaires (optionnel)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer la vente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleDialog;
