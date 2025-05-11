
import { ClientMinimal } from "../types";

export interface ProjectSalesFormProps {
  projectId: string;
  projectName?: string;
  projectCategory?: string;
  clientId?: string;
  clients?: ClientMinimal[];
  onSaleAdded: () => void;
  onCancel: () => void;
}

export interface SaleFormData {
  clientId: string;
  date: Date;
  amount: string;
  productId: string;
  label: string;
  remarks: string;
}
