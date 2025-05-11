
import MultiProductSelectContainer from "./product-select/MultiProductSelectContainer";
import { Product, SelectedProduct } from "./product-select/types";

interface MultiProductSelectProps {
  products: Product[];
  selectedProducts: SelectedProduct[];
  onChange: (selectedProducts: SelectedProduct[]) => void;
  projectCategory?: string;
}

const MultiProductSelect = (props: MultiProductSelectProps) => {
  return <MultiProductSelectContainer {...props} />;
};

export default MultiProductSelect;
