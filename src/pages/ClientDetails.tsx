
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClientHeader } from "@/components/clients/ClientHeader";
import { ClientInfo } from "@/components/clients/ClientInfo";
import { ClientContacts } from "@/components/clients/ClientContacts";
import { ClientRevenue } from "@/components/clients/ClientRevenue";
import { useClientDetails } from "@/hooks/useClientDetails";
import { ArrowLeft } from "lucide-react";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { client, isLoading, yearRevenue } = useClientDetails(id);
  
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
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
          <div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/clients" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Retour aux clients
              </Link>
            </Button>
          </div>
        </div>
        <div className="pt-6">
          <p>Client non trouvé.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <ClientHeader client={client} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ClientInfo client={client} />
          <ClientContacts client={client} />
        </div>
        
        <div>
          <ClientRevenue yearRevenue={yearRevenue} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
