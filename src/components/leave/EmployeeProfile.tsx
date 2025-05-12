
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { leaveService, Employee } from "@/services/leaveService";
import LeaveRequestForm from "./LeaveRequestForm";
import LeaveRequestsList from "./LeaveRequestsList";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadEmployeeData = async () => {
    setIsLoading(true);
    const data = await leaveService.getCurrentEmployee();
    setEmployee(data);
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadEmployeeData();
  }, []);
  
  if (isLoading) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }
  
  if (!employee) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">Profil non trouvé</h3>
            <p className="text-muted-foreground mt-2">
              Vous n'êtes pas encore enregistré en tant qu'employé. Veuillez contacter l'administrateur.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mon profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
              <p className="text-lg">{employee.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-lg">{employee.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Solde de congés</h3>
              <p className="text-lg font-bold">{employee.leave_balance} jours</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <LeaveRequestForm employee={employee} onSuccess={loadEmployeeData} />
      
      <LeaveRequestsList employeeId={employee.id} />
    </div>
  );
};

export default EmployeeProfile;
