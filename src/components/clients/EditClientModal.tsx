
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Edit, Mail, Phone, Save, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/supabase";

interface ContactForm {
  name: string;
  position: string;
  email: string;
  phone: string;
}

interface ClientForm {
  companyName: string;
  vatCode: string;
  email: string;
  phone: string;
  address: string;
  contact1: ContactForm;
  contact2: ContactForm;
}

interface EditClientModalProps {
  client: Client;
  onClientUpdated?: () => void;
}

const EditClientModal = ({ client, onClientUpdated }: EditClientModalProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClientForm>({
    companyName: "",
    vatCode: "",
    email: "",
    phone: "",
    address: "",
    contact1: {
      name: "",
      position: "",
      email: "",
      phone: "",
    },
    contact2: {
      name: "",
      position: "",
      email: "",
      phone: "",
    }
  });

  useEffect(() => {
    // Initialize form with client data
    setFormData({
      companyName: client.name,
      vatCode: client.vat_code || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      contact1: {
        name: client.contact1_name || "",
        position: client.contact1_position || "",
        email: client.contact1_email || "",
        phone: client.contact1_phone || "",
      },
      contact2: {
        name: client.contact2_name || "",
        position: client.contact2_position || "",
        email: client.contact2_email || "",
        phone: client.contact2_phone || "",
      }
    });
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof Pick<ClientForm, 'contact1' | 'contact2'>],
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Update client in database
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: formData.companyName,
          vat_code: formData.vatCode,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          contact1_name: formData.contact1.name,
          contact1_position: formData.contact1.position,
          contact1_email: formData.contact1.email,
          contact1_phone: formData.contact1.phone,
          contact2_name: formData.contact2.name,
          contact2_position: formData.contact2.position,
          contact2_email: formData.contact2.email,
          contact2_phone: formData.contact2.phone
        })
        .eq('id', client.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: "Client modifié",
        description: "Le client a été modifié avec succès."
      });
      
      // Close modal
      setOpen(false);
      
      // Call the onClientUpdated callback if provided
      if (onClientUpdated) {
        onClientUpdated();
      }
    } catch (error) {
      console.error('Erreur lors de la modification du client:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le client. Veuillez réessayer."
      });
    }
  };

  const handleCancel = () => {
    // Close modal and reset form
    setOpen(false);
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
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">Modifier le client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="companyName" className="text-sm font-medium text-charcoal dark:text-light-gray">
                Nom de l'entreprise
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="border-light-gray focus-visible:ring-terracotta"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="vatCode" className="text-sm font-medium text-charcoal dark:text-light-gray">
                Code TVA
              </label>
              <Input
                id="vatCode"
                name="vatCode"
                value={formData.vatCode}
                onChange={handleChange}
                className="border-light-gray focus-visible:ring-terracotta"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-charcoal dark:text-light-gray flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-light-gray focus-visible:ring-terracotta"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-charcoal dark:text-light-gray flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Téléphone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-light-gray focus-visible:ring-terracotta"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-charcoal dark:text-light-gray">
                Adresse
              </label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="min-h-[80px] border-light-gray focus-visible:ring-terracotta"
                required
              />
            </div>

            <div className="border-t border-light-gray pt-4">
              <h3 className="text-md font-medium mb-4 flex items-center gap-2 text-charcoal dark:text-light-gray">
                <User className="h-4 w-4" /> Contact principal
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact1Name" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Nom
                    </label>
                    <Input
                      id="contact1Name"
                      name="contact1.name"
                      value={formData.contact1.name}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact1Position" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Poste
                    </label>
                    <Input
                      id="contact1Position"
                      name="contact1.position"
                      value={formData.contact1.position}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact1Email" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Email
                    </label>
                    <Input
                      id="contact1Email"
                      name="contact1.email"
                      type="email"
                      value={formData.contact1.email}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact1Phone" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Téléphone
                    </label>
                    <Input
                      id="contact1Phone"
                      name="contact1.phone"
                      value={formData.contact1.phone}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-light-gray pt-4">
              <h3 className="text-md font-medium mb-4 flex items-center gap-2 text-charcoal dark:text-light-gray">
                <User className="h-4 w-4" /> Contact secondaire (optionnel)
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact2Name" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Nom
                    </label>
                    <Input
                      id="contact2Name"
                      name="contact2.name"
                      value={formData.contact2.name}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact2Position" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Poste
                    </label>
                    <Input
                      id="contact2Position"
                      name="contact2.position"
                      value={formData.contact2.position}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contact2Email" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Email
                    </label>
                    <Input
                      id="contact2Email"
                      name="contact2.email"
                      type="email"
                      value={formData.contact2.email}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact2Phone" className="text-sm font-medium text-charcoal dark:text-light-gray">
                      Téléphone
                    </label>
                    <Input
                      id="contact2Phone"
                      name="contact2.phone"
                      value={formData.contact2.phone}
                      onChange={handleChange}
                      className="border-light-gray focus-visible:ring-terracotta"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
