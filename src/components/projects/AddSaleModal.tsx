
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import ProjectSalesForm from "@/components/projects/ProjectSalesForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

  const selectedClientName = projectClients.find(client => client.id === selectedClientId)?.name || '';

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
        
        {projectClients.length > 1 && (
          <div className="mb-4">
            <Label htmlFor="client-select">Client associé à cette vente</Label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger id="client-select" className="mt-1">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {projectClients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <ProjectSalesForm 
          projectId="mock-project-id" 
          projectName={projectName}
          projectCategory={projectCategory}
          clientName={selectedClientName}
          onSaleAdded={handleSaleAdded} 
          onCancel={() => setOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddSaleModal;
