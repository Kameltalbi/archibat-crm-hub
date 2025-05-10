
import { supabase, Client } from "@/lib/supabase";

export const clientService = {
  // Récupérer tous les clients
  async getAllClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      return [];
    }
    
    return data as Client[] || [];
  },
  
  // Récupérer un client par son ID
  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du client ${id}:`, error);
      return null;
    }
    
    return data as Client;
  },
  
  // Créer un nouveau client
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .insert(client)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du client:', error);
      return null;
    }
    
    return data as Client;
  },
  
  // Mettre à jour un client
  async updateClient(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du client ${id}:`, error);
      return null;
    }
    
    return data as Client;
  },
  
  // Supprimer un client
  async deleteClient(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du client ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Calculer le CA d'un client pour l'année en cours
  async getClientYearRevenue(clientId: string): Promise<number> {
    const currentYear = new Date().getFullYear();
    const startDate = `${currentYear}-01-01`;
    const endDate = `${currentYear}-12-31`;
    
    try {
      // Récupérer tous les projets du client pour l'année en cours
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', clientId)
        .gte('start_date', startDate)
        .lte('end_date', endDate);
      
      if (projectsError) {
        console.error('Erreur lors de la récupération des projets du client:', projectsError);
        return 0;
      }
      
      if (!projects || projects.length === 0) {
        return 0;
      }
      
      // Récupérer tous les produits associés aux projets
      const projectIds = projects.map(project => project.id);
      const { data: projectProducts, error: productsError } = await supabase
        .from('project_products')
        .select('price_at_time, quantity')
        .in('project_id', projectIds);
      
      if (productsError) {
        console.error('Erreur lors de la récupération des produits des projets:', productsError);
        return 0;
      }
      
      // Calculer le CA total
      const totalRevenue = projectProducts
        ? projectProducts.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0)
        : 0;
      
      return totalRevenue;
    } catch (error) {
      console.error('Erreur lors du calcul du CA du client:', error);
      return 0;
    }
  }
};
