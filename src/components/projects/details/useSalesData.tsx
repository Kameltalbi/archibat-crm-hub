
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Sale, ProjectSale, Project } from "./types";

export const useSalesData = (project: Project, isOpen: boolean) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);

  // Fetch sales data from Supabase when the project is opened
  useEffect(() => {
    if (isOpen && project) {
      fetchSalesData();
    }
  }, [isOpen, project]);

  const fetchSalesData = async () => {
    setIsLoading(true);
    try {
      // Use the correct project_id format
      const { data, error } = await supabase
        .from('project_sales')
        .select('*')
        .eq('project_id', String(project.id));
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Properly cast the data to our ProjectSale interface
        const formattedSales: Sale[] = (data as ProjectSale[]).map(sale => ({
          id: sale.id,
          label: sale.label,
          date: new Date(sale.date).toLocaleDateString('fr-FR'),
          amount: sale.amount,
          category: sale.category,
          client: sale.client_name || project.client || '',
          product: sale.product_name || undefined
        }));
        
        setSales(formattedSales);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données de ventes pour ce projet."
      });
      setSales([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sales,
    isLoading,
    totalRevenue
  };
};
