
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { leaveService, Employee } from "@/services/leaveService";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  leave_balance: z.coerce.number().min(0, { message: "Le solde ne peut pas être négatif" }).default(25),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeFormProps {
  onSuccess: () => void;
  initialData?: Employee;
}

const EmployeeForm = ({ onSuccess, initialData }: EmployeeFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      leave_balance: initialData?.leave_balance || 25,
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (initialData) {
        // Mise à jour d'un employé existant
        const success = await leaveService.updateEmployee(initialData.id, values);
        
        if (success) {
          toast({
            title: "Employé mis à jour",
            description: "Les informations de l'employé ont été mises à jour avec succès.",
          });
          onSuccess();
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la mise à jour de l'employé.",
            variant: "destructive",
          });
        }
      } else {
        // Création d'un nouvel employé
        const employee = await leaveService.createEmployee({
          name: values.name,
          email: values.email,
          leave_balance: values.leave_balance
        });
        
        if (employee) {
          toast({
            title: "Employé créé",
            description: "L'employé a été créé avec succès.",
          });
          form.reset();
          onSuccess();
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la création de l'employé.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Modifier l'employé" : "Ajouter un employé"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de l'employé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemple.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="leave_balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Solde de congés (jours)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Traitement en cours..." : initialData ? "Mettre à jour" : "Ajouter"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
