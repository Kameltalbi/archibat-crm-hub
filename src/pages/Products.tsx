
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import ProductsHeader from "@/components/products/ProductsHeader";
import ProductSearchBar from "@/components/products/ProductSearchBar";
import ProductsTable from "@/components/products/ProductsTable";

const Products = () => {
  const { 
    products, 
    categories, 
    isLoading, 
    handleDeleteProduct, 
    handleSaveProduct, 
    fetchProducts 
  } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-8">
      <ProductsHeader 
        categories={categories} 
        onSaveProduct={handleSaveProduct} 
      />
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Catalogue</CardTitle>
          <CardDescription>
            {filteredProducts.length} produits et services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <ProductSearchBar onSearch={setSearchTerm} />
          </div>
          
          <ProductsTable 
            products={products}
            filteredProducts={filteredProducts}
            isLoading={isLoading}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProduct={fetchProducts}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
