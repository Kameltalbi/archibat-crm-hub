
import { useEffect, useState } from "react";
import { leaveService, LeaveRequest } from "@/services/leaveService";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { MonthSelector } from "../sales-forecast/MonthSelector";

interface LeaveRequestsListProps {
  isAdmin?: boolean;
  employeeId?: string;
}

const LeaveRequestsList = ({ isAdmin = false, employeeId }: LeaveRequestsListProps) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      
      let requests: LeaveRequest[];
      
      // Si c'est un admin, récupérer toutes les demandes
      // Sinon, récupérer seulement les demandes de l'employé
      if (isAdmin) {
        requests = await leaveService.getAllLeaveRequests();
      } else if (employeeId) {
        requests = await leaveService.getLeaveRequestsByEmployeeId(employeeId);
      } else {
        const currentEmployee = await leaveService.getCurrentEmployee();
        if (currentEmployee) {
          requests = await leaveService.getLeaveRequestsByEmployeeId(currentEmployee.id);
        } else {
          requests = [];
        }
      }
      
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes de congé:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les demandes de congé.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeaveRequests();
  }, [isAdmin, employeeId]);
  
  const handleStatusChange = async (leaveRequestId: string, newStatus: "approved" | "rejected") => {
    try {
      const success = await leaveService.updateLeaveRequestStatus(leaveRequestId, newStatus);
      
      if (success) {
        // Mettre à jour la liste locale
        setLeaveRequests(prev => 
          prev.map(req => 
            req.id === leaveRequestId ? { ...req, status: newStatus } : req
          )
        );
        
        // Envoyer une notification à l'employé
        const request = leaveRequests.find(req => req.id === leaveRequestId);
        
        if (request && request.employees) {
          try {
            await supabase.functions.invoke("notify-leave-request", {
              body: {
                type: newStatus,
                employeeName: request.employees.name,
                employeeEmail: request.employees.email,
                startDate: request.start_date,
                endDate: request.end_date,
                daysRequested: request.days_requested,
              },
            });
          } catch (notifyError) {
            console.error("Erreur lors de l'envoi de la notification:", notifyError);
          }
        }
        
        toast({
          title: "Statut mis à jour",
          description: `La demande a été ${newStatus === 'approved' ? 'approuvée' : 'refusée'} avec succès.`,
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le statut de la demande.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="outline" className="bg-green-100 border-green-600 text-green-800">Approuvée</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 border-red-600 text-red-800">Refusée</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 border-yellow-600 text-yellow-800">En attente</Badge>;
    }
  };
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: fr });
    } catch (e) {
      return dateStr;
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Chargement des demandes...</div>;
  }
  
  if (leaveRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucune demande de congé</CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Aucune demande de congé n'a été soumise pour le moment." 
              : "Vous n'avez pas encore soumis de demandes de congé."
            }
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isAdmin ? "Toutes les demandes de congé" : "Vos demandes de congé"}
        </CardTitle>
        <CardDescription>
          {isAdmin
            ? "Gérez toutes les demandes de congé des employés."
            : "Historique de vos demandes de congé."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead>Employé</TableHead>}
              <TableHead>Début</TableHead>
              <TableHead>Fin</TableHead>
              <TableHead>Jours</TableHead>
              <TableHead>Statut</TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.map((request) => (
              <TableRow key={request.id}>
                {isAdmin && (
                  <TableCell>
                    {request.employees ? request.employees.name : "Employé inconnu"}
                  </TableCell>
                )}
                <TableCell>{formatDate(request.start_date)}</TableCell>
                <TableCell>{formatDate(request.end_date)}</TableCell>
                <TableCell>{request.days_requested}</TableCell>
                <TableCell>{getStatusBadge(request.status)}</TableCell>
                {isAdmin && request.status === "pending" && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="bg-green-50 hover:bg-green-100 border-green-300"
                        onClick={() => handleStatusChange(request.id, "approved")}
                      >
                        Approuver
                      </Button>
                      <Button 
                        variant="outline" 
                        className="bg-red-50 hover:bg-red-100 border-red-300"
                        onClick={() => handleStatusChange(request.id, "rejected")}
                      >
                        Refuser
                      </Button>
                    </div>
                  </TableCell>
                )}
                {isAdmin && request.status !== "pending" && (
                  <TableCell>
                    <span className="text-muted-foreground italic">Traité</span>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsList;
