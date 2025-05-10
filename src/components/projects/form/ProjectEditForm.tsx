
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import DatePickerField from "./DatePickerField";
import CategorySelect from "./CategorySelect";
import StatusSelect from "./StatusSelect";

interface ProjectEditFormProps {
  project: Project & { client_name?: string };
  onSuccess: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ProjectEditForm = ({ project, onSuccess, onCancel, isOpen }: ProjectEditFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: project.name || "",
    startDate: project.start_date ? new Date(project.start_date) : undefined,
    endDate: project.end_date ? new Date(project.end_date) : undefined,
    status: project.status || "",
    category: project.category || "",
    targetRevenue: project.target_revenue || undefined,
  });

  useEffect(() => {
    // Update form data when project changes
    setFormData({
      name: project.name || "",
      startDate: project.start_date ? new Date(project.start_date) : undefined,
      endDate: project.end_date ? new Date(project.end_date) : undefined,
      status: project.status || "",
      category: project.category || "",
      targetRevenue: project.target_revenue || undefined,
    });
  }, [project]);

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
      const { error } = await supabase
        .from('projects')
        .update({
          name: formData.name,
          category: formData.category || null,
          start_date: formData.startDate ? formData.startDate.toISOString() : null,
          end_date: formData.endDate ? formData.endDate.toISOString() : null,
          status: formData.status as any,
          target_revenue: formData.targetRevenue || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', project.id);
        
      if (error) throw error;
      
      toast({
        title: "Succès",
        description: "Le projet a été modifié avec succès",
      });
      
      // Appeler le callback de succès
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la modification du projet:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification du projet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      
      {/* Category Selection */}
      <CategorySelect
        value={formData.category}
        onValueChange={(value) => handleChange("category", value)}
        disabled={isLoading}
        isOpen={isOpen}
      />

      {/* Target Revenue - Champ objectif CA */}
      <div className="grid gap-2">
        <label htmlFor="targetRevenue" className="text-sm font-medium">
          Objectif CA (DT HT)
        </label>
        <Input
          id="targetRevenue"
          type="number"
          min="0"
          step="0.01"
          value={formData.targetRevenue || ""}
          onChange={(e) => handleChange("targetRevenue", e.target.value ? parseFloat(e.target.value) : undefined)}
          placeholder="Entrez l'objectif de chiffre d'affaires"
          className="border-input"
        />
      </div>

      {/* Start Date */}
      <DatePickerField
        id="startDate"
        label="Date de début"
        value={formData.startDate}
        onChange={(date) => handleChange("startDate", date)}
        required={true}
      />

      {/* End Date */}
      <DatePickerField
        id="endDate"
        label="Date de fin"
        value={formData.endDate}
        onChange={(date) => handleChange("endDate", date)}
      />

      {/* Status */}
      <StatusSelect
        value={formData.status}
        onValueChange={(value) => handleChange("status", value)}
        disabled={isLoading}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
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
      </div>
    </div>
  );
};

export default ProjectEditForm;
