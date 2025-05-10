
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, User } from "lucide-react";
import EventNotifications from "@/components/calendar/EventNotifications";
import { mockEvents, eventTypes } from "@/pages/Calendar";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";

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
  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };
  
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center">
        {isMobile && <SidebarTrigger className="mr-4 text-foreground" />}
        <div className="relative max-w-xs hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8 bg-background border-light-gray"
          />
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
