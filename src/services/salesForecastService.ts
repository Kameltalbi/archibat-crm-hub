
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
      .gte('expected_date', formattedStartDate)
      .lte('expected_date', formattedEndDate);

    if (error) {
      console.error('Error fetching sales forecasts:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      ...item,
      project_name: item.projects?.name
    }));
  },
  
  async getAllMonthlyForecasts(year: number): Promise<{month: number, totalAmount: number}[]> {
    // Get data for all months for the chart
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('project_sales')
      .select('amount, expected_date')
      .gte('expected_date', startDate)
      .lte('expected_date', endDate);

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
      const date = new Date(item.expected_date);
      const month = date.getMonth();
      monthlyData[month].totalAmount += Number(item.amount);
    });
    
    return monthlyData;
  },
  
  // New function to get all sales forecasts for the entire year
  async getAllSalesForecastsForYear(year: number): Promise<SalesForecast[]> {
    const startDate = new Date(year, 0, 1).toISOString().split('T')[0];
    const endDate = new Date(year, 11, 31).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('project_sales')
      .select(`
        *,
        projects:project_id (name)
      `)
      .gte('expected_date', startDate)
      .lte('expected_date', endDate);

    if (error) {
      console.error('Error fetching yearly sales forecasts:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      ...item,
      project_name: item.projects?.name
    }));
  }
};
