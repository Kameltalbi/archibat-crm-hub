
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, differenceInCalendarDays } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { Employee } from "@/services/leaveService";

interface AddLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

const AddLeaveModal = ({ isOpen, onClose, employee }: AddLeaveModalProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner les dates de début et de fin",
        variant: "destructive"
      });
      return;
    }
    
    if (endDate < startDate) {
      toast({
        title: "Erreur",
        description: "La date de fin doit être supérieure à la date de début",
        variant: "destructive"
      });
      return;
    }

    // Calculer le nombre de jours demandés
    const daysRequested = differenceInCalendarDays(endDate, startDate) + 1;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("leave_requests")
        .insert({
          employee_id: employee.id,
          start_date: format(startDate, "yyyy-MM-dd"),
          end_date: format(endDate, "yyyy-MM-dd"),
          days_requested: daysRequested,
          reason: reason.trim() || null,
          status: "pending"
        });
      
      if (error) throw error;
      
      toast({
        title: "Demande de congé créée",
        description: `La demande de congé pour ${employee.name} a été créée avec succès.`
      });
      
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création de la demande de congé:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la demande de congé",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une demande de congé</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>Employé</Label>
            <div className="p-2 bg-muted rounded-md">
              {employee.name}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="start-date">Date de début</Label>
              <DatePicker
                selected={startDate}
                onSelect={setStartDate}
                locale={fr}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="end-date">Date de fin</Label>
              <DatePicker
                selected={endDate}
                onSelect={setEndDate}
                locale={fr}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="reason">Motif (optionnel)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motif de la demande de congé"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLeaveModal;
