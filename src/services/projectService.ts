
import { supabase, Project } from "@/lib/supabase";

export const projectService = {
  // Récupérer tous les projets
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Récupérer les projets avec les informations du client
  async getProjectsWithClients(): Promise<any[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        clients:client_id (id, name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets avec clients:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Récupérer un projet par son ID
  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du projet ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Récupérer un projet détaillé avec le client et les produits associés
  async getDetailedProject(id: string): Promise<any | null> {
    // Récupérer le projet avec le client
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        clients:client_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (projectError) {
      console.error(`Erreur lors de la récupération du projet détaillé ${id}:`, projectError);
      return null;
    }
    
    // Récupérer les produits associés au projet
    const { data: projectProducts, error: productsError } = await supabase
      .from('project_products')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('project_id', id);
    
    if (productsError) {
      console.error(`Erreur lors de la récupération des produits du projet ${id}:`, productsError);
      return project; // Retourne le projet sans les produits en cas d'erreur
    }
    
    // Combiner les données
    return {
      ...project,
      project_products: projectProducts || []
    };
  },
  
  // Créer un nouveau projet
  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du projet:', error);
      return null;
    }
    
    return data;
  },
  
  // Mettre à jour un projet
  async updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du projet ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Supprimer un projet
  async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du projet ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Ajouter un produit à un projet
  async addProductToProject(projectProduct: Omit<any, 'id' | 'created_at'>): Promise<any | null> {
    const { data, error } = await supabase
      .from('project_products')
      .insert(projectProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout du produit au projet:', error);
      return null;
    }
    
    return data;
  }
};
