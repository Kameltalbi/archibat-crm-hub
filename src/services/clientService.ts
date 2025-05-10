
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
    
    return data || [];
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
    
    return data;
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
    
    return data;
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
    
    return data;
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
  }
};
