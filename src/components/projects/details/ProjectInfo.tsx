
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "./types";

interface ProjectInfoProps {
  clients: Client[];
  status: string;
}

export const ProjectInfo = ({ clients, status }: ProjectInfoProps) => {
  return (
    <>
      <h3 className="text-lg font-medium mb-2 text-charcoal dark:text-light-gray">Informations</h3>
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client(s)</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {clients.map((client) => (
                  <span
                    key={client.id}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs"
                  >
                    {client.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p>{status}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
