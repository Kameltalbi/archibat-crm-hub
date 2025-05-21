
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee } from "@/services/leaveService";
import LeaveRequestForm from "./LeaveRequestForm";
import SelectEmployeeModal from "../conge/SelectEmployeeModal";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  employee: Employee | null;
  isAdmin?: boolean;
}

const LeaveRequestModal = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  employee,
  isAdmin = false
}: LeaveRequestModalProps) => {
  const [isSelectEmployeeModalOpen, setIsSelectEmployeeModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(employee);

  const handleEmployeeSelect = (selectedEmp: Employee) => {
    setSelectedEmployee(selectedEmp);
    setIsSelectEmployeeModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#F1F0FB]">
        <DialogHeader>
          <DialogTitle className="text-xl">Demande de congé</DialogTitle>
        </DialogHeader>
        
        {(selectedEmployee || (!selectedEmployee && isAdmin)) ? (
          <>
            {!selectedEmployee && isAdmin && (
              <div className="py-4 mb-4 text-center bg-blue-50 rounded-md border border-blue-200">
                <p className="text-blue-800">Vous êtes en mode administrateur.</p>
                <p className="text-blue-600 mt-2">Veuillez sélectionner un employé pour créer une demande de congé.</p>
                <Button 
                  onClick={() => setIsSelectEmployeeModalOpen(true)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sélectionner un employé
                </Button>
              </div>
            )}
            
            {selectedEmployee && (
              <LeaveRequestForm 
                employee={selectedEmployee} 
                onSuccess={onSuccess} 
              />
            )}
          </>
        ) : (
          <div className="py-4 text-center">
            <p className="text-lg mb-4">Vous n'êtes pas encore enregistré comme employé.</p>
            <p className="text-muted-foreground">
              Veuillez contacter l'administrateur pour vous ajouter au système avant de pouvoir demander un congé.
            </p>
          </div>
        )}
      </DialogContent>

      {/* Only show the SelectEmployeeModal if user is admin */}
      {isAdmin && (
        <SelectEmployeeModal
          isOpen={isSelectEmployeeModalOpen}
          onClose={() => setIsSelectEmployeeModalOpen(false)}
          onSelect={handleEmployeeSelect}
        />
      )}
    </Dialog>
  );
};

export default LeaveRequestModal;
