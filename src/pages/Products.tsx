import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash } from "lucide-react";
import AddCategoryModal from "@/components/products/AddCategoryModal";

const products = [
  {
    id: 1,
    name: "Étude de faisabilité",
    category: "Études",
    description: "Analyse préliminaire du projet et évaluation technique",
    price: 2500,
  },
  {
    id: 2,
    name: "Plan d'aménagement",
    category: "Études",
    description: "Réalisation des plans pour l'aménagement intérieur",
    price: 1800,
  },
  {
    id: 3,
    name: "Rénovation complète",
    category: "Travaux",
    description: "Rénovation complète incluant matériaux et main d'œuvre",
    price: 15000,
  },
  {
    id: 4,
    name: "Installation électrique",
    category: "Travaux",
    description: "Remise aux normes et installation électrique complète",
    price: 4200,
  },
  {
    id: 5,
    name: "Accompagnement projet",
    category: "Services",
    description: "Accompagnement et suivi de projet (mensuel)",
    price: 1200,
  },
  {
    id: 6,
    name: "Conseil en décoration",
    category: "Services",
    description: "Conseils sur l'aménagement et le design intérieur",
    price: 950,
  },
];

const categoryColors = {
  "Études": "bg-terracotta text-white",
  "Travaux": "bg-ocre text-white",
  "Services": "bg-dark-gray text-white",
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Produits & Catégories</h1>
          <p className="text-muted-foreground">
            Gérez votre catalogue de produits et services
          </p>
        </div>
        <div className="flex gap-3">
          <AddCategoryModal />
          <Button className="bg-terracotta hover:bg-ocre">
            <Plus className="mr-2 h-4 w-4" /> Produit
          </Button>
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[product.category as keyof typeof categoryColors]}>
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{product.description}</TableCell>
                    <TableCell className="text-right">
                      {product.price.toLocaleString()} €
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
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
