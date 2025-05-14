
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Product, SelectedProduct } from "./types";
import SelectedProducts from "./SelectedProducts";
import ProductSelector from "./ProductSelector";
import { filterAvailableProducts, mapCategoryNames } from "./utils";

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
    
    // Utiliser le mappage de catégories pour améliorer la correspondance
    const relatedCategories = mapCategoryNames(projectCategory);
    console.log(`Total available products: ${availableProducts.length}`, availableProducts);
    console.log(`Project category: ${projectCategory}`);
    console.log(`Related categories: ${relatedCategories.join(", ")}`);
    
    // Set filtered products
    setFilteredProducts(availableProducts);
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
      />
    </div>
  );
};

export default MultiProductSelectContainer;
