
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
import { MonthSelector } from "@/components/sales-forecast/MonthSelector";

const ExpensesPage = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le mois et l'année sélectionnés
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // Les mois commencent à 0 en JS
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
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

  // Filtrer les dépenses par mois sélectionné
  useEffect(() => {
    if (expenses.length > 0) {
      const filtered = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() + 1 === currentMonth &&
          expenseDate.getFullYear() === currentYear
        );
      });
      setFilteredExpenses(filtered);
    }
  }, [expenses, currentMonth, currentYear]);

  useEffect(() => {
    loadExpenses();
  }, []);

  // Calculer le total des dépenses filtrées
  const totalExpenses = filteredExpenses.reduce((total, expense) => total + Number(expense.amount), 0);

  // Gérer le changement de mois
  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Charges & Dépenses</h1>
          <p className="text-gray-500 mt-1">Gérez vos charges et dépenses prévisionnelles</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-4 items-center">
          <MonthSelector 
            currentMonth={currentMonth}
            currentYear={currentYear}
            onMonthChange={handleMonthChange}
          />
          <AddExpenseModal onExpenseAdded={loadExpenses} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Total des charges & dépenses du mois</CardTitle>
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
              <div className="text-2xl font-bold">{filteredExpenses.filter(e => e.is_recurring).length}</div>
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
              <div className="text-2xl font-bold">{filteredExpenses.length}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4">
          <CardTitle>Liste des charges et dépenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 text-center">Chargement des dépenses...</div>
          ) : filteredExpenses.length > 0 ? (
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
                {filteredExpenses.map((expense) => (
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
              Aucune charge ou dépense prévisionnelle pour {format(new Date(currentYear, currentMonth - 1, 1), 'MMMM yyyy', { locale: fr })}.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensesPage;
