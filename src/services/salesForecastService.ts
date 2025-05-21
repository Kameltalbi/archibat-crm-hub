
import { supabase } from "@/lib/supabase";

export interface SalesForecast {
  id: string;
  project_id: string;
  project_name?: string;
  label: string;
  amount: number;
  expected_date: string;
  status: 'prévu' | 'facturé' | 'annulé';
  created_at: string;
}

export const salesForecastService = {
  async getSalesForecasts(year: number, month: number): Promise<SalesForecast[]> {
    // Calculate first and last day of the selected month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('project_sales')
      .select(`
        *,
        projects:project_id (name)
      `)
      .gte('transaction_date', formattedStartDate)
      .lte('transaction_date', formattedEndDate);

    if (error) {
      console.error('Error fetching sales forecasts:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      ...item,
      project_name: item.projects?.name,
      expected_date: item.transaction_date || item.date // Utiliser transaction_date si disponible, sinon utiliser date
    }));
  },
  
  async getAllMonthlyForecasts(year: number): Promise<{month: number, totalAmount: number}[]> {
    // Get data for all months for the chart
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('project_sales')
      .select('amount, transaction_date, date')
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    if (error) {
      console.error('Error fetching yearly forecasts:', error);
      return [];
    }
    
    // Group by month and sum amounts
    const monthlyData = Array(12).fill(0).map((_, i) => ({
      month: i + 1, 
      totalAmount: 0
    }));
    
    data.forEach((item) => {
      // Utiliser transaction_date si disponible, sinon utiliser date
      const dateStr = item.transaction_date || item.date;
      const date = new Date(dateStr);
      const month = date.getMonth();
      monthlyData[month].totalAmount += Number(item.amount);
    });
    
    return monthlyData;
  },
  
  // Mise à jour de la fonction pour obtenir toutes les ventes pour l'année entière
  async getAllSalesForecastsForYear(year: number): Promise<SalesForecast[]> {
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('project_sales')
      .select(`
        *,
        projects:project_id (name)
      `)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate);

    if (error) {
      console.error('Error fetching yearly sales forecasts:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      ...item,
      project_name: item.projects?.name,
      expected_date: item.transaction_date || item.date // Utiliser transaction_date si disponible, sinon utiliser date
    }));
  }
};
