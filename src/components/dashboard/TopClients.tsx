
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

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
        const { data: allClients, error: clientsError } = await supabase
          .from('clients')
          .select('id, name');
          
        if (clientsError) throw clientsError;
        
        // Récupérer tous les projets avec leur client associé et objectif de CA
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, client_id, target_revenue');
          
        if (projectsError) throw projectsError;
        
        // Créer un mapping des clients avec leur CA et nombre de projets
        const clientMap = new Map();
        
        // Initialiser chaque client avec un CA de 0 et 0 projets
        for (const client of allClients) {
          // Éliminer les doublons par nom (car il y a des clients dupliqués)
          if (!clientMap.has(client.name)) {
            clientMap.set(client.name, {
              id: client.id,
              name: client.name,
              revenue: 0,
              projects: 0
            });
          }
        }
        
        // Calculer le CA pour chaque client
        for (const project of projectsData) {
          if (project.client_id) {
            const client = allClients.find(c => c.id === project.client_id);
            if (client) {
              const clientData = clientMap.get(client.name);
              if (clientData) {
                clientData.revenue += project.target_revenue || 0;
                clientData.projects += 1;
                clientMap.set(client.name, clientData);
              }
            }
          }
        }
        
        // Convertir la Map en tableau et trier par CA
        const clientsArray = Array.from(clientMap.values());
        const topClients = clientsArray
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
                  <TableCell className="font-medium">
                    <Link to={`/clients/${client.id}`} className="hover:underline text-blue-600">
                      {client.name}
                    </Link>
                  </TableCell>
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
