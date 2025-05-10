
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/supabase";
import { productService } from "@/services/productService";

export interface ProductWithCategory extends Product {
  category_name: string;
}

export interface Category {
  id: string;
  name: string;
}

export function useProducts() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');

      if (error) {
        throw error;
      }

      const formattedCategories: Category[] = data.map(cat => ({
        id: cat.id,
        name: cat.name
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories. Veuillez réessayer."
      });
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `);
        
      if (productsError) {
        throw productsError;
      }
      
      const formattedProducts: ProductWithCategory[] = productsData.map(product => {
        return {
          ...product,
          category_name: product.categories ? product.categories.name : 'Non catégorisé'
        };
      });
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit. Veuillez réessayer."
      });
    }
  };
  
  const handleSaveProduct = async (productData: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id
        }])
        .select(`
          *,
          categories(name)
        `);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newProduct: ProductWithCategory = {
          ...data[0],
          category_name: data[0].categories ? data[0].categories.name : 'Non catégorisé'
        };
        
        setProducts([...products, newProduct]);
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté avec succès."
        });
        
        // Rafraîchir la liste pour avoir les données complètes
        fetchProducts();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Veuillez réessayer."
      });
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  return {
    products,
    categories,
    isLoading,
    fetchProducts,
    handleDeleteProduct,
    handleSaveProduct
  };
}
