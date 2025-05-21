
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
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Vérifier si l'utilisateur est un administrateur
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const permissions = await userService.getRolePermissions();
          
          if (permissions) {
            // Vérifier si l'utilisateur a la permission d'accéder au module congé
            const userId = session.user.id;
            const userWithRole = await userService.getUserWithRole(userId);
            
            if (userWithRole && userWithRole.role) {
              // Vérifier si l'utilisateur a accès au module congé basé sur son rôle
              if (permissions[userWithRole.role] && 
                  permissions[userWithRole.role].includes('leaves')) {
                setHasPermission(true);
                
                // Vérifier si l'utilisateur est admin
                if (userWithRole.role === "admin") {
                  setIsAdmin(true);
                }
              } else {
                // Rediriger ou afficher un message d'erreur si l'utilisateur n'a pas la permission
                toast({
                  title: "Accès refusé",
                  description: "Vous n'avez pas la permission d'accéder à cette page.",
                  variant: "destructive",
                });
              }
            }
          }
          
          // Récupérer l'employé courant
          try {
            const employee = await leaveService.getCurrentEmployee();
            setCurrentEmployee(employee);
          } catch (error) {
            console.error("Erreur lors de la récupération de l'employé:", error);
            // Ne pas bloquer l'affichage si l'employé n'est pas trouvé
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la vérification du rôle:", error);
        setIsLoading(false);
      }
    };
    
    checkAdminRole();
  }, [toast]);
  
  const handleOpenModal = () => {
    // Les administrateurs peuvent toujours ouvrir le modal, même sans être un employé
    if (!currentEmployee && !isAdmin) {
      toast({
        title: "Information",
        description: "Vous n'êtes pas encore enregistré comme employé. Veuillez contacter l'administrateur pour vous ajouter au système.",
      });
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
  
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
        <p className="text-muted-foreground">Vous n'avez pas la permission d'accéder à cette page.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des congés</h1>
        
        {/* Bouton "Demander un congé" disponible pour tous les utilisateurs */}
        <Button 
          onClick={handleOpenModal} 
          className="bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-[#1A1F2C]"
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Demander un congé
        </Button>
      </div>
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <EmployeeProfile />
      )}
      
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleLeaveRequestSuccess}
        employee={currentEmployee}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default Leaves;
