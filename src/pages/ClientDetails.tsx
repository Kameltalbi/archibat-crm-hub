
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Phone, Mail, Building, FileText, User } from "lucide-react";
import { Client } from "@/lib/supabase";
import { clientService } from "@/services/clientService";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [yearRevenue, setYearRevenue] = useState<number | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Récupérer les détails du client
        const clientData = await clientService.getClientById(id);
        setClient(clientData);
        
        // Récupérer le CA de l'année en cours
        const revenue = await clientService.getClientYearRevenue(id);
        setYearRevenue(revenue);
      } catch (error) {
        console.error("Erreur lors du chargement des détails du client:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les détails du client."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des données...</p>
      </div>
    );
  }
  
  if (!client) {
    return (
      <div className="space-y-4">
        <Button variant="outline" asChild>
          <Link to="/clients" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour aux clients
          </Link>
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p>Client non trouvé.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <Button variant="outline" asChild>
            <Link to="/clients" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Retour aux clients
            </Link>
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">{client.name}</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails du client</CardTitle>
              <CardDescription>
                Informations de base du client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nom</p>
                      <p className="font-medium">{client.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{client.email || "Non renseigné"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{client.phone || "Non renseigné"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Numéro TVA</p>
                      <p className="font-medium">{client.vat_code || "Non renseigné"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{client.address || "Non renseignée"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Client depuis</p>
                    <p className="font-medium">{format(new Date(client.created_at), 'dd/MM/yyyy')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>
                Personnes à contacter chez ce client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(client.contact1_name || client.contact2_name) ? (
                <div className="space-y-6">
                  {client.contact1_name && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{client.contact1_name}</h3>
                          <p className="text-sm text-muted-foreground">{client.contact1_position || "Poste non renseigné"}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{client.contact1_email || "Non renseigné"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p>{client.contact1_phone || "Non renseigné"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {client.contact1_name && client.contact2_name && <Separator />}
                  
                  {client.contact2_name && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">{client.contact2_name}</h3>
                          <p className="text-sm text-muted-foreground">{client.contact2_position || "Poste non renseigné"}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{client.contact2_email || "Non renseigné"}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Téléphone</p>
                          <p>{client.contact2_phone || "Non renseigné"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun contact renseigné</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chiffre d'affaires</CardTitle>
              <CardDescription>
                CA de l'année {currentYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">
                  {yearRevenue !== null 
                    ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(yearRevenue)
                    : "Calcul..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
