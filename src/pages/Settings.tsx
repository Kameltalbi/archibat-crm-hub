
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersPage from "@/components/settings/UsersPage";
import { Shield } from "lucide-react";

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
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-4">
          <UsersPage />
        </TabsContent>
        
        <TabsContent value="general">
          <div className="rounded-md border p-6 bg-card">
            <p className="text-muted-foreground">Paramètres généraux à venir</p>
          </div>
        </TabsContent>
        
        <TabsContent value="billing">
          <div className="rounded-md border p-6 bg-card">
            <p className="text-muted-foreground">Paramètres de facturation à venir</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
