
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersPage from "@/components/settings/UsersPage";
import { Shield } from "lucide-react";
import Categories from "./Categories";
import ExpenseCategories from "./ExpenseCategories";

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-terracotta" />
        <h1 className="text-2xl font-semibold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Utilisateurs & Permissions</TabsTrigger>
          <TabsTrigger value="productCategories">Catégories produits</TabsTrigger>
          <TabsTrigger value="expenseCategories">Catégories dépenses</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="billing">Actions commerciales</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersPage />
        </TabsContent>

        <TabsContent value="productCategories">
          <Categories />
        </TabsContent>
        
        <TabsContent value="expenseCategories">
          <ExpenseCategories />
        </TabsContent>
        
        <TabsContent value="general">
          <div className="rounded-md border p-6 bg-card">
            <p className="text-muted-foreground">Paramètres généraux à venir</p>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="rounded-md border p-6 bg-card">
            <p className="text-muted-foreground">Paramètres des actions commerciales à venir</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
