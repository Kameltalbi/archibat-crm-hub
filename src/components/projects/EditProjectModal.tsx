
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Project, ProjectStatus } from "@/lib/supabase";

// Define interfaces
interface Client {
  id: string;
  name: string;
}

interface ProjectFormData {
  name: string;
  client_id: string | null;
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus | null;
}

interface EditProjectModalProps {
  project: Project & { client_name?: string };
  onUpdate: () => void;
}

const PROJECT_STATUSES: ProjectStatus[] = ['En cours', 'Planifié', 'Terminé', 'Suspendu'];
const PROJECT_CATEGORIES = ['Rénovation', 'Construction', 'Aménagement', 'Réhabilitation', 'Extension'];

const EditProjectModal = ({ project, onUpdate }: EditProjectModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    client_id: null,
    category: "",
    description: "",
    start_date: "",
    end_date: "",
    status: null
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchClients();
      // Initialize form with project data
      setFormData({
        name: project.name || "",
        client_id: project.client_id || null,
        category: project.category || "",
        description: project.description || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status: project.status || null
      });
    }
  }, [project, open]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des clients."
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du projet est requis";
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
    if (errors[name as keyof ProjectFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user selects
    if (errors[name as keyof ProjectFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('projects')
          .update({
            name: formData.name.trim(),
            client_id: formData.client_id,
            category: formData.category,
            description: formData.description.trim(),
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', project.id);
          
        if (error) throw error;
        
        toast({
          title: "Projet modifié",
          description: "Le projet a été modifié avec succès."
        });
        
        // Close modal and refresh projects list
        setOpen(false);
        onUpdate();
        
      } catch (error) {
        console.error('Erreur lors de la modification du projet:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de modifier le projet. Veuillez réessayer."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Modifier le projet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les informations du projet
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Project Name */}
          <div className="grid gap-2">
            <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
              Nom du projet *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Saisissez le nom du projet"
              className={errors.name ? "border-destructive" : "border-input"}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Client */}
          <div className="grid gap-2">
            <Label htmlFor="client_id">Client</Label>
            <Select
              value={formData.client_id?.toString() || ""}
              onValueChange={(value) => handleSelectChange('client_id', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="border-input">
                <SelectValue placeholder="Sélectionnez un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem 
                    key={client.id} 
                    value={client.id.toString()}
                  >
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) => handleSelectChange('category', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="border-input">
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem 
                    key={category} 
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description du projet"
              className="border-input min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Date de début</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="border-input"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">Date de fin</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="border-input"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.status || ""}
              onValueChange={(value) => handleSelectChange('status', value as ProjectStatus)}
              disabled={isLoading}
            >
              <SelectTrigger className="border-input">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem 
                    key={status} 
                    value={status}
                  >
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={handleSave}
            className="bg-terracotta hover:bg-ocre text-white"
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : "Enregistrer les modifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
