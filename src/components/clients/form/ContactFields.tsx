
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ContactForm } from "@/hooks/useClientForm";
import { Separator } from "@/components/ui/separator";

interface ContactFieldsProps {
  contactData: ContactForm;
  prefix: string;
  title: string;
  subtitle?: string;
  isRequired: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFields = ({ 
  contactData, 
  prefix, 
  title, 
  subtitle,
  isRequired, 
  handleChange 
}: ContactFieldsProps) => {
  return (
    <div className="border-t border-light-gray pt-4">
      <h3 className="text-md font-medium mb-4 flex items-center gap-2 text-charcoal dark:text-light-gray">
        <User className="h-4 w-4" /> {title}
        {subtitle && <span className="text-sm text-muted-foreground">({subtitle})</span>}
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`${prefix}Name`} className="text-sm font-medium text-charcoal dark:text-light-gray">
              Nom
            </label>
            <Input
              id={`${prefix}Name`}
              name={`${prefix}.name`}
              value={contactData.name}
              onChange={handleChange}
              className="border-light-gray focus-visible:ring-terracotta"
              required={isRequired}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${prefix}Position`} className="text-sm font-medium text-charcoal dark:text-light-gray">
              Poste
            </label>
            <Input
              id={`${prefix}Position`}
              name={`${prefix}.position`}
              value={contactData.position}
              onChange={handleChange}
              className="border-light-gray focus-visible:ring-terracotta"
              required={isRequired}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`${prefix}Email`} className="text-sm font-medium text-charcoal dark:text-light-gray">
              Email
            </label>
            <Input
              id={`${prefix}Email`}
              name={`${prefix}.email`}
              type="email"
              value={contactData.email}
              onChange={handleChange}
              className="border-light-gray focus-visible:ring-terracotta"
              required={isRequired}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`${prefix}Phone`} className="text-sm font-medium text-charcoal dark:text-light-gray">
              Téléphone
            </label>
            <Input
              id={`${prefix}Phone`}
              name={`${prefix}.phone`}
              value={contactData.phone}
              onChange={handleChange}
              className="border-light-gray focus-visible:ring-terracotta"
              required={isRequired}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFields;
