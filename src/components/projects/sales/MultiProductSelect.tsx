
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  category?: string | null;
}

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface MultiProductSelectProps {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onChange: (selectedProducts: SelectedProduct[]) => void;
  projectCategory?: string;
}

const MultiProductSelect = ({ 
  products,
  selectedProducts,
  onChange,
  projectCategory
}: MultiProductSelectProps) => {
  const [open, setOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Filter products based on project category and selected products
  useEffect(() => {
    // First, filter out already selected products
    let availableProducts = products.filter(
      product => !selectedProducts.some(selected => selected.id === product.id)
    );
    
    // Log for debugging
    console.log(`Total available products: ${availableProducts.length}`, availableProducts);
    console.log(`Project category: ${projectCategory}`);
    
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
    setOpen(false);
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
  
  // Formatage du prix en TND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  return (
    <div className="space-y-4">
      <Label>Produits *</Label>
      
      {/* Produits sélectionnés */}
      <div className="space-y-2">
        {selectedProducts.length > 0 ? (
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
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 1)}
                    className="w-16 text-center"
                    min="1"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveProduct(product.id)}
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
                {formatPrice(selectedProducts.reduce((sum, p) => sum + p.price * p.quantity, 0))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground rounded-md border p-3 text-center">
            Aucun produit sélectionné
          </div>
        )}
      </div>
      
      {/* Sélecteur de produits */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedProducts.length > 0 
              ? `${selectedProducts.length} produit${selectedProducts.length > 1 ? 's' : ''} sélectionné${selectedProducts.length > 1 ? 's' : ''}`
              : filteredProducts.length > 0 
                ? "Sélectionner des produits" 
                : "Aucun produit disponible"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un produit..." />
            <CommandList>
              <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
              <CommandGroup>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.id}
                      onSelect={() => handleSelectProduct(product)}
                      className="flex justify-between"
                    >
                      <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.category && (
                          <span className="text-xs text-muted-foreground">
                            Catégorie: {product.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{formatPrice(product.price)}</Badge>
                      </div>
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem disabled className="italic text-muted-foreground">
                    Aucun produit disponible.
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MultiProductSelect;
