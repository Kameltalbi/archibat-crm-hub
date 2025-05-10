
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/supabase";

export interface ContactForm {
  name: string;
  position: string;
  email: string;
  phone: string;
}

export interface ClientForm {
  companyName: string;
  vatCode: string;
  email: string;
  phone: string;
  address: string;
  contact1: ContactForm;
  contact2: ContactForm;
}

export const useClientForm = (client: Client, onClientUpdated?: () => void, onCancel?: () => void) => {
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
      
      // Call the onClientUpdated callback if provided
      if (onClientUpdated) {
        onClientUpdated();
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la modification du client:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le client. Veuillez réessayer."
      });
      return false;
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit
  };
};
