
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";
import { Client } from "@/lib/supabase";
import { useClientForm } from "@/hooks/useClientForm";
import CompanyInfoFields from "./form/CompanyInfoFields";
import ContactFields from "./form/ContactFields";

interface EditClientModalProps {
  client: Client;
  onClientUpdated?: () => void;
}

const EditClientModal = ({ client, onClientUpdated }: EditClientModalProps) => {
  const [open, setOpen] = useState(false);
  
  const { formData, handleChange, handleSubmit } = useClientForm(
    client, 
    () => {
      // Call the onClientUpdated callback and close modal on success
      if (onClientUpdated) onClientUpdated();
      setOpen(false);
    }
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = await handleSubmit(e);
    if (success) {
      setOpen(false);
    }
  };

  const handleCancel = () => {
    // Close modal
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">Modifier le client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
          <CompanyInfoFields formData={formData} handleChange={handleChange} />
          
          <ContactFields 
            contactData={formData.contact1}
            prefix="contact1"
            title="Contact principal"
            isRequired={true}
            handleChange={handleChange}
          />
          
          <ContactFields 
            contactData={formData.contact2}
            prefix="contact2"
            title="Contact secondaire"
            subtitle="optionnel"
            isRequired={false}
            handleChange={handleChange}
          />

          <DialogFooter>
            <Button 
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-terracotta hover:bg-ocre">
              <Save className="mr-2 h-4 w-4" /> Enregistrer le client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientModal;
