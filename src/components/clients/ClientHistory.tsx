
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { HistoryItem, HistoryTimeline } from "../history/HistoryTimeline";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddHistoryItemModal, AddHistoryItemFormData } from "../history/AddHistoryItemModal";

interface ClientHistoryProps {
  client: Client;
}

export const ClientHistory = ({ client }: ClientHistoryProps) => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClientHistory = async () => {
      setIsLoading(true);
      try {
        // Pour l'instant, nous utilisons des données fictives
        // Dans une application réelle, cela récupérerait les données depuis la base de données
        const mockItems: HistoryItem[] = [
          {
            id: "1",
            type: "modification",
            date: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
            title: "Mise à jour des coordonnées",
            description: "Adresse email modifiée",
            user: "Ahmed Chaouch"
          },
          {
            id: "2",
            type: "call",
            date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 jours avant
            title: "Appel de suivi",
            description: "Discussion sur les nouveaux projets à venir",
            user: "Sonia Ben Ali"
          },
          {
            id: "3",
            type: "meeting",
            date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 jours avant
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

  // Fonction pour gérer l'ajout d'un nouvel élément d'historique
  const handleAddHistoryItem = async (formData: AddHistoryItemFormData) => {
    // Dans une application réelle, vous enregistreriez cet élément dans la base de données
    // Pour l'instant, nous l'ajoutons simplement à l'état local
    const newItem: HistoryItem = {
      id: `temp-${Date.now()}`, // ID temporaire jusqu'à l'implémentation de la base de données
      type: formData.type,
      date: new Date().toISOString(),
      title: formData.title,
      description: formData.description,
      user: "Utilisateur actuel" // Dans une vraie application, cela viendrait de l'utilisateur connecté
    };

    // Ajouter le nouvel élément au début de l'historique
    setHistoryItems([newItem, ...historyItems]);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Historique</CardTitle>
          <CardDescription>
            Historique des interactions avec ce client
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
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

      <AddHistoryItemModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddHistoryItem}
        entityType="client"
      />
    </Card>
  );
};
