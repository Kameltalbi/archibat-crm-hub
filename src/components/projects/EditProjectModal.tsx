
import { useState } from "react";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Project } from "@/lib/supabase";
import ProjectEditForm from "./form/ProjectEditForm";

interface EditProjectModalProps {
  project: Project & { client_name?: string };
  onUpdate: () => void;
}

const EditProjectModal = ({ project, onUpdate }: EditProjectModalProps) => {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onUpdate();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
            Modifier le projet
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les informations du projet
          </DialogDescription>
        </DialogHeader>
        
        <ProjectEditForm 
          project={project}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isOpen={open}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectModal;
