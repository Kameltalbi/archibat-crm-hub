
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { leaveService } from "@/services/leaveService";
import AdminDashboard from "@/components/leave/AdminDashboard";
import EmployeeProfile from "@/components/leave/EmployeeProfile";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import LeaveRequestModal from "@/components/leave/LeaveRequestModal";
import { Employee } from "@/services/leaveService";
import { useToast } from "@/hooks/use-toast";

const Leaves = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Vérifier si l'utilisateur est un administrateur
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const permissions = await userService.getRolePermissions();
          
          if (permissions && permissions.admin && permissions.admin.length > 0) {
            const userId = session.user.id;
            const userWithRole = await userService.getUserWithRole(userId);
            
            if (userWithRole && userWithRole.role === "admin") {
              setIsAdmin(true);
            }
          }
          
          // Récupérer l'employé courant
          const employee = await leaveService.getCurrentEmployee();
          setCurrentEmployee(employee);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        setIsLoading(false);
      }
    };
    
    checkAdminRole();
  }, []);
  
  const handleOpenModal = () => {
    if (!currentEmployee) {
      toast({
        title: "Erreur",
        description: "Vous devez être enregistré comme employé pour demander un congé.",
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleLeaveRequestSuccess = () => {
    setIsModalOpen(false);
    toast({
      title: "Demande envoyée",
      description: "Votre demande de congé a été envoyée avec succès.",
    });
  };
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des congés</h1>
        
        {!isAdmin && (
          <Button 
            onClick={handleOpenModal} 
            className="bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-[#1A1F2C]"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Demander un congé
          </Button>
        )}
      </div>
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <EmployeeProfile />
      )}
      
      {currentEmployee && (
        <LeaveRequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleLeaveRequestSuccess}
          employee={currentEmployee}
        />
      )}
    </div>
  );
};

export default Leaves;
