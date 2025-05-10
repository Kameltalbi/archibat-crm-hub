
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Use mock data from the existing Clients.tsx file
const clients = [
  {
    id: 1,
    name: "Groupe Durand",
    email: "contact@durand-groupe.com",
    phone: "04 91 XX XX XX",
    address: "13 Rue République, 13001 Marseille",
    projects: 4,
  },
  {
    id: 2,
    name: "SCI Bartoli",
    email: "info@sci-bartoli.fr",
    phone: "04 42 XX XX XX",
    address: "45 Avenue Prado, 13008 Marseille",
    projects: 2,
  },
  {
    id: 3,
    name: "Cabinet Martin & Associés",
    email: "cabinet@martin-associes.com",
    phone: "04 91 XX XX XX",
    address: "8 Place Castellane, 13006 Marseille",
    projects: 3,
  },
  {
    id: 4,
    name: "Immobilier Côté Sud",
    email: "contact@immocotesud.fr",
    phone: "04 42 XX XX XX",
    address: "22 Cours Mirabeau, 13100 Aix-en-Provence",
    projects: 2,
  },
  {
    id: 5,
    name: "Fondation Meyers",
    email: "admin@fondation-meyers.org",
    phone: "04 91 XX XX XX",
    address: "120 Boulevard Michelet, 13009 Marseille",
    projects: 1,
  },
  {
    id: 6,
    name: "Lyon Architectes",
    email: "info@lyon-archi.com",
    phone: "04 72 XX XX XX",
    address: "5 Place Bellecour, 69002 Lyon",
    projects: 0,
  },
];

const AddProjectModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    status: "",
    selectedClients: [] as number[],
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleClientToggle = (clientId: number) => {
    setFormData((prev) => {
      const newSelectedClients = [...prev.selectedClients];
      const index = newSelectedClients.indexOf(clientId);

      if (index > -1) {
        newSelectedClients.splice(index, 1);
      } else {
        newSelectedClients.push(clientId);
      }

      return { ...prev, selectedClients: newSelectedClients };
    });
  };

  const handleSave = () => {
    // This is a mock function that would save the project data
    console.log("Saving project:", formData);
    
    // In a real implementation, you would:
    // 1. Validate the form data
    // 2. Send it to an API or store it in a database
    // 3. Handle success/error states
    // 4. Close the modal on success
    
    // For now, we'll just close the modal
    setOpen(false);
    
    // Reset the form
    setFormData({
      name: "",
      startDate: undefined,
      endDate: undefined,
      status: "",
      selectedClients: [],
    });
  };

  // Get selected client names for display
  const selectedClientNames = formData.selectedClients
    .map((id) => clients.find((client) => client.id === id)?.name)
    .filter(Boolean);

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
                <SelectItem value="Terminé">Terminé</SelectItem>
                <SelectItem value="Suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Client(s) Multi-select */}
          <div className="grid gap-2">
            <label htmlFor="clients" className="text-sm font-medium">
              Client(s) concerné(s) *
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                >
                  {formData.selectedClients.length > 0
                    ? `${formData.selectedClients.length} client(s) sélectionné(s)`
                    : "Sélectionner des clients"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Clients</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {clients.map((client) => (
                  <DropdownMenuCheckboxItem
                    key={client.id}
                    checked={formData.selectedClients.includes(client.id)}
                    onCheckedChange={() => handleClientToggle(client.id)}
                  >
                    {client.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Display selected clients */}
            {selectedClientNames.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {selectedClientNames.map((name, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-terracotta hover:bg-ocre"
          >
            Enregistrer le projet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
