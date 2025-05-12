
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event, EventType } from "@/pages/Calendar";

interface UpcomingEventsProps {
  events: Event[];
  eventTypes: EventType[];
  onEventClick: (event: Event) => void;
  onEditEvent: (event: Event, e: React.MouseEvent) => void;
  onDeleteEvent: (eventId: number, e: React.MouseEvent) => void;
}

const UpcomingEvents = ({ 
  events, 
  eventTypes, 
  onEventClick, 
  onEditEvent, 
  onDeleteEvent 
}: UpcomingEventsProps) => {
  
  const getEventTypeColor = (typeId: string): string => {
    const eventType = eventTypes.find(type => type.id === typeId);
    return eventType?.color || "bg-light-gray";
  };
  
  // Helper function to format date
  const formatDate = (date: Date): string => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };
  
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);
  
  return (
    <Card className="h-fit animate-fade-in">
      <CardHeader>
        <CardTitle>Prochains événements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="p-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.eventType)}`} />
                  <div>
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => onEditEvent(event, e)}
                    className="h-6 w-6"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => onDeleteEvent(event.id, e)}
                    className="h-6 w-6 text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {upcomingEvents.length === 0 && (
            <p className="text-sm text-muted-foreground">Aucun événement à venir</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
