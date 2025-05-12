
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, differenceInDays, parseISO, isAfter, isBefore, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { leaveService, Employee } from "@/services/leaveService";
import { supabase } from "@/lib/supabase";
import DatePickerField from "@/components/projects/form/DatePickerField";

const formSchema = z.object({
  start_date: z.date({
    required_error: "La date de début est requise",
  }),
  end_date: z.date({
    required_error: "La date de fin est requise",
  }),
  reason: z.string().optional(),
}).refine(
  (data) => isAfter(data.end_date, data.start_date) || data.start_date.getTime() === data.end_date.getTime(),
  {
    message: "La date de fin doit être égale ou postérieure à la date de début",
    path: ["end_date"],
  }
);

interface LeaveRequestFormProps {
  employee: Employee;
  onSuccess: () => void;
}

const LeaveRequestForm = ({ employee, onSuccess }: LeaveRequestFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_date: undefined,
      end_date: undefined,
      reason: "",
    },
  });
  
  const calculateDaysRequested = () => {
    const startDate = form.watch("start_date");
    const endDate = form.watch("end_date");
    
    if (!startDate || !endDate) return 0;
    
    // +1 car on compte également le jour de début
    return differenceInDays(endDate, startDate) + 1;
  };
  
  const daysRequested = calculateDaysRequested();
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Vérifier si l'employé a assez de jours de congés
    if (daysRequested > employee.leave_balance) {
      toast({
        title: "Solde insuffisant",
        description: `Vous n'avez pas assez de jours de congés disponibles. Solde: ${employee.leave_balance} jours.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const startDateString = format(values.start_date, "yyyy-MM-dd");
      const endDateString = format(values.end_date, "yyyy-MM-dd");
      
      // Créer la demande de congé
      const leaveRequest = await leaveService.createLeaveRequest({
        employee_id: employee.id,
        start_date: startDateString,
        end_date: endDateString,
        days_requested: daysRequested,
        reason: values.reason || null,
      });
      
      if (leaveRequest) {
        // Notification à l'administrateur
        try {
          await supabase.functions.invoke("notify-leave-request", {
            body: {
              type: "new",
              employeeName: employee.name,
              employeeEmail: employee.email,
              startDate: startDateString,
              endDate: endDateString,
              daysRequested,
            },
          });
        } catch (notifyError) {
          console.error("Erreur lors de l'envoi de la notification:", notifyError);
        }
        
        toast({
          title: "Demande envoyée",
          description: "Votre demande de congé a été envoyée avec succès.",
        });
        form.reset();
        onSuccess();
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la demande de congé.",
          variant: "destructive",
        });
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
        <CardTitle>Demande de congé</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <DatePickerField
                    id="start_date"
                    label="Date de début"
                    value={field.value}
                    onChange={field.onChange}
                    required
                  />
                )}
              />
              
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <DatePickerField
                    id="end_date"
                    label="Date de fin"
                    value={field.value}
                    onChange={field.onChange}
                    required
                  />
                )}
              />
            </div>
            
            <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-md">
              <span>Jours demandés:</span>
              <span className="font-semibold">{daysRequested} jour(s)</span>
            </div>
            
            <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-md">
              <span>Solde actuel:</span>
              <span className="font-semibold">{employee.leave_balance} jour(s)</span>
            </div>
            
            <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-md">
              <span>Solde après congé:</span>
              <span className={`font-semibold ${employee.leave_balance - daysRequested < 0 ? 'text-destructive' : ''}`}>
                {employee.leave_balance - daysRequested} jour(s)
              </span>
            </div>
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Motif de la demande de congé" 
                      {...field} 
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting || daysRequested <= 0 || daysRequested > employee.leave_balance}
            >
              {isSubmitting ? "Traitement en cours..." : "Soumettre la demande"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestForm;
