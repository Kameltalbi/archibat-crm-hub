
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { expenseService, ExpenseCategory, ExpenseSubcategory, Expense } from "@/services/expenseService";

interface EditExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseUpdated: () => void;
  expenseId: string;
}

const EditExpenseModal = ({ isOpen, onClose, onExpenseUpdated, expenseId }: EditExpenseModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ExpenseSubcategory[]>([]);
  
  // Form state
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<string | null>("monthly");
  const [recurringEndDate, setRecurringEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState<string | null>("");
  
  // Fetch expense details and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !expenseId) return;
      
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await expenseService.getAllCategories();
        setCategories(categoriesData);
        
        // Fetch expense details
        const expense = await expenseService.getExpenseById(expenseId);
        
        // Set form values
        setLabel(expense.label);
        setAmount(expense.amount.toString());
        setDate(expense.date ? new Date(expense.date) : new Date());
        setCategoryId(expense.category_id);
        setIsRecurring(expense.is_recurring);
        setRecurringFrequency(expense.recurring_frequency);
        
        if (expense.recurring_end_date) {
          setRecurringEndDate(new Date(expense.recurring_end_date));
        }
        
        setNotes(expense.notes);
        
        // Fetch subcategories if needed
        if (expense.category_id) {
          const subcategoriesData = await expenseService.getSubcategoriesByCategory(expense.category_id);
          setSubcategories(subcategoriesData);
          setSubcategoryId(expense.subcategory_id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la dépense",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isOpen, expenseId, toast]);
  
  // Handle category change
  const handleCategoryChange = async (value: string) => {
    setCategoryId(value);
    setSubcategoryId(null);
    
    try {
      const subcategoriesData = await expenseService.getSubcategoriesByCategory(value);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error("Erreur lors du chargement des sous-catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les sous-catégories",
        variant: "destructive"
      });
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!label || !amount || !date) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const expenseData: Partial<Expense> = {
        label,
        amount: parseFloat(amount),
        date: format(date, 'yyyy-MM-dd'),
        category_id: categoryId,
        subcategory_id: subcategoryId,
        is_recurring: isRecurring,
        recurring_frequency: isRecurring ? recurringFrequency : null,
        recurring_end_date: isRecurring && recurringEndDate ? format(recurringEndDate, 'yyyy-MM-dd') : null,
        notes
      };
      
      await expenseService.updateExpense(expenseId, expenseData);
      
      toast({
        title: "Dépense mise à jour",
        description: "La dépense a été mise à jour avec succès"
      });
      
      onExpenseUpdated();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la dépense",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la dépense</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="py-6 text-center">Chargement des données...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="label">Libellé</Label>
                <Input
                  id="label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Montant (DT)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={categoryId || ""} onValueChange={handleCategoryChange}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {subcategories.length > 0 && (
                <div className="grid gap-2">
                  <Label htmlFor="subcategory">Sous-catégorie</Label>
                  <Select value={subcategoryId || ""} onValueChange={(value) => setSubcategoryId(value)}>
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Sélectionner une sous-catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={isRecurring}
                  onCheckedChange={(checked) => setIsRecurring(checked === true)}
                />
                <Label htmlFor="recurring" className="cursor-pointer">
                  Dépense récurrente
                </Label>
              </div>
              
              {isRecurring && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="frequency">Fréquence</Label>
                    <Select value={recurringFrequency || "monthly"} onValueChange={(value) => setRecurringFrequency(value)}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Sélectionner une fréquence" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                        <SelectItem value="quarterly">Trimestrielle</SelectItem>
                        <SelectItem value="yearly">Annuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Date de fin (optionnelle)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !recurringEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {recurringEndDate 
                            ? format(recurringEndDate, "PPP", { locale: fr }) 
                            : "Sélectionner une date de fin"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={recurringEndDate}
                          onSelect={setRecurringEndDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  value={notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;
