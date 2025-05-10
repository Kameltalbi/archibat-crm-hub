
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { Client } from "@/lib/supabase";

interface ClientContactsProps {
  client: Client;
}

export const ClientContacts = ({ client }: ClientContactsProps) => {
  return (
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
  );
};
