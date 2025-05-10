
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import RolePermissionsMatrix from "./RolePermissionsMatrix";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserWithRole } from "@/lib/supabase";
import { userService } from "@/services/userService";

const UsersPage = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const usersWithRoles = await userService.getUsersWithRoles();
        setUsers(usersWithRoles);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleAddUser = async (userData: { name: string, email: string, role: "admin" | "collaborateur" | "lecture_seule", password: string }) => {
    try {
      const newUser = await userService.createUser(
        userData.email,
        userData.password,
        userData.name,
        userData.role
      );
      
      if (newUser) {
        setUsers([...users, newUser]);
        
        toast({
          title: "Utilisateur ajouté",
          description: `${userData.name} a été ajouté avec succès`,
        });
        
        setIsAddModalOpen(false);
      } else {
        throw new Error("Impossible de créer l'utilisateur");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const success = await userService.deleteUser(userId);
      
      if (success) {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        
        toast({
          title: "Utilisateur supprimé",
          description: "L'utilisateur a été supprimé avec succès",
        });
      } else {
        throw new Error("Impossible de supprimer l'utilisateur");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Utilisateurs</CardTitle>
            <CardDescription>Gérez les utilisateurs de votre organisation</CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-terracotta hover:bg-secondary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </CardHeader>
        <CardContent>
          <UsersTable 
            users={users} 
            isLoading={isLoading} 
            onDelete={handleDeleteUser} 
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rôles et Permissions</CardTitle>
          <CardDescription>
            Définissez les autorisations d'accès pour chaque rôle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionsMatrix />
        </CardContent>
      </Card>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UsersPage;
