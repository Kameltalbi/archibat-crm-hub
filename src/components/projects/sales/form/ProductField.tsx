
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Product } from "../types";

interface ProductFieldProps {
  value: string;
  onChange: (value: string) => void;
  products: Product[];
  isLoading: boolean;
}

const ProductField = ({ value, onChange, products, isLoading }: ProductFieldProps) => {
  return (
    <div>
      <Label htmlFor="product">Produit *</Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger id="product" className="mt-1">
          <SelectValue placeholder={isLoading ? "Chargement..." : "Sélectionner un produit"} />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>Chargement des produits...</SelectItem>
          ) : products.length > 0 ? (
            products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} - {product.price} DT
                {product.categories && ` (${product.categories.name})`}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-product" disabled>
              Aucun produit disponible pour cette catégorie
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductField;
