
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProjectSalesForm from "@/components/projects/ProjectSalesForm";

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

  const handleSaleAdded = () => {
    setOpen(false);
  };

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
        <ProjectSalesForm 
          projectId="mock-project-id" 
          projectName={projectName}
          projectCategory={projectCategory}
          clientName={projectClients[0]?.name || ''}
          onSaleAdded={handleSaleAdded} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleModal;
