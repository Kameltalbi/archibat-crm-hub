
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface ProjectSale {
  id: string;
  label: string;
  amount: number;
  category: string;
  client_name: string | null;
  product_name: string | null;
  date: string;
  transaction_date?: string | null;  // Ajout de la nouvelle propriété
  remarks?: string | null;
}

interface EditSaleDialogProps {
  projectId: string;
  projectName?: string;
  projectCategory?: string;
  sale: ProjectSale;
  onSaleUpdated: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const EditSaleDialog = ({
  projectId,
  projectName,
  projectCategory,
  sale,
  onSaleUpdated,
  open,
  onOpenChange
}: EditSaleDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(sale.amount);
  const [saleDate, setSaleDate] = useState<Date>(new Date(sale.date));
  const [transactionDate, setTransactionDate] = useState<Date>(
    sale.transaction_date ? new Date(sale.transaction_date) : new Date()
  );
  const [remarks, setRemarks] = useState(sale.remarks || "");
  
  console.log("EditSaleDialog rendu, isOpen:", open);
  console.log("Produits disponibles:", products.length);
  console.log("Catégorie du projet:", projectCategory);
  
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
        
        // Si la vente avait un client, sélectionnez-le
        if (sale.client_name) {
          const matchedClient = data?.find(client => client.name === sale.client_name);
          if (matchedClient) {
            setSelectedClientId(matchedClient.id);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
      }
    };
    
    if (open) {
      fetchClients();
    }
  }, [open, sale.client_name]);
  
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
        
        // Préremplir avec le produit actuel si c'est un seul produit
        if (sale.product_name && sale.product_name !== 'Multiple') {
          const matchedProduct = formattedProducts.find(p => p.name === sale.product_name);
          if (matchedProduct) {
            setSelectedProducts([{
              ...matchedProduct,
              quantity: 1
            }]);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };
    
    if (open) {
      fetchProducts();
    }
  }, [open, projectCategory, sale.product_name]);
  
  // Mettre à jour le prix total lorsque les produits sélectionnés changent
  useEffect(() => {
    if (selectedProducts.length > 0) {
      const total = selectedProducts.reduce((sum, product) => {
        return sum + (product.price * product.quantity);
      }, 0);
      
      setTotalPrice(total);
    }
  }, [selectedProducts]);
  
  const handleProductSelection = (selected: SelectedProduct[]) => {
    setSelectedProducts(selected);
  };
  
  const handlePriceChange = (newPrice: number) => {
    setTotalPrice(newPrice);
  };
  
  const resetForm = () => {
    // Réinitialiser aux valeurs originales de la vente
    if (sale.client_name) {
      const matchedClient = clients.find(client => client.name === sale.client_name);
      setSelectedClientId(matchedClient?.id || "");
    } else {
      setSelectedClientId("");
    }
    
    // Réinitialiser les produits sélectionnés si nécessaire
    if (sale.product_name && sale.product_name !== 'Multiple') {
      const matchedProduct = products.find(p => p.name === sale.product_name);
      if (matchedProduct) {
        setSelectedProducts([{
          ...matchedProduct,
          quantity: 1
        }]);
      } else {
        setSelectedProducts([]);
      }
    } else {
      setSelectedProducts([]);
    }
    
    setTotalPrice(sale.amount);
    setSaleDate(new Date(sale.date));
    setTransactionDate(sale.transaction_date ? new Date(sale.transaction_date) : new Date());
    setRemarks(sale.remarks || "");
  };
  
  const handleClose = () => {
    resetForm();
    onOpenChange(false);
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
      let label = sale.label;
      if (selectedProducts.length > 0) {
        const productNames = selectedProducts.map(p => p.name).join(', ');
        label = `Vente de ${productNames} à ${client?.name || 'client'}`;
      }
      
      // Format de date pour Supabase (YYYY-MM-DD)
      const formattedDate = saleDate.toISOString().split('T')[0];
      const formattedTransactionDate = transactionDate.toISOString().split('T')[0];
      
      // Mettre à jour la vente
      const { data: updateData, error: updateError } = await supabase
        .from('project_sales')
        .update({
          label: label,
          amount: totalPrice,
          date: formattedDate,
          transaction_date: formattedTransactionDate,  // Ajout de la nouvelle date de vente
          category: projectCategory || 'Vente',
          client_name: client?.name || null,
          product_name: selectedProducts.length === 1 ? selectedProducts[0].name : 'Multiple',
          remarks: remarks || null
        })
        .eq('id', sale.id)
        .select();
      
      if (updateError) throw updateError;
      
      // Si nécessaire, mettre à jour les liens produit-projet
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
        title: "Vente mise à jour",
        description: "La vente a été mise à jour avec succès."
      });
      
      // Appeler la fonction de callback
      onSaleUpdated();
      
      // Fermer le modal
      handleClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la vente:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la vente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier la vente du projet {projectName}</DialogTitle>
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
            {isSubmitting ? "Enregistrement..." : "Mettre à jour la vente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSaleDialog;
