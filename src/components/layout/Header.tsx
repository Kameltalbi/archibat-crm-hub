
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Clock, User } from "lucide-react";
import EventNotifications from "@/components/calendar/EventNotifications";
import { mockEvents, eventTypes } from "@/pages/Calendar";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import { format } from "date-fns";

// Mock projects for selection
const mockProjects = [
  { id: 1, name: "Rénovation Appartement Dupont" },
  { id: 2, name: "Construction Villa Martin" },
  { id: 3, name: "Design Intérieur Bureau Société XYZ" },
  { id: 4, name: "Extension Maison Lefevre" }
];

const Header = () => {
  const isMobile = useIsMobile();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {isMobile && <SidebarTrigger className="mr-4 text-foreground" />}
        <div className="flex items-center text-muted-foreground gap-1 md:gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{format(currentDateTime, 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex items-center gap-1 ml-3">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{format(currentDateTime, 'HH:mm')}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <EventNotifications 
          events={mockEvents}
          eventTypes={eventTypes}
          onEventClick={handleEventClick}
          projects={mockProjects}
        />
        <Button variant="outline" size="icon" className="text-muted-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
      
      {selectedEvent && (
        <EventDetailsModal
          isOpen={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          event={selectedEvent}
          eventTypes={eventTypes}
          projects={mockProjects}
        />
      )}
    </header>
  );
};

export default Header;
