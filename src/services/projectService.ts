
import { supabase, Project, ProjectStatus, ProjectProduct } from "@/lib/supabase";

export const projectService = {
  // Récupérer tous les projets
  async getAllProjects(includeArchived: boolean = false): Promise<Project[]> {
    let query = supabase
      .from('projects')
      .select('*')
      
    // Si includeArchived est false, filtrer pour n'obtenir que les projets non archivés
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      return [];
    }
    
    return data as Project[] || [];
  },
  
  // Récupérer les projets avec les informations du client
  async getProjectsWithClients(includeArchived: boolean = false): Promise<any[]> {
    let query = supabase
      .from('projects')
      .select(`
        *,
        clients:client_id (id, name)
      `)
    
    // Si includeArchived est false, filtrer pour n'obtenir que les projets non archivés
    if (!includeArchived) {
      query = query.eq('is_archived', false);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
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
    
    return data as Project;
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
      .insert({
        ...project,
        is_archived: false // Assurer que les nouveaux projets ne sont pas archivés
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du projet:', error);
      return null;
    }
    
    return data as Project;
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
    
    return data as Project;
  },
  
  // Archiver un projet
  async archiveProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .update({ is_archived: true })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de l'archivage du projet ${id}:`, error);
      return false;
    }
    
    return true;
  },
  
  // Désarchiver un projet
  async unarchiveProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .update({ is_archived: false })
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la désarchivation du projet ${id}:`, error);
      return false;
    }
    
    return true;
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
  async addProductToProject(projectProduct: Omit<ProjectProduct, 'id' | 'created_at'>): Promise<ProjectProduct | null> {
    const { data, error } = await supabase
      .from('project_products')
      .insert(projectProduct)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout du produit au projet:', error);
      return null;
    }
    
    return data as ProjectProduct;
  },

  // Récupérer tous les projets archivés
  async getArchivedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_archived', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets archivés:', error);
      return [];
    }
    
    return data as Project[] || [];
  }
};
