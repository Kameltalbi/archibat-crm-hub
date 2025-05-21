
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Search } from "lucide-react";

interface Employee {
  id: string;
  full_name: string;
}

interface SelectEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (employee: Employee) => void;
}

const SelectEmployeeModal = ({ isOpen, onClose, onSelect }: SelectEmployeeModalProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      
      try {
        // Corrected query - removed "as full_name" since the column is already named correctly in the database
        const { data, error } = await supabase
          .from("employees")
          .select("id, name");
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match the Employee interface
        const transformedData = data?.map(employee => ({
          id: employee.id,
          full_name: employee.name
        })) || [];
        
        setEmployees(transformedData);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchEmployees();
    }
  }, [isOpen]);
  
  const filteredEmployees = employees.filter(employee => 
    employee.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner un employé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un employé..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {isLoading ? (
            <div className="py-8 text-center">Chargement des employés...</div>
          ) : (
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom de l'employé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <TableRow 
                        key={employee.id} 
                        onClick={() => onSelect(employee)}
                        className="cursor-pointer hover:bg-muted"
                      >
                        <TableCell>{employee.full_name}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-center py-6">
                        {searchQuery ? "Aucun résultat trouvé" : "Aucun employé disponible"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelectEmployeeModal;
