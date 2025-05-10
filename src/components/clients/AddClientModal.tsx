
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, User, Mail, Phone, Save } from "lucide-react";

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

const AddClientModal = () => {
  const [open, setOpen] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Client data submitted:", formData);
    // Here you would typically call an API to save the client
    setOpen(false);
    // Reset form
    setFormData({
      companyName: "",
      vatCode: "",
      email: "",
      phone: "",
      address: "",
      contact1: { name: "", position: "", email: "", phone: "" },
      contact2: { name: "", position: "", email: "", phone: "" }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-terracotta hover:bg-ocre">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-charcoal dark:text-light-gray">Nouveau client</DialogTitle>
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
            <Button type="submit" className="bg-terracotta hover:bg-ocre">
              <Save className="mr-2 h-4 w-4" /> Enregistrer le client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
