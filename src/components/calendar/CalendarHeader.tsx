
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CalendarHeaderProps {
  selectedView: "month" | "week";
  onViewChange: (view: "month" | "week") => void;
  onAddEvent: () => void;
}

const CalendarHeader = ({ selectedView, onViewChange, onAddEvent }: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Calendrier</h1>
        <p className="text-muted-foreground">
          Gestion des événements et rendez-vous
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant={selectedView === "month" ? "default" : "outline"}
          onClick={() => onViewChange("month")}
          className="text-charcoal"
        >
          Mensuel
        </Button>
        <Button
          variant={selectedView === "week" ? "default" : "outline"}
          onClick={() => onViewChange("week")}
          className="text-charcoal"
        >
          Hebdomadaire
        </Button>
        <Button onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
