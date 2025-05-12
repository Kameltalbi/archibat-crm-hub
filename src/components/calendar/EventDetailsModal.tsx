
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event, EventType } from "@/pages/Calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  eventTypes: EventType[];
  projects?: { id: number; name: string }[];
}

const EventDetailsModal = ({ isOpen, onClose, event, eventTypes }: EventDetailsModalProps) => {
  const getEventType = (typeId: string) => {
    return eventTypes.find(type => type.id === typeId) || { id: "", name: "Inconnu", color: "bg-gray-400" };
  };
  
  const eventType = getEventType(event.eventType);
  
  // Format date
  const formatDate = (date: Date): string => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            <Badge className={eventType.color}>{eventType.name}</Badge>
          </div>
          
          <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            <span>{formatDate(new Date(event.date))}</span>
          </div>
          
          {event.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1 text-muted-foreground">Notes</h4>
              <p className="text-sm whitespace-pre-line">{event.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsModal;
