
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Calendar, Clock, User } from "lucide-react";
import EventNotifications from "@/components/calendar/EventNotifications";
import { eventTypes } from "@/pages/Calendar";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import { format } from "date-fns";

// Since mockEvents was removed, we should remove any dependencies on it
// Here, I'm creating a minimal type setup based on existing types
type Event = {
  id: number;
  title: string;
  date: Date;
  eventType: string;
  projectId?: number;
  notes?: string;
};

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  
  // Since we don't have mockEvents anymore, we'll use an empty array
  const upcomingEvents: Event[] = [];
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
    setShowNotifications(false);
  };
  
  // Replace with your actual user info
  const userName = "Utilisateur";
  const userInitial = userName.charAt(0);

  return (
    <header className="border-b bg-background sticky top-0 z-10 py-3 px-4 md:px-6 flex items-center justify-between">
      <div className="flex-1">
        {/* Left side content - can be added later */}
      </div>
      
      <div className="flex items-center space-x-3">
        <Popover open={showNotifications} onOpenChange={setShowNotifications}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
            >
              <Bell className="h-[1.2rem] w-[1.2rem]" />
              {upcomingEvents.length > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta"></span>
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            <EventNotifications 
              events={upcomingEvents}
              onEventClick={handleEventClick}
            />
          </PopoverContent>
        </Popover>

        <Avatar className="cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback className="bg-terracotta text-white">{userInitial}</AvatarFallback>
        </Avatar>
      </div>

      {selectedEvent && (
        <EventDetailsModal
          isOpen={showEventDetails}
          onClose={() => setShowEventDetails(false)}
          event={selectedEvent}
          eventTypes={eventTypes}
          projects={[]}  // Since mockProjects was also removed
        />
      )}
    </header>
  );
};

export default Header;
