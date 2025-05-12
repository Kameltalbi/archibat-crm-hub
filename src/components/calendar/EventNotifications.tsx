
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Event, EventType } from "@/pages/Calendar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventNotificationsProps {
  events: Event[];
  eventTypes: EventType[];
  onEventClick: (event: Event) => void;
}

const EventNotifications = ({ events, eventTypes, onEventClick }: EventNotificationsProps) => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const { toast } = useToast();
  
  // Filter events that are upcoming (next 7 days)
  useEffect(() => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const upcoming = events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setUpcomingEvents(upcoming);
    
    // Check for events happening soon (within an hour)
    const soon = events.filter(event => {
      const eventDate = new Date(event.date);
      const hourFromNow = new Date();
      hourFromNow.setHours(hourFromNow.getHours() + 1);
      
      return eventDate >= now && eventDate <= hourFromNow;
    });
    
    // Show toast notifications for events happening within the hour
    soon.forEach(event => {
      toast({
        title: "Événement imminent",
        description: `${event.title} - ${formatDate(new Date(event.date))}`,
        duration: 5000
      });
    });
  }, [events, toast]);
  
  const getEventType = (typeId: string) => {
    return eventTypes.find(type => type.id === typeId) || { id: "", name: "Inconnu", color: "bg-gray-400" };
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return format(date, "d MMM HH:mm", { locale: fr });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {upcomingEvents.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-terracotta text-white">
              {upcomingEvents.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[300px]">
        <DropdownMenuGroup>
          {upcomingEvents.length > 0 ? (
            <>
              <div className="p-2 text-sm font-medium">Événements à venir</div>
              {upcomingEvents.slice(0, 5).map(event => {
                const eventType = getEventType(event.eventType);
                return (
                  <DropdownMenuItem key={event.id} onClick={() => onEventClick(event)} className="cursor-pointer">
                    <div className="flex flex-col w-full">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{event.title}</span>
                        <Badge className={`${eventType.color} text-xs`}>
                          {eventType.name}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(new Date(event.date))}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </>
          ) : (
            <div className="p-3 text-center text-sm text-muted-foreground">
              Aucun événement à venir cette semaine
            </div>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventNotifications;
