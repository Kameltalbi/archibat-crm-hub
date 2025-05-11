
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PriceFieldProps {
  value: number;
  onChange: (value: number) => void;
  selectedProducts: SelectedProduct[];
}

const PriceField = ({ value, onChange, selectedProducts }: PriceFieldProps) => {
  // Calculer le prix automatiquement basé sur les produits sélectionnés
  const calculatedPrice = selectedProducts.reduce(
    (sum, product) => sum + (product.price * product.quantity), 
    0
  );
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value);
    onChange(isNaN(newPrice) ? 0 : newPrice);
  };
  
  // Formater le prix pour l'affichage (en TND)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="price">Prix HT *</Label>
        {selectedProducts.length > 0 && calculatedPrice !== value && (
          <span className="text-xs text-muted-foreground">
            Prix calculé: {formatPrice(calculatedPrice)}
          </span>
        )}
      </div>
      <Input
        id="price"
        type="number"
        value={value || ''}
        onChange={handlePriceChange}
        placeholder="0.00 DT"
        className="text-right"
        min="0"
        step="0.01"
      />
    </div>
  );
};

export default PriceField;
