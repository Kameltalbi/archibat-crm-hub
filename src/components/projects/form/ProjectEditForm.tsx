
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Project, ProjectStatus } from "@/lib/supabase";
import ClientSelect from "./ClientSelect";
import CategorySelectField from "./CategorySelectField";
import StatusSelectField from "./StatusSelectField";

// Define interfaces
export interface Client {
  id: string;
  name: string;
}

export interface ProjectFormData {
  name: string;
  client_id: string | null;
  category: string;
  description: string;
  start_date: string;
  end_date: string;
  status: ProjectStatus | null;
}

interface ProjectEditFormProps {
  project: Project & { client_name?: string };
  onSave: () => void;
  onCancel: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const ProjectEditForm = ({ 
  project, 
  onSave, 
  onCancel, 
  isLoading, 
  setIsLoading 
}: ProjectEditFormProps) => {
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
  const { toast } = useToast();

  useEffect(() => {
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
  }, [project]);

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
        
        onSave();
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
      <ClientSelect 
        value={formData.client_id?.toString() || ""}
        onValueChange={(value) => handleSelectChange('client_id', value)}
        clients={clients}
        disabled={isLoading}
      />

      {/* Category */}
      <CategorySelectField
        value={formData.category || ""}
        onValueChange={(value) => handleSelectChange('category', value)}
        disabled={isLoading}
      />

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
      <StatusSelectField
        value={formData.status || ""}
        onValueChange={(value) => handleSelectChange('status', value as ProjectStatus)}
        disabled={isLoading}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium mt-2 sm:mt-0"
          onClick={onCancel}
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-terracotta hover:bg-ocre text-white rounded-md text-sm font-medium"
          onClick={handleSave}
          disabled={isLoading}
        >
          {isLoading ? "En cours..." : "Enregistrer les modifications"}
        </button>
      </div>
    </div>
  );
};

export default ProjectEditForm;
