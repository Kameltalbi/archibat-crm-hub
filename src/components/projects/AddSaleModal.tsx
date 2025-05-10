
import { useState } from "react";
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

// Define the client type
interface Client {
  id: number;
  name: string;
}

// Define the props for the component
interface AddSaleModalProps {
  projectClients: Client[];
  projectName?: string;
}

const AddSaleModal = ({ projectClients, projectName }: AddSaleModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "",
    saleDate: undefined as Date | undefined,
    amount: "",
    category: "",
    clientId: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    // Validate form data
    if (!formData.label || !formData.saleDate || !formData.amount || !formData.category || !formData.clientId) {
      console.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // Convert amount to number
    const saleData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    console.log("Saving sale:", saleData);
    
    // Close the modal
    setOpen(false);
    
    // Reset the form
    setFormData({
      label: "",
      saleDate: undefined,
      amount: "",
      category: "",
      clientId: "",
    });

    return saleData;
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

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Étude">Étude</SelectItem>
                <SelectItem value="Travaux">Travaux</SelectItem>
                <SelectItem value="Fourniture">Fourniture</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
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
