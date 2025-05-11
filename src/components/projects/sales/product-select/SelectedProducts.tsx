
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { formatPrice } from "./utils";
import { SelectedProduct } from "./types";

interface SelectedProductsProps {
  selectedProducts: SelectedProduct[];
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
}

const SelectedProducts = ({ 
  selectedProducts,
  onQuantityChange,
  onRemoveProduct
}: SelectedProductsProps) => {
  if (selectedProducts.length === 0) {
    return (
      <div className="text-sm text-muted-foreground rounded-md border p-3 text-center">
        Aucun produit sélectionné
      </div>
    );
  }

  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="space-y-2">
      {selectedProducts.map((product) => (
        <div 
          key={product.id} 
          className="flex items-center justify-between rounded-md border p-3"
        >
          <div className="flex flex-col flex-1">
            <div className="font-medium">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              Prix unitaire: {formatPrice(product.price)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor={`quantity-${product.id}`} className="sr-only">Quantité</Label>
            <Input
              id={`quantity-${product.id}`}
              type="number"
              value={product.quantity}
              onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              min="1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveProduct(product.id)}
              className="text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between items-center pt-2">
        <div className="font-medium">Total</div>
        <div className="font-bold">
          {formatPrice(totalPrice)}
        </div>
      </div>
    </div>
  );
};

export default SelectedProducts;
