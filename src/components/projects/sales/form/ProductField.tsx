
import { useEffect, useMemo } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Product } from '@/components/projects/sales/types';

interface ProductFieldProps {
  form: ReturnType<typeof useForm>;
  projectCategory?: string;
}

export const ProductField = ({ form, projectCategory }: ProductFieldProps) => {
  const [products, setProducts] = useMemo<Product[]>(() => [], []);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Rechercher les produits en fonction de la catégorie du projet
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        // Filtrer les produits selon la catégorie du projet si elle est définie
        const filteredProducts = projectCategory
          ? data.filter(product => product.category === projectCategory)
          : data;

        setProducts(filteredProducts as Product[]);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
      }
    };

    fetchProducts();
  }, [projectCategory]);

  return (
    <FormField
      control={form.control}
      name="productId"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Produit associé</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? products.find((product) => product.id === field.value)?.name ?? "Sélectionner un produit"
                    : "Sélectionner un produit"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher un produit..." />
                <CommandList>
                  <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => (
                      <CommandItem
                        key={product.id}
                        value={product.id}
                        onSelect={() => {
                          form.setValue("productId", product.id);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            product.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {product.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
