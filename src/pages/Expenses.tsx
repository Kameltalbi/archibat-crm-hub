
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddExpenseModal from "@/components/expenses/AddExpenseModal";
import { expenseService, Expense } from "@/services/expenseService";

const ExpensesPage = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Formater le montant en DT
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Charger les dépenses
  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expenseService.getAllExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les dépenses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Calculer le total des dépenses
  const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dépenses prévisionnelles</h1>
          <p className="text-gray-500 mt-1">Gérez vos dépenses prévisionnelles</p>
        </div>
        <div className="mt-4 md:mt-0">
          <AddExpenseModal onExpenseAdded={loadExpenses} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Total des dépenses prévisionnelles</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <Euro className="w-5 h-5 mr-2 text-gray-500" />
              <div className="text-2xl font-bold">{formatAmount(totalExpenses)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Dépenses récurrentes</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <div className="text-2xl font-bold">{expenses.filter(e => e.is_recurring).length}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Dépenses pour ce mois</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <div className="text-2xl font-bold">
                {expenses.filter(e => {
                  const today = new Date();
                  const expenseDate = new Date(e.date);
                  return expenseDate.getMonth() === today.getMonth() && 
                         expenseDate.getFullYear() === today.getFullYear();
                }).length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Liste des dépenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-center">Chargement des dépenses...</div>
          ) : expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Libellé</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.label}</TableCell>
                    <TableCell>
                      {expense.category_name}
                      {expense.subcategory_name && (
                        <span className="text-gray-500 text-sm block">
                          {expense.subcategory_name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(expense.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                    <TableCell className="text-right">{formatAmount(expense.amount)}</TableCell>
                    <TableCell>
                      {expense.is_recurring ? (
                        <Badge className="bg-blue-500">
                          Récurrent ({expense.recurring_frequency === 'monthly' ? 'Mensuel' : 
                                      expense.recurring_frequency === 'quarterly' ? 'Trimestriel' : 'Annuel'})
                        </Badge>
                      ) : (
                        <Badge variant="outline">Ponctuel</Badge>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune dépense prévisionnelle n'a encore été ajoutée.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
