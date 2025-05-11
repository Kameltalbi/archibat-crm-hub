
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddProductModal, { Category } from "./AddProductModal";
import AddCategoryModal from "./AddCategoryModal";
import { Separator } from "@/components/ui/separator";

interface ProductsHeaderProps {
  categories: Category[];
  onSaveProduct: (product: any) => void;
}

const ProductsHeader = ({ categories, onSaveProduct }: ProductsHeaderProps) => {
  const handleProductSave = (product: any) => {
    console.log("ProductsHeader: Données du produit reçues pour enregistrement:", product);
    if (!product.category_id) {
      console.error("Erreur: La catégorie du produit est manquante");
      return;
    }
    onSaveProduct(product);
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Produits et Services</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <AddCategoryModal />
          <AddProductModal 
            categories={categories} 
            onSave={handleProductSave} 
          />
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default ProductsHeader;
