
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { leaveService, LeaveRequest } from "@/services/leaveService";
import { supabase } from "@/lib/supabase";

interface LeaveRequestsListProps {
  employeeId?: string;
  isAdmin?: boolean;
}

const LeaveRequestsList = ({ employeeId, isAdmin = false }: LeaveRequestsListProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRequests = async () => {
    setIsLoading(true);
    let data;
    
    if (isAdmin) {
      data = await leaveService.getAllLeaveRequests();
    } else if (employeeId) {
      data = await leaveService.getLeaveRequestsByEmployeeId(employeeId);
    } else {
      data = [];
    }
    
    setRequests(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [employeeId, isAdmin]);

  const handleStatusChange = async (requestId: string, status: "approved" | "rejected", employeeEmail: string, employeeName: string, startDate: string, endDate: string, daysRequested: number) => {
    const success = await leaveService.updateLeaveRequestStatus(requestId, status);
    
    if (success) {
      // Notification à l'employé
      try {
        await supabase.functions.invoke("notify-leave-request", {
          body: {
            type: "status_change",
            employeeName,
            employeeEmail,
            startDate,
            endDate,
            daysRequested,
            status,
          },
        });
      } catch (notifyError) {
        console.error("Erreur lors de l'envoi de la notification:", notifyError);
      }
      
      toast({
        title: "Statut mis à jour",
        description: `La demande a été ${status === "approved" ? "approuvée" : "rejetée"} avec succès.`,
      });
      
      loadRequests();
    } else {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Approuvée</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejetée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isAdmin ? "Toutes les demandes de congé" : "Mes demandes de congé"}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">Chargement...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Employé</TableHead>}
                {isAdmin && <TableHead>Email</TableHead>}
                <TableHead>Date de début</TableHead>
                <TableHead>Date de fin</TableHead>
                <TableHead>Jours</TableHead>
                <TableHead>Statut</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length > 0 ? (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    {isAdmin && <TableCell className="font-medium">{request.employees?.name}</TableCell>}
                    {isAdmin && <TableCell>{request.employees?.email}</TableCell>}
                    <TableCell>
                      {format(parseISO(request.start_date), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>
                      {format(parseISO(request.end_date), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>{request.days_requested}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    {isAdmin && request.status === "pending" && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={() => handleStatusChange(
                              request.id, 
                              "approved",
                              request.employees?.email,
                              request.employees?.name,
                              request.start_date,
                              request.end_date,
                              request.days_requested
                            )}
                          >
                            Approuver
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-red-50 text-red-700 hover:bg-red-100"
                            onClick={() => handleStatusChange(
                              request.id, 
                              "rejected",
                              request.employees?.email,
                              request.employees?.name,
                              request.start_date,
                              request.end_date,
                              request.days_requested
                            )}
                          >
                            Rejeter
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    {isAdmin && request.status !== "pending" && <TableCell>-</TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 7 : 5} className="text-center py-4">
                    Aucune demande de congé trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaveRequestsList;
