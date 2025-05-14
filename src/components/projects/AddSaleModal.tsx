
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProjectSalesForm from "@/components/projects/ProjectSalesForm";
import ClientSelect from "@/components/projects/form/ClientSelect";

interface ClientMinimal {
  id: string;
  name: string;
}

interface AddSaleModalProps {
  projectClients: ClientMinimal[];
  projectName: string;
  projectCategory?: string;
}

const AddSaleModal = ({ projectClients, projectName, projectCategory }: AddSaleModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(
    projectClients.length > 0 ? projectClients[0].id : undefined
  );

  const handleSaleAdded = () => {
    setOpen(false);
  };

  console.log("Rendering AddSaleModal with clients:", projectClients);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter une vente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Ajouter une vente pour {projectName}
          </DialogTitle>
        </DialogHeader>
        
        {/* Sélecteur de client avec recherche */}
        <div className="mb-4">
          <ClientSelect
            value={selectedClientId || ""}
            onValueChange={setSelectedClientId}
            clients={projectClients as any[]}
            disabled={projectClients.length === 0}
            label="Sélectionner un client *"
            placeholder="Sélectionner un client"
            withSearch={true}
          />
        </div>

        <ProjectSalesForm 
          projectId="mock-project-id" 
          projectName={projectName}
          projectCategory={projectCategory}
          clientId={selectedClientId}
          clients={projectClients}
          onSaleAdded={handleSaleAdded} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleModal;
