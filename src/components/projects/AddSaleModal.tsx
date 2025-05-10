
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Define the client type
interface Client {
  id: number;
  name: string;
}

// Define the product type
interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
}

// Mock products - similar to those in Products.tsx
const mockProducts = [
  {
    id: 1,
    name: "Étude de faisabilité",
    category: "Études",
    description: "Analyse préliminaire du projet et évaluation technique",
    price: 2500,
  },
  {
    id: 2,
    name: "Plan d'aménagement",
    category: "Études",
    description: "Réalisation des plans pour l'aménagement intérieur",
    price: 1800,
  },
  {
    id: 3,
    name: "Rénovation complète",
    category: "Travaux",
    description: "Rénovation complète incluant matériaux et main d'œuvre",
    price: 15000,
  },
  {
    id: 4,
    name: "Installation électrique",
    category: "Travaux",
    description: "Remise aux normes et installation électrique complète",
    price: 4200,
  },
  {
    id: 5,
    name: "Accompagnement projet",
    category: "Services",
    description: "Accompagnement et suivi de projet (mensuel)",
    price: 1200,
  },
  {
    id: 6,
    name: "Conseil en décoration",
    category: "Services",
    description: "Conseils sur l'aménagement et le design intérieur",
    price: 950,
  },
];

// Define the props for the component
interface AddSaleModalProps {
  projectClients: Client[];
  projectName?: string;
  projectCategory?: string; // Ajout de la catégorie du projet
}

const AddSaleModal = ({ projectClients, projectName, projectCategory }: AddSaleModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    saleDate: undefined as Date | undefined,
    amount: "",
    productId: "",
    clientId: "",
  });
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Filtrer les produits en fonction de la catégorie du projet
  useEffect(() => {
    if (projectCategory) {
      const filteredProducts = mockProducts.filter(
        product => product.category === projectCategory
      );
      setAvailableProducts(filteredProducts);
    } else {
      setAvailableProducts(mockProducts);
    }
  }, [projectCategory]);

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

  const handleSave = async () => {
    // Validate form data
    if (!formData.label || !formData.saleDate || !formData.amount || !formData.productId || !formData.clientId) {
      toast({
        variant: "destructive",
        title: "Erreur de formulaire",
        description: "Veuillez remplir tous les champs obligatoires"
      });
      return;
    }

    // Get the selected product
    const selectedProduct = availableProducts.find(p => p.id.toString() === formData.productId);
    if (!selectedProduct) {
      toast({
        variant: "destructive",
        title: "Erreur de produit",
        description: "Le produit sélectionné est invalide"
      });
      return;
    }

    // Get the selected client
    const selectedClient = projectClients.find(c => c.id.toString() === formData.clientId);
    if (!selectedClient) {
      toast({
        variant: "destructive",
        title: "Erreur de client",
        description: "Le client sélectionné est invalide"
      });
      return;
    }

    setIsSubmitting(true);

    // Extract the project ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id') || '';

    try {
      // Insert the sale into the project_sales table
      const { error } = await supabase
        .from('project_sales')
        .insert({
          project_id: projectId, // Use the ID from the URL or pass project ID as prop
          label: formData.label,
          date: formData.saleDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
          amount: parseFloat(formData.amount),
          category: selectedProduct.category,
          client_name: selectedClient.name,
          product_name: selectedProduct.name
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Vente enregistrée",
        description: "La vente a été ajoutée avec succès"
      });

      // Close the modal and reset the form
      setOpen(false);
      setFormData({
        label: "",
        saleDate: undefined,
        amount: "",
        productId: "",
        clientId: "",
      });
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la vente:", error);
      toast({
        variant: "destructive", 
        title: "Erreur",
        description: error.message || "Impossible d'enregistrer la vente"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Close modal and reset form
    setOpen(false);
    setFormData({
      label: "",
      saleDate: undefined,
      amount: "",
      productId: "",
      clientId: "",
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
          {/* Label */}
          <div className="grid gap-2">
            <Label htmlFor="label">Libellé *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => handleChange("label", e.target.value)}
              placeholder="Entrez le libellé de la vente"
              className="border-input"
            />
          </div>

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
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.saleDate}
                  onSelect={(date) => handleChange("saleDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Selection (replacing Category) */}
          <div className="grid gap-2">
            <Label htmlFor="product">Produit *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => handleChange("productId", value)}
            >
              <SelectTrigger id="product" className="w-full">
                <SelectValue placeholder="Sélectionner un produit" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.length > 0 ? (
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

          {/* Client */}
          <div className="grid gap-2">
            <Label htmlFor="client">Client *</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange("clientId", value)}
            >
              <SelectTrigger id="client" className="w-full">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {projectClients.length > 0 ? (
                  projectClients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-clients" disabled>
                    Aucun client disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-[#a05a2c] hover:bg-[#8a4a22]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer la vente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleModal;
