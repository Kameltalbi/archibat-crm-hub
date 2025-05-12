
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event, EventType } from "@/pages/Calendar";

interface CalendarViewProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  eventsForSelectedDate: Event[];
  eventTypes: EventType[];
  onEventClick: (event: Event) => void;
  onEditEvent: (event: Event, e: React.MouseEvent) => void;
  onDeleteEvent: (eventId: number, e: React.MouseEvent) => void;
}

const CalendarView = ({
  selectedDate,
  onSelectDate,
  eventsForSelectedDate,
  eventTypes,
  onEventClick,
  onEditEvent,
  onDeleteEvent
}: CalendarViewProps) => {
  
  const getEventTypeColor = (typeId: string): string => {
    const eventType = eventTypes.find(type => type.id === typeId);
    return eventType?.color || "bg-light-gray";
  };
  
  // Helper function to format date
  const formatDate = (date: Date): string => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };
  
  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md border shadow-sm p-3 pointer-events-auto w-full max-w-[600px]"
          showOutsideDays
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">
          Événements du {selectedDate ? formatDate(selectedDate) : "jour"}
        </h3>
        
        {eventsForSelectedDate.length > 0 ? (
          <div className="space-y-3">
            {eventsForSelectedDate.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="p-3 border rounded-md cursor-pointer hover:bg-accent transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={getEventTypeColor(event.eventType)}>
                      {eventTypes.find(type => type.id === event.eventType)?.name}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => onEditEvent(event, e)}
                      className="h-6 w-6"
                    >
                      <Edit className="h-3 w-3" />
                      <span className="sr-only">Modifier</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => onDeleteEvent(event.id, e)}
                      className="h-6 w-6 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(event.date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="default" className="bg-beige border-terracotta/20">
            <AlertDescription>
              Aucun événement prévu pour cette journée
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
