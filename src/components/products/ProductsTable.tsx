
import { ProductWithCategory } from "@/hooks/useProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import EditProductModal from "./EditProductModal";

interface ProductsTableProps {
  products: ProductWithCategory[];
  filteredProducts: ProductWithCategory[];
  isLoading: boolean;
  onDeleteProduct: (id: string) => void;
  onUpdateProduct: () => void;
  categories: { id: string; name: string }[];
}

const ProductsTable = ({ 
  products, 
  filteredProducts, 
  isLoading, 
  onDeleteProduct, 
  onUpdateProduct,
  categories 
}: ProductsTableProps) => {
  // Couleurs pour les catégories
  const getCategoryColor = (categoryName: string) => {
    const colors = {
      "Études": "bg-terracotta text-white",
      "Travaux": "bg-ocre text-white",
      "Services": "bg-dark-gray text-white",
    };
    
    return colors[categoryName as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Chargement des données...
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                Aucun produit trouvé
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(product.category_name)}>
                    {product.category_name}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{product.description || '-'}</TableCell>
                <TableCell className="text-right">
                  {product.price.toLocaleString()} TND
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <EditProductModal 
                      product={product} 
                      categories={categories} 
                      onUpdate={onUpdateProduct} 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
