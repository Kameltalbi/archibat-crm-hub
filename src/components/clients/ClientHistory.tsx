
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { HistoryItem, HistoryTimeline } from "../history/HistoryTimeline";

interface ClientHistoryProps {
  client: Client;
}

export const ClientHistory = ({ client }: ClientHistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientHistory = async () => {
      setIsLoading(true);
      try {
        // For now, we'll mock the data until we have a proper API endpoint
        // In a real app, this would fetch from the database
        const mockItems: HistoryItem[] = [
          {
            id: "1",
            type: "modification",
            date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            title: "Mise à jour des coordonnées",
            description: "Adresse email modifiée",
            user: "Ahmed Chaouch"
          },
          {
            id: "2",
            type: "call",
            date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            title: "Appel de suivi",
            description: "Discussion sur les nouveaux projets à venir",
            user: "Sonia Ben Ali"
          },
          {
            id: "3",
            type: "meeting",
            date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            title: "Réunion de présentation",
            description: "Présentation des nouvelles offres de service",
            user: "Karim Mansour"
          }
        ];

        setHistoryItems(mockItems);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique du client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientHistory();
  }, [client.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique</CardTitle>
        <CardDescription>
          Historique des interactions avec ce client
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Chargement de l'historique...
          </div>
        ) : (
          <HistoryTimeline 
            items={historyItems} 
            emptyMessage="Aucun historique disponible pour ce client"
          />
        )}
      </CardContent>
    </Card>
  );
};
