
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Product, SelectedProduct } from "./types";
import SelectedProducts from "./SelectedProducts";
import ProductSelector from "./ProductSelector";
import { filterAvailableProducts, filterProductsByProjectCategory, mapCategoryNames } from "./utils";
import { toast } from "@/components/ui/use-toast";

interface MultiProductSelectContainerProps {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onChange: (selectedProducts: SelectedProduct[]) => void;
  projectCategory?: string;
}

const MultiProductSelectContainer = ({
  products,
  selectedProducts,
  onChange,
  projectCategory
}: MultiProductSelectContainerProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filter products based on project category and selected products
  useEffect(() => {
    // Filter out already selected products
    const selectedProductIds = selectedProducts.map(p => p.id);
    let availableProducts = filterAvailableProducts(products, selectedProductIds);
    
    // Strict filtering by project category
    if (projectCategory) {
      // First try exact match
      const exactMatchProducts = filterProductsByProjectCategory(availableProducts, projectCategory);
      
      if (exactMatchProducts.length > 0) {
        setFilteredProducts(exactMatchProducts);
        console.log(`Filtered ${exactMatchProducts.length} products with exact match on category: ${projectCategory}`);
        return;
      }
      
      // If no exact matches, try with category mapping
      const relatedCategories = mapCategoryNames(projectCategory);
      const categoryFilteredProducts = availableProducts.filter(product => {
        const productCategory = product.category || product.categories?.name || null;
        return productCategory && relatedCategories.includes(productCategory);
      });
      
      if (categoryFilteredProducts.length > 0) {
        setFilteredProducts(categoryFilteredProducts);
        console.log(`Filtered ${categoryFilteredProducts.length} products with related categories: ${relatedCategories.join(', ')}`);
        return;
      }
      
      // If still no matches, show a toast notification and display all products
      toast({
        title: "Aucun produit correspondant",
        description: `Aucun produit ne correspond à la catégorie "${projectCategory}". Tous les produits sont affichés.`,
        variant: "default"
      });
    }
    
    // If no project category or no matches found, show all available products
    setFilteredProducts(availableProducts);
    console.log(`Affichage de tous les produits disponibles (${availableProducts.length})`);
  }, [products, selectedProducts, projectCategory]);
  
  const handleSelectProduct = (product: Product) => {
    onChange([...selectedProducts, { 
      id: product.id, 
      name: product.name, 
      price: product.price,
      quantity: 1
    }]);
  };
  
  const handleRemoveProduct = (productId: string) => {
    onChange(selectedProducts.filter(p => p.id !== productId));
  };
  
  const handleQuantityChange = (productId: string, quantity: number) => {
    onChange(selectedProducts.map(p => 
      p.id === productId 
        ? { ...p, quantity: Math.max(1, quantity) } 
        : p
    ));
  };
  
  return (
    <div className="space-y-4">
      <Label>Produits *</Label>
      
      {/* Selected Products */}
      <div className="space-y-2">
        <SelectedProducts 
          selectedProducts={selectedProducts}
          onQuantityChange={handleQuantityChange}
          onRemoveProduct={handleRemoveProduct}
        />
      </div>
      
      {/* Product Selector */}
      <ProductSelector 
        products={filteredProducts}
        selectedProductIds={selectedProducts.map(p => p.id)}
        onSelectProduct={handleSelectProduct}
        projectCategory={projectCategory}
      />
    </div>
  );
};

export default MultiProductSelectContainer;
