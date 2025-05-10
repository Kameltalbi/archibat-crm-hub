
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Mail, Phone, FileText } from "lucide-react";
import { Client } from "@/lib/supabase";
import { format } from "date-fns";

interface ClientInfoProps {
  client: Client;
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
  return (
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
  );
};
