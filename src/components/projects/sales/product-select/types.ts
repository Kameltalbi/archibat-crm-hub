
export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string | null;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
