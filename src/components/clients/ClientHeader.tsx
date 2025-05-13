
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/lib/supabase";

interface ClientHeaderProps {
  client: Client | null;
}

export const ClientHeader = ({ client }: ClientHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
      <div>
        <Button variant="outline" asChild>
          <Link to="/dashboard/clients" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Retour aux clients
          </Link>
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-semibold">{client?.name}</h1>
      </div>
    </div>
  );
};
