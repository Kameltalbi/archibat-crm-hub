
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProjectForm from "./form/ProjectForm";

interface AddProjectModalProps {
  onProjectAdded?: () => void;
}

const AddProjectModal = ({ onProjectAdded }: AddProjectModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    if (onProjectAdded) {
      onProjectAdded();
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-ocre">
          <Plus className="mr-2 h-4 w-4" /> Ajouter une action commerciale
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">Ajouter une nouvelle action commerciale</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complétez les informations pour créer une nouvelle action commerciale
          </DialogDescription>
        </DialogHeader>
        
        <ProjectForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isOpen={open}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectModal;
