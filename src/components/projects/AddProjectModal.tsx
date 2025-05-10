
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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { projectService } from "@/services/projectService";
import { clientService } from "@/services/clientService";

interface Client {
  id: string;
  name: string;
}

// Liste des catégories de projet
const projectCategories = [
  { id: 1, name: "Rénovation" },
  { id: 2, name: "Construction" },
  { id: 3, name: "Aménagement" },
  { id: 4, name: "Réhabilitation" },
  { id: 5, name: "Extension" },
];

const AddProjectModal = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    clientId: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "",
    category: "",
  });

  // Charger la liste des clients
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const data = await clientService.getAllClients();
        setClients(data);
      } catch (error) {
        console.error("Erreur lors du chargement des clients:", error);
      } finally {
        setLoadingClients(false);
      }
    };
    
    fetchClients();
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    // Validation des champs requis
    if (!formData.name || !formData.status || !formData.startDate) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newProject = await projectService.createProject({
        name: formData.name,
        client_id: formData.clientId || null,
        description: null,
        start_date: formData.startDate.toISOString(),
        end_date: formData.endDate ? formData.endDate.toISOString() : null,
        status: formData.status as any,
        category: formData.category || null,
      });
      
      if (newProject) {
        toast({
          title: "Succès",
          description: "Le projet a été créé avec succès",
        });
        
        // Fermer le modal et réinitialiser le formulaire
        setOpen(false);
        resetForm();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer le projet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création du projet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      clientId: "",
      startDate: undefined,
      endDate: undefined,
      status: "",
      category: "",
    });
  };

  const handleCancel = () => {
    // Fermer modal et réinitialiser formulaire
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-ocre">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un projet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">Ajouter un nouveau projet</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complétez les informations pour créer un nouveau projet
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Project Name */}
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Nom du projet *
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Entrez le nom du projet"
              className="border-input"
            />
          </div>
          
          {/* Client Selection */}
          <div className="grid gap-2">
            <label htmlFor="client" className="text-sm font-medium">
              Client
            </label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange("clientId", value)}
            >
              <SelectTrigger id="client" className="w-full">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {loadingClients ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>Aucun client disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Category Selection */}
          <div className="grid gap-2">
            <label htmlFor="category" className="text-sm font-medium">
              Catégorie *
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {projectCategories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Start Date */}
          <div className="grid gap-2">
            <label htmlFor="startDate" className="text-sm font-medium">
              Date de début *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="startDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(formData.startDate, "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => handleChange("startDate", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="grid gap-2">
            <label htmlFor="endDate" className="text-sm font-medium">
              Date de fin
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? (
                    format(formData.endDate, "dd MMMM yyyy", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => handleChange("endDate", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Statut *
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En cours">En cours</SelectItem>
                <SelectItem value="Planifié">Planifié</SelectItem>
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
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
            className="bg-terracotta hover:bg-ocre"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer le projet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
