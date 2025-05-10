
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProductSearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const ProductSearchBar = ({ onSearch }: ProductSearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Rechercher..."
        className="pl-8"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
  );
};

export default ProductSearchBar;
