
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddEventModal from "@/components/calendar/AddEventModal";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarView from "@/components/calendar/CalendarView";
import UpcomingEvents from "@/components/calendar/UpcomingEvents";

// Types d'événements avec couleurs
export const eventTypes = [
  { id: "projet", name: "Projet", color: "bg-terracotta text-white" },
  { id: "vente", name: "Vente", color: "bg-ocre text-white" },
  { id: "prospection", name: "Prospection", color: "bg-dark-gray text-white" },
  { id: "relance", name: "Relance", color: "bg-charcoal text-white" },
  { id: "autre", name: "Autre", color: "bg-light-gray text-dark-gray" }
];

// Types pour les événements, projets et types d'événements
export type Event = {
  id: number;
  title: string;
  date: Date;
  eventType: string;
  notes?: string;
};

export type EventType = {
  id: string;
  name: string;
  color: string;
};

export type Project = {
  id: number;
  name: string;
};

const CalendarPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week">("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  
  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    // Si nous sommes en train d'éditer un événement existant
    if (eventToEdit) {
      const updatedEvents = events.map(event => 
        event.id === eventToEdit.id ? { ...eventData, id: event.id } : event
      );
      setEvents(updatedEvents);
      setEventToEdit(null);
    } else {
      // Sinon, créer un nouvel événement
      const newEvent = {
        ...eventData,
        id: events.length + 1
      };
      setEvents([...events, newEvent]);
    }
    setShowAddModal(false);
  };
  
  const handleEditEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToEdit(event);
    setShowAddModal(true);
  };
  
  const handleDeleteEvent = (eventId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvents(events.filter(event => event.id !== eventId));
  };
  
  const eventsForSelectedDate = events.filter(event => {
    if (!selectedDate) return false;
    
    const eventDate = new Date(event.date);
    return eventDate.getDate() === selectedDate.getDate() && 
           eventDate.getMonth() === selectedDate.getMonth() && 
           eventDate.getFullYear() === selectedDate.getFullYear();
  });
  
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-8">
      <CalendarHeader 
        selectedView={selectedView}
        onViewChange={setSelectedView}
        onAddEvent={() => {
          setEventToEdit(null);
          setShowAddModal(true);
        }}
      />
      
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Calendrier</span>
              <CalendarView 
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                eventsForSelectedDate={eventsForSelectedDate}
                eventTypes={eventTypes}
                onEventClick={handleEventClick}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarView 
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              eventsForSelectedDate={eventsForSelectedDate}
              eventTypes={eventTypes}
              onEventClick={handleEventClick}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          </CardContent>
        </Card>
        
        <UpcomingEvents
          events={events}
          eventTypes={eventTypes}
          onEventClick={handleEventClick}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </div>
      
      {/* Modals */}
      <AddEventModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveEvent}
        eventTypes={eventTypes}
      />
      
      {selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          event={selectedEvent}
          eventTypes={eventTypes}
        />
      )}
    </div>
  );
};

export default CalendarPage;
