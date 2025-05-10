
import { Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientForm } from "@/hooks/useClientForm";

interface CompanyInfoFieldsProps {
  formData: ClientForm;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const CompanyInfoFields = ({ formData, handleChange }: CompanyInfoFieldsProps) => {
  return (
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
    </div>
  );
};

export default CompanyInfoFields;
