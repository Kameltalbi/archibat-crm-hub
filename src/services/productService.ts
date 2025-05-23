
import { supabase, Product } from "@/lib/supabase";

export const productService = {
  // Récupérer tous les produits
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return [];
    }
    
    console.log(`Nombre total de produits dans la base: ${data?.length || 0}`);
    return data || [];
  },
  
  // Récupérer tous les produits avec leurs catégories
  async getProductsWithCategories(): Promise<any[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (id, name)
      `)
      .order('name');
    
    if (error) {
      console.error('Erreur lors de la récupération des produits avec catégories:', error);
      return [];
    }
    
    console.log(`Nombre total de produits avec catégories: ${data?.length || 0}`);
    console.log('Catégories disponibles:', [...new Set(data?.map(p => p.categories?.name).filter(Boolean))]);
    return data || [];
  },
  
  // Récupérer un produit par son ID
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du produit ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Récupérer les produits par catégorie
  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');
    
    if (error) {
      console.error(`Erreur lors de la récupération des produits de la catégorie ${categoryId}:`, error);
      return [];
    }
    
    return data || [];
  },
  
  // Récupérer les produits par nom de catégorie
  async getProductsByCategoryName(categoryName: string): Promise<any[]> {
    console.log(`Recherche des produits pour la catégorie "${categoryName}"...`);
    
    // D'abord obtenir l'ID de la catégorie par son nom
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', categoryName)
      .single();
    
    if (categoryError || !categoryData) {
      console.error(`Erreur lors de la récupération de la catégorie ${categoryName}:`, categoryError);
      return [];
    }
    
    console.log(`Catégorie "${categoryName}" trouvée avec l'ID: ${categoryData.id}`);
    
    // Récupérer TOUS les produits pour afficher leurs noms quoi qu'il arrive
    const { data: allProducts, error: allProductsError } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (id, name)
      `)
      .order('name');
    
    if (allProductsError) {
      console.error('Erreur lors de la récupération de tous les produits:', allProductsError);
      return [];
    }
    
    console.log(`Nombre total de produits dans la base: ${allProducts?.length || 0}`);

    // Récupérer spécifiquement les produits de la catégorie
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (id, name)
      `)
      .eq('category_id', categoryData.id)
      .order('name');
    
    if (productsError) {
      console.error(`Erreur lors de la récupération des produits de la catégorie ${categoryName}:`, productsError);
      return allProducts || []; // Retourner tous les produits en cas d'erreur
    }
    
    console.log(`Nombre de produits trouvés pour la catégorie "${categoryName}": ${products?.length || 0}`);
    console.log('Produits pour la catégorie exacte:', products);
    
    // Si aucun produit n'est trouvé pour cette catégorie, retourner tous les produits
    if (!products || products.length === 0) {
      console.log(`Aucun produit trouvé pour la catégorie "${categoryName}", retour de tous les produits`);
      return allProducts || [];
    }
    
    return products;
  },
  
  // Créer un nouveau produit
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    console.log("Création du produit avec les données:", product);
    
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du produit:', error);
      return null;
    }
    
    console.log("Produit créé avec succès:", data);
    return data;
  },
  
  // Mettre à jour un produit
  async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du produit ${id}:`, error);
      return null;
    }
    
    return data;
  },
  
  // Supprimer un produit
  async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du produit ${id}:`, error);
      return false;
    }
    
    return true;
  }
};
