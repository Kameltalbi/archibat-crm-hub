
import { useState, useEffect } from "react";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { productService } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { clientService } from "@/services/clientService";
import ClientSelect from "./form/ClientSelect";

// Define the client type
interface Client {
  id: number;
  name: string;
}

// Define the product type
interface Product {
  id: string;
  name: string;
  category_name?: string;
  description?: string | null;
  price: number;
  category_id?: string | null;
}

// Define the props for the component
interface AddSaleModalProps {
  projectClients: Client[];
  projectName?: string;
  projectCategory?: string; // Catégorie du projet
}

const AddSaleModal = ({ projectClients, projectName, projectCategory }: AddSaleModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    clientId: "",
    saleDate: new Date(),
    amount: "",
    productId: "",
    remarks: "",
  });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(false);

  // Récupérer les produits depuis Supabase en fonction de la catégorie du projet
  useEffect(() => {
    const fetchProducts = async () => {
      if (!open) return;

      try {
        setIsLoading(true);
        const products = await productService.getProductsWithCategories();
        
        // Filtrer les produits en fonction de la catégorie du projet
        if (projectCategory) {
          // Mapper les catégories de projets aux catégories de produits
          const categoryMapping: Record<string, string[]> = {
            "Rénovation": ["Travaux", "Services"],
            "Construction": ["Travaux", "Matériaux"],
            "Aménagement": ["Services", "Fournitures"],
            "Design": ["Services", "Études"],
            "Études": ["Études", "Services"],
            "Conseils": ["Services"]
          };
          
          const matchingCategories = categoryMapping[projectCategory] || [];
          
          if (matchingCategories.length > 0) {
            const filtered = products.filter(product => {
              const productCategory = product.categories?.name || "";
              return matchingCategories.includes(productCategory);
            });
            setAvailableProducts(filtered);
          } else {
            setAvailableProducts(products);
          }
        } else {
          setAvailableProducts(products);
        }
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
  }, [open, projectCategory, toast]);

  // Récupérer tous les clients
  useEffect(() => {
    const fetchAllClients = async () => {
      if (!open) return;

      try {
        setIsLoadingClients(true);
        const clients = await clientService.getAllClients();
        setAllClients(clients);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger la liste des clients"
        });
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchAllClients();
  }, [open, toast]);

  const handleChange = (field: string, value: any) => {
    // Si on change de produit, mettons à jour le montant avec le prix du produit sélectionné
    if (field === "productId") {
      const selectedProduct = availableProducts.find(p => p.id.toString() === value);
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

  const handleSave = () => {
    // Validate form data
    if (!formData.saleDate || !formData.amount || !formData.productId || !formData.clientId) {
      toast({
        variant: "destructive",
        title: "Champs obligatoires",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    // Get the selected product and client
    const selectedProduct = availableProducts.find(p => p.id.toString() === formData.productId);
    const selectedClient = allClients.find(c => c.id.toString() === formData.clientId);

    // Convert amount to number and prepare data
    const saleData = {
      ...formData,
      amount: parseFloat(formData.amount),
      product: selectedProduct ? selectedProduct.name : "Produit inconnu",
      category: selectedProduct ? selectedProduct.category_name || "Catégorie inconnue" : "Catégorie inconnue",
      clientName: selectedClient ? selectedClient.name : "Client inconnu"
    };

    console.log("Saving sale:", saleData);
    
    toast({
      title: "Vente ajoutée",
      description: "La vente a été ajoutée avec succès"
    });
    
    // Close the modal
    setOpen(false);
    
    // Reset the form
    setFormData({
      clientId: "",
      saleDate: new Date(),
      amount: "",
      productId: "",
      remarks: "",
    });

    return saleData;
  };

  const handleCancel = () => {
    // Close modal and reset form
    setOpen(false);
    setFormData({
      clientId: "",
      saleDate: new Date(),
      amount: "",
      productId: "",
      remarks: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#a05a2c] hover:bg-[#8a4a22]">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une vente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#403E43] dark:text-gray-200">
            Ajouter une nouvelle vente
            {projectName && <span className="text-sm text-muted-foreground block mt-1">
              Projet: {projectName}
            </span>}
            {projectCategory && <span className="text-sm text-muted-foreground block mt-1">
              Catégorie: {projectCategory}
            </span>}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complétez les informations pour enregistrer une nouvelle vente
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Client Selection */}
          <ClientSelect 
            clients={allClients.length > 0 ? allClients : projectClients}
            value={formData.clientId}
            onValueChange={(value) => handleChange("clientId", value)}
            label="Client *"
            placeholder={isLoadingClients ? "Chargement des clients..." : "Sélectionnez un client"}
            withSearch={true}
            disabled={isLoadingClients}
          />

          {/* Sale Date */}
          <div className="grid gap-2">
            <Label htmlFor="saleDate">Date de vente *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="saleDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.saleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.saleDate ? (
                    format(formData.saleDate, "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={formData.saleDate}
                  onSelect={(date) => handleChange("saleDate", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Selection */}
          <div className="grid gap-2">
            <Label htmlFor="product">Produit *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => handleChange("productId", value)}
            >
              <SelectTrigger id="product" className="w-full">
                <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un produit"} />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                {isLoading ? (
                  <SelectItem value="loading" disabled>Chargement des produits...</SelectItem>
                ) : availableProducts.length > 0 ? (
                  availableProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - {product.price} DT
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-products" disabled>
                    Aucun produit disponible pour cette catégorie
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Montant (DT) *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Entrez le montant"
              className="border-input"
            />
          </div>

          {/* Remarques */}
          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarques</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              placeholder="Ajouter des remarques ou commentaires (optionnel)"
              className="border-input"
              rows={3}
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
            className="bg-[#a05a2c] hover:bg-[#8a4a22]"
          >
            Enregistrer la vente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleModal;
