import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash } from "lucide-react";
import AddClientModal from "@/components/clients/AddClientModal";

const clients = [
  {
    id: 1,
    name: "Groupe Durand",
    email: "contact@durand-groupe.com",
    phone: "04 91 XX XX XX",
    address: "13 Rue République, 13001 Marseille",
    projects: 4,
  },
  {
    id: 2,
    name: "SCI Bartoli",
    email: "info@sci-bartoli.fr",
    phone: "04 42 XX XX XX",
    address: "45 Avenue Prado, 13008 Marseille",
    projects: 2,
  },
  {
    id: 3,
    name: "Cabinet Martin & Associés",
    email: "cabinet@martin-associes.com",
    phone: "04 91 XX XX XX",
    address: "8 Place Castellane, 13006 Marseille",
    projects: 3,
  },
  {
    id: 4,
    name: "Immobilier Côté Sud",
    email: "contact@immocotesud.fr",
    phone: "04 42 XX XX XX",
    address: "22 Cours Mirabeau, 13100 Aix-en-Provence",
    projects: 2,
  },
  {
    id: 5,
    name: "Fondation Meyers",
    email: "admin@fondation-meyers.org",
    phone: "04 91 XX XX XX",
    address: "120 Boulevard Michelet, 13009 Marseille",
    projects: 1,
  },
  {
    id: 6,
    name: "Lyon Architectes",
    email: "info@lyon-archi.com",
    phone: "04 72 XX XX XX",
    address: "5 Place Bellecour, 69002 Lyon",
    projects: 0,
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        <AddClientModal />
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
                  <TableHead>Projets</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.address}</TableCell>
                    <TableCell>{client.projects}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredClients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
