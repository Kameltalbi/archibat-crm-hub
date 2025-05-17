
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Edit, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AddExpenseCategoryModal from "@/components/expenses/AddExpenseCategoryModal";
import { expenseService, ExpenseCategory } from "@/services/expenseService";

const ExpenseCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const categories = await expenseService.getAllCategories();
      setCategories(categories);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories de dépenses:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les catégories de dépenses. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || editingCategory.name.trim() === "") return;

    try {
      const { data, error } = await expenseService.updateExpenseCategory(
        editingCategory.id,
        {
          name: editingCategory.name.trim(),
          description: editingCategory.description || null
        }
      );

      if (error) throw error;

      const updatedCategories = categories.map(category =>
        category.id === editingCategory.id ? { ...editingCategory } : category
      );
      
      setCategories(updatedCategories);
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      
      toast({
        title: "Catégorie modifiée",
        description: "La catégorie de dépense a été modifiée avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la modification de la catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier la catégorie de dépense. Veuillez réessayer."
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await expenseService.deleteExpenseCategory(id);
      
      if (error) throw error;
      
      setCategories(categories.filter(category => category.id !== id));
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie de dépense a été supprimée avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la catégorie de dépense. Veuillez réessayer."
      });
    }
  };

  const handleEditClick = (category: ExpenseCategory) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Catégories de dépenses</h1>
          <p className="text-muted-foreground">
            Gérez les catégories de vos dépenses
          </p>
        </div>
        
        <AddExpenseCategoryModal onCategoryAdded={fetchCategories} />

        {/* Dialogue de modification */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-charcoal dark:text-light-gray">
                Modifier la catégorie de dépense
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Modifiez les informations de la catégorie
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Nom de la catégorie *
                </label>
                <Input
                  id="edit-name"
                  value={editingCategory?.name || ""}
                  onChange={(e) => 
                    setEditingCategory(prev => 
                      prev ? {...prev, name: e.target.value} : null
                    )
                  }
                  placeholder="Saisissez le nom de la catégorie"
                  className="border-input"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="edit-description"
                  value={editingCategory?.description || ""}
                  onChange={(e) => 
                    setEditingCategory(prev => 
                      prev ? {...prev, description: e.target.value} : null
                    )
                  }
                  placeholder="Description (optionnelle)"
                  className="border-input min-h-[100px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                onClick={handleUpdateCategory}
                className="bg-terracotta hover:bg-ocre text-white"
                disabled={!editingCategory?.name?.trim()}
              >
                Mettre à jour
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des catégories de dépenses</CardTitle>
          <CardDescription>
            {filteredCategories.length} catégories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une catégorie..."
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
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      Aucune catégorie trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{category.description || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
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

export default ExpenseCategories;
