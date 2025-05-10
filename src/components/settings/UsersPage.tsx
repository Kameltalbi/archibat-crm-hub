
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import RolePermissionsMatrix from "./RolePermissionsMatrix";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { User, Role } from "@/types/user";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // This would be implemented after connecting to Supabase
        // For now using mock data
        const mockUsers: User[] = [
          { id: "1", name: "Admin User", email: "admin@archibat.com", role: "admin", status: "active" },
          { id: "2", name: "Jean Dupont", email: "jean@archibat.com", role: "collaborateur", status: "active" },
          { id: "3", name: "Marie Martin", email: "marie@archibat.com", role: "lecture_seule", status: "pending" },
        ];
        
        setUsers(mockUsers);
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

  const handleAddUser = async (userData: Omit<User, "id" | "status">) => {
    try {
      // This would be implemented after connecting to Supabase
      // For now just adding to local state
      const newUser: User = {
        id: Date.now().toString(),
        ...userData,
        status: "pending",
      };
      
      setUsers([...users, newUser]);
      
      toast({
        title: "Utilisateur ajouté",
        description: `${userData.name} a été ajouté avec succès`,
      });
      
      setIsAddModalOpen(false);
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
      // This would be implemented after connecting to Supabase
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
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
