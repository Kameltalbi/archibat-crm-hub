
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clientService } from "@/services/clientService";
import { projectService } from "@/services/projectService";

interface ClientWithRevenue {
  id: string;
  name: string;
  revenue: number;
  projects: number;
}

const TopClients = () => {
  const [clients, setClients] = useState<ClientWithRevenue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientsAndProjects = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer tous les clients
        const allClients = await clientService.getAllClients();
        
        // Récupérer tous les projets
        const allProjects = await projectService.getProjectsWithClients();
        
        // Calculer le nombre de projets par client et le CA (simulé)
        const clientsWithStats = allClients.map(client => {
          const clientProjects = allProjects.filter(p => p.client_id === client.id);
          
          // Calculer le CA (simulé pour l'instant)
          const revenue = clientProjects.length * (Math.floor(Math.random() * 10000) + 5000);
          
          return {
            id: client.id,
            name: client.name,
            revenue,
            projects: clientProjects.length
          };
        });
        
        // Trier par CA et prendre les 5 premiers
        const topClients = clientsWithStats
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        
        setClients(topClients);
      } catch (error) {
        console.error("Erreur lors de la récupération des top clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientsAndProjects();
  }, []);

  return (
    <Card className="animate-fade-in delay-200">
      <CardHeader>
        <CardTitle>Top Clients</CardTitle>
        <CardDescription>Par chiffre d'affaires</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">Chargement des clients...</div>
        ) : clients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">CA</TableHead>
                <TableHead className="text-right">Projets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-right">
                    {client.revenue.toLocaleString()} TND
                  </TableCell>
                  <TableCell className="text-right">{client.projects}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Aucun client à afficher
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopClients;
