
// Basic type definitions shared across project detail components
export interface Client {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  client?: string;
  startDate: string;
  endDate: string;
  status: string;
  clients: Client[];
  category?: string;
  targetRevenue?: number;
}

export interface Sale {
  id: string;
  label: string;
  date: string;
  amount: number;
  category: string;
  client: string;
  product?: string;
}

export interface ProjectSale {
  id: string;
  project_id: string;
  label: string;
  date: string;
  amount: number;
  category: string;
  client_name: string | null;
  product_name: string | null;
  created_at: string;
  updated_at: string;
}
