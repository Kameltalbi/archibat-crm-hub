
import { Button } from "@/components/ui/button";
import AddProductModal from "@/components/products/AddProductModal";
import { Category } from "@/hooks/useProducts";

interface ProductsHeaderProps {
  categories: Category[];
  onSaveProduct: (productData: any) => void;
}

const ProductsHeader = ({ categories, onSaveProduct }: ProductsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Produits</h1>
        <p className="text-muted-foreground">
          Gérez votre catalogue de produits et services
        </p>
      </div>
      <div className="flex gap-3">
        <AddProductModal categories={categories} onSave={onSaveProduct} />
      </div>
    </div>
  );
};

export default ProductsHeader;
