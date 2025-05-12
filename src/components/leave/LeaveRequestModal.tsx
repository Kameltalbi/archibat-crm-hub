
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from "@/services/leaveService";
import LeaveRequestForm from "./LeaveRequestForm";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
}

const LeaveRequestModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  employee 
}: LeaveRequestModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#F1F0FB]">
        <DialogHeader>
          <DialogTitle className="text-xl">Demande de congé</DialogTitle>
        </DialogHeader>
        
        {employee ? (
          <LeaveRequestForm 
            employee={employee} 
            onSuccess={onSuccess} 
          />
        ) : (
          <div className="py-4 text-center">
            <p className="text-lg mb-4">Vous n'êtes pas encore enregistré comme employé.</p>
            <p className="text-muted-foreground">
              Veuillez contacter l'administrateur pour vous ajouter au système avant de pouvoir demander un congé.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestModal;
