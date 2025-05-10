
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";
import { User } from "@/types/user";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onDelete: (userId: string) => void;
}

const getRoleName = (role: string): string => {
  switch (role) {
    case "admin":
      return "Administrateur";
    case "collaborateur":
      return "Collaborateur";
    case "lecture_seule":
      return "Lecture seule";
    default:
      return role;
  }
};

const UsersTable = ({ users, isLoading, onDelete }: UsersTableProps) => {
  if (isLoading) {
    return <div className="text-center py-4">Chargement des utilisateurs...</div>;
  }

  if (users.length === 0) {
    return <div className="text-center py-4">Aucun utilisateur trouvé</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Rôle</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{getRoleName(user.role)}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`${
                  user.status === "active" 
                    ? "bg-secondary/20 text-secondary border-secondary/30" 
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {user.status === "active" ? "Actif" : "En attente"}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous certain ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement l'utilisateur {user.name} et ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(user.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
