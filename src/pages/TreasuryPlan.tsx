
import { useState, useEffect } from "react";
import { format, addMonths, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { expenseService, Expense } from "@/services/expenseService";

interface Sale {
  id: string;
  project_id: string;
  project_name?: string;
  label: string;
  amount: number;
  date: string;
  client_name: string | null;
  category: string;
}

interface MonthlyData {
  month: Date;
  monthLabel: string;
  sales: Sale[];
  expenses: Expense[];
  salesTotal: number;
  expensesTotal: number;
  balance: number;
}

const TreasuryPlan = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  // Formater le montant en DT
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Générer les mois de l'année
  const generateMonths = (year: number) => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(year, i, 1);
      return {
        month: date,
        monthLabel: format(date, 'MMMM yyyy', { locale: fr }),
        sales: [],
        expenses: [],
        salesTotal: 0,
        expensesTotal: 0,
        balance: 0
      };
    });
  };

  // Calculer les données mensuelles
  const calculateMonthlyData = async (year: number) => {
    setLoading(true);

    try {
      const startDate = format(new Date(year, 0, 1), 'yyyy-MM-dd');
      const endDate = format(new Date(year, 11, 31), 'yyyy-MM-dd');

      // Récupérer les ventes pour l'année
      const { data: salesData, error: salesError } = await supabase
        .from('project_sales')
        .select(`
          id,
          project_id,
          label,
          amount,
          date,
          client_name,
          category,
          projects!inner (name)
        `)
        .gte('date', startDate)
        .lte('date', endDate);

      if (salesError) {
        throw salesError;
      }

      // Récupérer les dépenses pour l'année
      const expensesData = await expenseService.getExpensesByPeriod(startDate, endDate);

      // Transformer les données des ventes
      const sales: Sale[] = (salesData || []).map(sale => ({
        id: sale.id,
        project_id: sale.project_id,
        project_name: sale.projects?.name,
        label: sale.label,
        amount: Number(sale.amount),
        date: sale.date,
        client_name: sale.client_name,
        category: sale.category
      }));

      // Initialiser les données mensuelles
      const monthsData = generateMonths(year);

      // Remplir avec les ventes
      sales.forEach(sale => {
        const saleDate = parseISO(sale.date);
        const monthIndex = saleDate.getMonth();
        monthsData[monthIndex].sales.push(sale);
        monthsData[monthIndex].salesTotal += Number(sale.amount);
      });

      // Remplir avec les dépenses
      expensesData.forEach(expense => {
        const expenseDate = parseISO(expense.date);
        const monthIndex = expenseDate.getMonth();
        monthsData[monthIndex].expenses.push(expense);
        monthsData[monthIndex].expensesTotal += Number(expense.amount);
      });

      // Calculer le solde mensuel
      let previousBalance = 0;
      monthsData.forEach((month, index) => {
        const monthlyBalance = month.salesTotal - month.expensesTotal;
        month.balance = previousBalance + monthlyBalance;
        previousBalance = month.balance;
      });

      setMonthlyData(monthsData);
    } catch (error) {
      console.error("Erreur lors du calcul des données mensuelles:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du plan de trésorerie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Changer d'année
  const changeYear = (newYear: number) => {
    setCurrentYear(newYear);
  };

  useEffect(() => {
    calculateMonthlyData(currentYear);
  }, [currentYear]);

  // Années disponibles pour le filtre
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  // Fonction pour obtenir la couleur du solde
  const getBalanceColor = (balance: number) => {
    return balance < 0 ? "text-red-500" : "text-green-500";
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Plan de trésorerie</h1>
          <p className="text-gray-500 mt-1">Vue d'ensemble des entrées et sorties mensuelles</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 mr-2"
            onClick={() => changeYear(currentYear - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Select
            value={currentYear.toString()}
            onValueChange={(value) => changeYear(Number(value))}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder={currentYear.toString()} />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 ml-2"
            onClick={() => changeYear(currentYear + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Chargement du plan de trésorerie...</div>
      ) : (
        <div className="space-y-6">
          {/* Vue d'ensemble annuelle */}
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble {currentYear}</CardTitle>
              <CardDescription>Résumé annuel des entrées et sorties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Total des entrées</div>
                  <div className="text-xl font-bold text-green-500">
                    {formatAmount(monthlyData.reduce((total, month) => total + month.salesTotal, 0))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Total des sorties</div>
                  <div className="text-xl font-bold text-red-500">
                    {formatAmount(monthlyData.reduce((total, month) => total + month.expensesTotal, 0))}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Solde prévu en fin d'année</div>
                  <div className={`text-xl font-bold ${getBalanceColor(monthlyData[11]?.balance || 0)}`}>
                    {formatAmount(monthlyData[11]?.balance || 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tableau des données mensuelles */}
          <Card>
            <CardHeader>
              <CardTitle>Détail mensuel {currentYear}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mois</TableHead>
                    <TableHead className="text-right">Entrées</TableHead>
                    <TableHead className="text-right">Sorties</TableHead>
                    <TableHead className="text-right">Solde mensuel</TableHead>
                    <TableHead className="text-right">Solde cumulé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {monthlyData.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium capitalize">
                        {month.monthLabel}
                      </TableCell>
                      <TableCell className="text-right text-green-500">
                        {formatAmount(month.salesTotal)}
                      </TableCell>
                      <TableCell className="text-right text-red-500">
                        {formatAmount(month.expensesTotal)}
                      </TableCell>
                      <TableCell className={`text-right ${getBalanceColor(month.salesTotal - month.expensesTotal)}`}>
                        {formatAmount(month.salesTotal - month.expensesTotal)}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${getBalanceColor(month.balance)}`}>
                        {formatAmount(month.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Détails des mois */}
          {monthlyData.map((monthData, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="capitalize">{monthData.monthLabel}</CardTitle>
                <CardDescription>
                  Entrées: {formatAmount(monthData.salesTotal)} | 
                  Sorties: {formatAmount(monthData.expensesTotal)} | 
                  Solde: <span className={getBalanceColor(monthData.balance)}>{formatAmount(monthData.balance)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Entrées du mois */}
                  {monthData.sales.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Entrées</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Projet</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthData.sales.map((sale) => (
                            <TableRow key={sale.id}>
                              <TableCell>{sale.project_name || "-"}</TableCell>
                              <TableCell>{sale.label}</TableCell>
                              <TableCell>{format(parseISO(sale.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                              <TableCell className="text-right">{formatAmount(sale.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Sorties du mois */}
                  {monthData.expenses.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Sorties</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Label</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {monthData.expenses.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{expense.category_name || "-"}</TableCell>
                              <TableCell>{expense.label}</TableCell>
                              <TableCell>{format(parseISO(expense.date), "dd MMM yyyy", { locale: fr })}</TableCell>
                              <TableCell className="text-right">{formatAmount(expense.amount)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {monthData.sales.length === 0 && monthData.expenses.length === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      Aucune transaction pour ce mois
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreasuryPlan;
