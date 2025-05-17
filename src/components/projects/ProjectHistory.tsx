
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { HistoryItem, HistoryTimeline } from "../history/HistoryTimeline";

interface ProjectHistoryProps {
  projectId: string;
  projectName: string;
}

export const ProjectHistory = ({ projectId, projectName }: ProjectHistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectHistory = async () => {
      setIsLoading(true);
      try {
        // Mock data for now, in a real app this would come from the API
        const mockItems: HistoryItem[] = [
          {
            id: "1",
            type: "modification",
            date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            title: "Changement de statut",
            description: "Statut passé de 'Planifié' à 'En cours'",
            user: "Ahmed Chaouch"
          },
          {
            id: "2",
            type: "document",
            date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            title: "Ajout de contrat",
            description: "Contrat de prestation ajouté",
            user: "Karim Mansour"
          },
          {
            id: "3",
            type: "meeting",
            date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
            title: "Réunion de lancement",
            description: "Définition des objectifs et du planning",
            user: "Sonia Ben Ali"
          },
          {
            id: "4",
            type: "note",
            date: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
            title: "Note d'information",
            description: "Le client souhaite ajouter une fonctionnalité supplémentaire",
            user: "Ahmed Chaouch"
          }
        ];

        setHistoryItems(mockItems);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique du projet:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProjectHistory();
    }
  }, [projectId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique</CardTitle>
        <CardDescription>
          Historique des actions pour le projet {projectName}
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
            emptyMessage="Aucun historique disponible pour ce projet"
          />
        )}
      </CardContent>
    </Card>
  );
};
