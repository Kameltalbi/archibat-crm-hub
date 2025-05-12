
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from "@/services/leaveService";
import LeaveRequestForm from "./LeaveRequestForm";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee;
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
        
        <LeaveRequestForm 
          employee={employee} 
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default LeaveRequestModal;
