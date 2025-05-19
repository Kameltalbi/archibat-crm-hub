
import { useState, useEffect } from "react";
import { format, isWithinInterval, addMonths, addQuarters, addYears, isSameMonth, isBefore, parseISO } from "date-fns";
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

  // Générer les occurrences des dépenses récurrentes pour le mois sélectionné
  const generateRecurringExpensesForMonth = (expenses: Expense[], targetYear: number, targetMonth: number) => {
    const selectedMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const result: Expense[] = [];

    // D'abord, ajouter toutes les dépenses non récurrentes du mois sélectionné
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getMonth() + 1 === targetMonth && expenseDate.getFullYear() === targetYear) {
        result.push(expense);
      }
    });

    // Ensuite, générer les occurrences pour les dépenses récurrentes
    expenses.filter(expense => expense.is_recurring).forEach(recurringExpense => {
      const startDate = new Date(recurringExpense.date);
      const endDate = recurringExpense.recurring_end_date 
        ? new Date(recurringExpense.recurring_end_date) 
        : null;

      // Vérifier si la date de fin est définie et si la date cible est après la date de fin
      if (endDate && selectedMonthDate > endDate) {
        return; // Ne pas générer d'occurrence après la date de fin
      }

      // Vérifier si la date cible est avant la date de début
      if (selectedMonthDate < startDate) {
        return; // Ne pas générer d'occurrence avant la date de début
      }

      // Calculer si cette dépense récurrente apparaît dans le mois sélectionné
      let shouldInclude = false;
      let currentOccurrenceDate = new Date(startDate);
      const frequency = recurringExpense.recurring_frequency || 'monthly';

      while (currentOccurrenceDate <= selectedMonthDate) {
        if (isSameMonth(currentOccurrenceDate, selectedMonthDate)) {
          shouldInclude = true;
          break;
        }

        // Avancer à la prochaine occurrence selon la fréquence
        if (frequency === 'monthly') {
          currentOccurrenceDate = addMonths(currentOccurrenceDate, 1);
        } else if (frequency === 'quarterly') {
          currentOccurrenceDate = addQuarters(currentOccurrenceDate, 1);
        } else if (frequency === 'yearly') {
          currentOccurrenceDate = addYears(currentOccurrenceDate, 1);
        }

        // Vérifier si on a dépassé la date de fin
        if (endDate && currentOccurrenceDate > endDate) {
          break;
        }
      }

      // Ajouter l'occurrence si elle tombe dans le mois sélectionné et qu'elle n'est pas déjà incluse
      if (shouldInclude && !result.some(e => e.id === recurringExpense.id && isSameMonth(new Date(e.date), selectedMonthDate))) {
        // Créer une copie de la dépense récurrente avec la date ajustée au mois sélectionné
        const occurrenceDate = new Date(targetYear, targetMonth - 1, startDate.getDate());
        
        // Assurer que la date ne dépasse pas le dernier jour du mois
        const adjustedDate = occurrenceDate.getDate() !== startDate.getDate() 
          ? new Date(targetYear, targetMonth - 1, 0) // Dernier jour du mois précédent
          : occurrenceDate;

        const occurrenceExpense = {
          ...recurringExpense,
          date: format(adjustedDate, 'yyyy-MM-dd'),
          isGenerated: true // Marquer comme générée pour distinguer des entrées réelles
        };
        
        // Ne pas ajouter si c'est la même que l'original (même mois et année)
        if (!(startDate.getMonth() + 1 === targetMonth && startDate.getFullYear() === targetYear)) {
          result.push(occurrenceExpense);
        }
      }
    });

    return result;
  };

  // Filtrer les dépenses par mois sélectionné, incluant les dépenses récurrentes
  useEffect(() => {
    if (expenses.length > 0) {
      const filtered = generateRecurringExpensesForMonth(expenses, currentYear, currentMonth);
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
                {filteredExpenses.map((expense, index) => (
                  <TableRow key={`${expense.id}-${index}`}>
                    <TableCell className="font-medium">
                      {expense.label}
                      {expense.isGenerated && (
                        <span className="ml-2 text-xs text-gray-500">(récurrent)</span>
                      )}
                    </TableCell>
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
