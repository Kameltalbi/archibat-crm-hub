// Page Congé – ouverture du modal Ajouter Demande de Congé pour l'employé cliqué (par l'admin)

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddLeaveModal from "@/components/conge/AddLeaveModal";

const CongePage = () => {
  const [conges, setConges] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchConges = async () => {
    const { data, error } = await supabase
      .from("leaves")
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
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Gestion des congés</h1>
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

      {isModalOpen && selectedEmployee && (
        <AddLeaveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default CongePage;