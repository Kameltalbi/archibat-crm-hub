import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Edit, Trash2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddEventModal from "@/components/calendar/AddEventModal";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  
  const getEventTypeColor = (typeId: string): string => {
    const eventType = eventTypes.find(type => type.id === typeId);
    return eventType?.color || "bg-light-gray";
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="space-y-8">
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
            onClick={() => setSelectedView("month")}
            className="text-charcoal"
          >
            Mensuel
          </Button>
          <Button
            variant={selectedView === "week" ? "default" : "outline"}
            onClick={() => setSelectedView("week")}
            className="text-charcoal"
          >
            Hebdomadaire
          </Button>
          <Button onClick={() => {
            setEventToEdit(null);
            setShowAddModal(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un événement
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Calendrier</span>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border shadow-sm p-3 pointer-events-auto"
                showOutsideDays
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">
                Événements du {selectedDate ? formatDate(selectedDate) : "jour"}
              </h3>
              
              {eventsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {eventsForSelectedDate.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
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
                            onClick={(e) => handleEditEvent(event, e)}
                            className="h-6 w-6"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => handleDeleteEvent(event.id, e)}
                            className="h-6 w-6 text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="h-3 w-3" />
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
          </CardContent>
        </Card>
        
        <Card className="h-fit animate-fade-in">
          <CardHeader>
            <CardTitle>Prochains événements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
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
                          onClick={(e) => handleEditEvent(event, e)}
                          className="h-6 w-6"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => handleDeleteEvent(event.id, e)}
                          className="h-6 w-6 text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

              {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                <p className="text-sm text-muted-foreground">Aucun événement à venir</p>
              )}
            </div>
          </CardContent>
        </Card>
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
