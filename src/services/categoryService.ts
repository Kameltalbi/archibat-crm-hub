
import { supabase, Category } from "@/lib/supabase";

export const categoryService = {
  // Récupérer toutes les catégories
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return [];
    }
    
    return data || [];
  },
  
  // Récupérer une catégorie par son ID
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Créer une nouvelle catégorie
  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      return null;
    }
    
    return data;
  },
  
  // Mettre à jour une catégorie
  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de la catégorie ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Supprimer une catégorie
  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de la catégorie ${id}:`, error);
      return false;
    }
    
    return true;
  }
};
