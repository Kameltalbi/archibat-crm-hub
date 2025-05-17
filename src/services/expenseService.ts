
import { supabase } from "@/lib/supabase";

export interface ExpenseCategory {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseSubcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  date: string;
  category_id: string | null;
  subcategory_id: string | null;
  is_recurring: boolean;
  recurring_frequency: string | null;
  recurring_end_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  subcategory_name?: string;
}

export const expenseService = {
  // Récupérer toutes les catégories de dépenses
  async getAllCategories(): Promise<ExpenseCategory[]> {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des catégories de dépenses:', error);
      throw error;
    }
    
    return data || [];
  },

  // Créer une nouvelle catégorie de dépense
  async createExpenseCategory(category: { name: string; description: string | null }): Promise<any> {
    return await supabase
      .from('expense_categories')
      .insert(category)
      .select();
  },

  // Mettre à jour une catégorie de dépense
  async updateExpenseCategory(id: string, updates: { name: string; description: string | null }): Promise<any> {
    return await supabase
      .from('expense_categories')
      .update(updates)
      .eq('id', id)
      .select();
  },

  // Supprimer une catégorie de dépense
  async deleteExpenseCategory(id: string): Promise<any> {
    return await supabase
      .from('expense_categories')
      .delete()
      .eq('id', id);
  },

  // Récupérer toutes les sous-catégories pour une catégorie donnée
  async getSubcategoriesByCategory(categoryId: string): Promise<ExpenseSubcategory[]> {
    const { data, error } = await supabase
      .from('expense_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des sous-catégories:', error);
      throw error;
    }
    
    return data || [];
  },

  // Créer une nouvelle sous-catégorie
  async createExpenseSubcategory(subcategory: { 
    name: string; 
    description: string | null; 
    category_id: string 
  }): Promise<any> {
    return await supabase
      .from('expense_subcategories')
      .insert(subcategory)
      .select();
  },

  // Supprimer une sous-catégorie
  async deleteExpenseSubcategory(id: string): Promise<any> {
    return await supabase
      .from('expense_subcategories')
      .delete()
      .eq('id', id);
  },

  // Créer une nouvelle dépense
  async createExpense(expense: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la dépense:', error);
      throw error;
    }
    
    return data;
  },

  // Récupérer toutes les dépenses avec les noms des catégories et sous-catégories
  async getAllExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_categories(name),
        expense_subcategories(name)
      `)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des dépenses:', error);
      throw error;
    }
    
    // Transformer les données pour avoir un format plus facile à utiliser
    return (data || []).map(item => ({
      ...item,
      category_name: item.expense_categories?.name,
      subcategory_name: item.expense_subcategories?.name
    }));
  },

  // Récupérer les dépenses pour une période donnée (pour le plan de trésorerie)
  async getExpensesByPeriod(startDate: string, endDate: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_categories(name),
        expense_subcategories(name)
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');
    
    if (error) {
      console.error('Erreur lors de la récupération des dépenses par période:', error);
      throw error;
    }
    
    // Transformer les données pour avoir un format plus facile à utiliser
    return (data || []).map(item => ({
      ...item,
      category_name: item.expense_categories?.name,
      subcategory_name: item.expense_subcategories?.name
    }));
  },

  // Nouvelles méthodes pour les KPI du dashboard
  
  // Obtenir le total des dépenses pour le mois en cours
  async getCurrentMonthExpenses(): Promise<number> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('date', firstDayOfMonth)
      .lte('date', lastDayOfMonth);
    
    if (error) {
      console.error('Erreur lors de la récupération des dépenses du mois:', error);
      throw error;
    }
    
    return (data || []).reduce((sum, expense) => sum + expense.amount, 0);
  },
  
  // Obtenir le total des dépenses pour le mois précédent
  async getPreviousMonthExpenses(): Promise<number> {
    const today = new Date();
    const firstDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('expenses')
      .select('amount')
      .gte('date', firstDayOfPrevMonth)
      .lte('date', lastDayOfPrevMonth);
    
    if (error) {
      console.error('Erreur lors de la récupération des dépenses du mois précédent:', error);
      throw error;
    }
    
    return (data || []).reduce((sum, expense) => sum + expense.amount, 0);
  }
};
