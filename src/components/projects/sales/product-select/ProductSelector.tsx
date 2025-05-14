
import { useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown } from "lucide-react";
import { formatPrice } from "./utils";
import { Product } from "./types";

interface ProductSelectorProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectProduct: (product: Product) => void;
}

const ProductSelector = ({ 
  products,
  selectedProductIds,
  onSelectProduct 
}: ProductSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSelectProduct = (product: Product) => {
    onSelectProduct(product);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProductIds.length > 0 
            ? `${selectedProductIds.length} produit${selectedProductIds.length > 1 ? 's' : ''} sélectionné${selectedProductIds.length > 1 ? 's' : ''}`
            : products.length > 0 
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
              {products.length > 0 ? (
                products.map((product) => (
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
  );
};

export default ProductSelector;
