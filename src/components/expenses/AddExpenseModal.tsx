
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { expenseService, ExpenseCategory, ExpenseSubcategory } from "@/services/expenseService";

const formSchema = z.object({
  label: z.string().min(1, { message: "Le libellé est requis" }),
  amount: z.coerce.number().positive({ message: "Le montant doit être positif" }),
  date: z.date(),
  category_id: z.string().min(1, { message: "La catégorie est requise" }),
  subcategory_id: z.string().optional(),
  is_recurring: z.boolean().default(false),
  recurring_frequency: z.string().optional(),
  recurring_end_date: z.date().optional(),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AddExpenseModalProps {
  onExpenseAdded?: () => void;
}

const AddExpenseModal = ({ onExpenseAdded }: AddExpenseModalProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ExpenseSubcategory[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      amount: 0,
      date: new Date(),
      category_id: "",
      subcategory_id: "",
      is_recurring: false,
      recurring_frequency: "monthly",
      notes: ""
    }
  });

  const isRecurring = form.watch("is_recurring");
  const selectedCategoryId = form.watch("category_id");

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await expenseService.getAllCategories();
        setCategories(data);
        if (data.length > 0 && !selectedCategoryId) {
          form.setValue("category_id", data[0].id);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des catégories:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les catégories de dépenses",
          variant: "destructive"
        });
      }
    };

    if (open) {
      loadCategories();
    }
  }, [open, selectedCategoryId, form, toast]);

  // Charger les sous-catégories lorsque la catégorie change
  useEffect(() => {
    const loadSubcategories = async () => {
      if (!selectedCategoryId) return;
      
      try {
        const data = await expenseService.getSubcategoriesByCategory(selectedCategoryId);
        setSubcategories(data);
        // Réinitialiser la sous-catégorie si elle n'est plus valide pour la nouvelle catégorie
        if (data.length > 0) {
          const currentSubcategoryId = form.getValues("subcategory_id");
          const isValidSubcategory = data.some(sub => sub.id === currentSubcategoryId);
          if (!isValidSubcategory) {
            form.setValue("subcategory_id", data[0].id);
          }
        } else {
          form.setValue("subcategory_id", undefined);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des sous-catégories:", error);
      }
    };

    if (selectedCategoryId) {
      loadSubcategories();
    }
  }, [selectedCategoryId, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      await expenseService.createExpense({
        label: values.label,
        amount: values.amount,
        date: format(values.date, "yyyy-MM-dd"),
        category_id: values.category_id,
        subcategory_id: values.subcategory_id || null,
        is_recurring: values.is_recurring,
        recurring_frequency: values.is_recurring ? values.recurring_frequency || null : null,
        recurring_end_date: values.is_recurring && values.recurring_end_date 
          ? format(values.recurring_end_date, "yyyy-MM-dd") 
          : null,
        notes: values.notes || null
      });

      toast({
        title: "Succès",
        description: "La dépense a été ajoutée avec succès"
      });
      setOpen(false);
      form.reset();
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la dépense:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la dépense",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Ajouter une dépense prévisionnelle</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé *</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le libellé de la dépense" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (TND) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0" 
                        step="0.01" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={fr}
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subcategory_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sous-catégorie</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value || ""}
                      disabled={subcategories.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une sous-catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border p-4 rounded-md space-y-4">
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name="is_recurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label htmlFor="is-recurring">Dépense récurrente</Label>
                    </FormItem>
                  )}
                />
              </div>

              {isRecurring && (
                <>
                  <FormField
                    control={form.control}
                    name="recurring_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fréquence</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || "monthly"}
                          value={field.value || "monthly"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une fréquence" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Mensuel</SelectItem>
                            <SelectItem value="quarterly">Trimestriel</SelectItem>
                            <SelectItem value="yearly">Annuel</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="recurring_end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date de fin (optionnelle)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: fr })
                                ) : (
                                  <span>Sélectionner une date de fin</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              locale={fr}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes éventuelles"
                      className="min-h-[80px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
