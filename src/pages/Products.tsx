import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Trash } from "lucide-react";
import AddProductModal, { Category } from "@/components/products/AddProductModal";
import EditProductModal from "@/components/products/EditProductModal";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/supabase";

interface ProductWithCategory extends Product {
  category_name: string;
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name');

      if (error) {
        throw error;
      }

      // Transformer les données pour correspondre à l'interface Category
      const formattedCategories: Category[] = data.map(cat => ({
        id: cat.id,
        name: cat.name
      }));

      setCategories(formattedCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories. Veuillez réessayer."
      });
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name)
        `);
        
      if (productsError) {
        throw productsError;
      }
      
      // Transformer les données pour inclure le nom de la catégorie
      const formattedProducts: ProductWithCategory[] = productsData.map(product => {
        return {
          ...product,
          category_name: product.categories ? product.categories.name : 'Non catégorisé'
        };
      });
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les produits. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setProducts(products.filter(product => product.id !== id));
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le produit. Veuillez réessayer."
      });
    }
  };
  
  const handleSaveProduct = async (productData: any) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id
        }])
        .select(`
          *,
          categories(name)
        `);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newProduct: ProductWithCategory = {
          ...data[0],
          category_name: data[0].categories ? data[0].categories.name : 'Non catégorisé'
        };
        
        setProducts([...products, newProduct]);
        toast({
          title: "Produit ajouté",
          description: "Le produit a été ajouté avec succès."
        });
        
        // Rafraîchir la liste pour avoir les données complètes
        fetchProducts();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le produit. Veuillez réessayer."
      });
    }
  };

  // Couleurs pour les catégories
  const getCategoryColor = (categoryName: string) => {
    const colors = {
      "Études": "bg-terracotta text-white",
      "Travaux": "bg-ocre text-white",
      "Services": "bg-dark-gray text-white",
    };
    
    return colors[categoryName as keyof typeof colors] || "bg-muted text-muted-foreground";
  };
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <div className="flex gap-3">
          <AddProductModal categories={categories} onSave={handleSaveProduct} />
        </div>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Catalogue</CardTitle>
          <CardDescription>
            {filteredProducts.length} produits et services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
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
                            onUpdate={fetchProducts} 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
