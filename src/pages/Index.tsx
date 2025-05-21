
// Page Congé – ouverture du modal Ajouter Demande de Congé pour l'employé cliqué (par l'admin)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddLeaveModal from "@/components/conge/AddLeaveModal";
import SelectEmployeeModal from "@/components/conge/SelectEmployeeModal";
import { Plus } from "lucide-react";
import { Employee } from "@/services/leaveService";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const CongePage = () => {
  const [conges, setConges] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSelectEmployeeModalOpen, setIsSelectEmployeeModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const permissions = await userService.getRolePermissions();
          
          if (permissions) {
            const userId = session.user.id;
            const userWithRole = await userService.getUserWithRole(userId);
            
            if (userWithRole && userWithRole.role === "admin") {
              setIsAdmin(true);
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
      }
    };
    
    checkAdminRole();
    fetchConges();
  }, []);

  const fetchConges = async () => {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, employee:employees(name, id, email, leave_balance)");

    if (error) {
      console.error("Erreur de chargement des congés :", error);
    } else {
      setConges(data);
    }
  };

  const handleRowClick = (employee) => {
    // Only allow admin to open leave modal for other employees
    if (isAdmin) {
      setSelectedEmployee(employee);
      setIsLeaveModalOpen(true);
    } else {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent effectuer cette action.",
        variant: "destructive",
      });
    }
  };

  const handleAddLeaveClick = () => {
    // Only allow admin to add leaves for other employees
    if (isAdmin) {
      setIsSelectEmployeeModalOpen(true);
    } else {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent effectuer cette action.",
        variant: "destructive",
      });
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setIsSelectEmployeeModalOpen(false);
    setIsLeaveModalOpen(true);
  };

  const handleLeaveModalClose = () => {
    setIsLeaveModalOpen(false);
    fetchConges(); // Rafraîchir la liste après ajout
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestion des congés</h1>
        {isAdmin && (
          <Button onClick={handleAddLeaveClick}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un congé
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Date début</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conges.map((conge, index) => (
            <TableRow 
              key={index} 
              onClick={() => handleRowClick(conge.employee)} 
              className={isAdmin ? "cursor-pointer hover:bg-muted" : ""}
            >
              <TableCell>{conge.employee?.name}</TableCell>
              <TableCell>{conge.start_date}</TableCell>
              <TableCell>{conge.end_date}</TableCell>
              <TableCell>{conge.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLeaveModalOpen && selectedEmployee && (
        <AddLeaveModal
          isOpen={isLeaveModalOpen}
          onClose={handleLeaveModalClose}
          employee={selectedEmployee}
        />
      )}

      <SelectEmployeeModal
        isOpen={isSelectEmployeeModalOpen}
        onClose={() => setIsSelectEmployeeModalOpen(false)}
        onSelect={handleEmployeeSelect}
      />
    </div>
  );
};

export default CongePage;
