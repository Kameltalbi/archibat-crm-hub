
import { useState, useEffect } from "react";
import { Client } from "@/lib/supabase";
import { clientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";

export const useClientDetails = (id: string | undefined) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [yearRevenue, setYearRevenue] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Récupérer les détails du client
        const clientData = await clientService.getClientById(id);
        setClient(clientData);
        
        // Récupérer le CA de l'année en cours
        const revenue = await clientService.getClientYearRevenue(id);
        setYearRevenue(revenue);
      } catch (error) {
        console.error("Erreur lors du chargement des détails du client:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du client."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [id, toast]);

  return { client, isLoading, yearRevenue };
};
