
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Trash, FileSpreadsheet } from "lucide-react";
import AddClientModal from "@/components/clients/AddClientModal";
import { clientService } from "@/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/supabase";
import ImportClientsModal from "@/components/clients/ImportClientsModal";
import EditClientModal from "@/components/clients/EditClientModal";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les clients. Veuillez réessayer."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteClient = async (id: string, event: React.MouseEvent) => {
    // Empêcher la propagation de l'événement pour éviter la navigation
    event.stopPropagation();
    
    try {
      const success = await clientService.deleteClient(id);
        
      if (success) {
        setClients(clients.filter(client => client.id !== id));
        toast({
          title: "Client supprimé",
          description: "Le client a été supprimé avec succès."
        });
      } else {
        throw new Error("Échec de la suppression");
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le client. Veuillez réessayer."
      });
    }
  };
  
  const handleRowClick = (id: string) => {
    navigate(`/dashboard/clients/${id}`);
  };
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Clients</h1>
          <p className="text-muted-foreground">
            Gérez vos clients et leurs informations
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setImportModalOpen(true)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Importer
          </Button>
          <AddClientModal onClientAdded={fetchClients} />
        </div>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            {filteredClients.length} clients au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                  <TableHead className="hidden md:table-cell">Adresse</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Chargement des données...
                    </TableCell>
                  </TableRow>
                ) : filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow 
                      key={client.id} 
                      className="cursor-pointer hover:bg-muted/60"
                      onClick={() => handleRowClick(client.id)}
                    >
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.phone || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.address || '-'}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <EditClientModal 
                            client={client} 
                            onClientUpdated={fetchClients}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive"
                            onClick={(e) => handleDeleteClient(client.id, e)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <ImportClientsModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen}
        onClientsImported={fetchClients}
      />
    </div>
  );
};

export default Clients;
