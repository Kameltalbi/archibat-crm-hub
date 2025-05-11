
export interface Product {
  id: string;
  name: string;
  price: number;
  category_id?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ClientMinimal {
  id: string;
  name: string;
}
