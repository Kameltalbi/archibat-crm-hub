
// Page Congé – ouverture du modal Ajouter Demande de Congé pour l'employé cliqué (par l'admin)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddLeaveModal from "@/components/conge/AddLeaveModal";
import SelectEmployeeModal from "@/components/conge/SelectEmployeeModal";
import { Plus } from "lucide-react";

const CongePage = () => {
  const [conges, setConges] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSelectEmployeeModalOpen, setIsSelectEmployeeModalOpen] = useState(false);

  const fetchConges = async () => {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, employee:employees(full_name, id)");

    if (error) {
      console.error("Erreur de chargement des congés :", error);
    } else {
      setConges(data);
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  const handleRowClick = (employee) => {
    setSelectedEmployee(employee);
    setIsLeaveModalOpen(true);
  };

  const handleAddLeaveClick = () => {
    setIsSelectEmployeeModalOpen(true);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setIsSelectEmployeeModalOpen(false);
    setIsLeaveModalOpen(true);
  };

  const handleLeaveModalClose = () => {
    setIsLeaveModalOpen(false);
    fetchConges(); // Rafraîchir la liste après ajout
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Gestion des congés</h1>
        <Button onClick={handleAddLeaveClick}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un congé
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employé</TableHead>
            <TableHead>Date début</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conges.map((conge, index) => (
            <TableRow key={index} onClick={() => handleRowClick(conge.employee)} className="cursor-pointer hover:bg-muted">
              <TableCell>{conge.employee?.full_name}</TableCell>
              <TableCell>{conge.start_date}</TableCell>
              <TableCell>{conge.end_date}</TableCell>
              <TableCell>{conge.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isLeaveModalOpen && selectedEmployee && (
        <AddLeaveModal
          isOpen={isLeaveModalOpen}
          onClose={handleLeaveModalClose}
          employee={selectedEmployee}
        />
      )}

      <SelectEmployeeModal
        isOpen={isSelectEmployeeModalOpen}
        onClose={() => setIsSelectEmployeeModalOpen(false)}
        onSelect={handleEmployeeSelect}
      />
    </div>
  );
};

export default CongePage;
