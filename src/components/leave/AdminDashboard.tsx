
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import EmployeesList from "./EmployeesList";
import LeaveRequestsList from "./LeaveRequestsList";

const AdminDashboard = () => {
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Administration des congés</h2>
          <p className="text-muted-foreground">
            Gérez les employés, les demandes de congés et les paramètres
          </p>
        </div>
        
        <Dialog open={isAddEmployeeDialogOpen} onOpenChange={setIsAddEmployeeDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un employé
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <EmployeeForm onSuccess={() => setIsAddEmployeeDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="employees">Employés</TabsTrigger>
          <TabsTrigger value="leave-requests">Demandes de congés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="mt-6">
          <EmployeesList />
        </TabsContent>
        
        <TabsContent value="leave-requests" className="mt-6">
          <LeaveRequestsList isAdmin={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
