
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AddEventModal from "@/components/calendar/AddEventModal";
import EventDetailsModal from "@/components/calendar/EventDetailsModal";
import { Badge } from "@/components/ui/badge";

// Mock event types with colors
export const eventTypes = [
  { id: "projet", name: "Projet", color: "bg-terracotta text-white" },
  { id: "vente", name: "Vente", color: "bg-ocre text-white" },
  { id: "prospection", name: "Prospection", color: "bg-dark-gray text-white" },
  { id: "relance", name: "Relance", color: "bg-charcoal text-white" },
  { id: "autre", name: "Autre", color: "bg-light-gray text-dark-gray" }
];

// Mock projects for selection
const mockProjects = [
  { id: 1, name: "Rénovation Appartement Dupont" },
  { id: 2, name: "Construction Villa Martin" },
  { id: 3, name: "Design Intérieur Bureau Société XYZ" },
  { id: 4, name: "Extension Maison Lefevre" }
];

// Mock calendar events
export const mockEvents = [
  {
    id: 1,
    title: "Début projet Villa Martin",
    date: new Date(2025, 4, 15), // May 15, 2025
    eventType: "projet",
    projectId: 2,
    notes: "Première réunion de lancement sur le site"
  },
  {
    id: 2,
    title: "Signature contrat Dupont",
    date: new Date(2025, 4, 12), // May 12, 2025
    eventType: "vente",
    projectId: 1,
    notes: "Signature des documents finaux"
  },
  {
    id: 3,
    title: "Prospection nouveaux clients",
    date: new Date(2025, 4, 20), // May 20, 2025
    eventType: "prospection",
    notes: "Rendez-vous salon immobilier"
  }
];

export type Event = {
  id: number;
  title: string;
  date: Date;
  eventType: string;
  projectId?: number;
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
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedView, setSelectedView] = useState<"month" | "week">("month");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const handleSaveEvent = (eventData: Omit<Event, "id">) => {
    const newEvent = {
      ...eventData,
      id: events.length + 1
    };
    
    setEvents([...events, newEvent]);
    setShowAddModal(false);
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
  
  const getProjectName = (projectId?: number): string => {
    if (!projectId) return "Aucun projet lié";
    const project = mockProjects.find(p => p.id === projectId);
    return project?.name || "Projet inconnu";
  };

  // Helper function to format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
          <Button onClick={() => setShowAddModal(true)}>
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
                        <Badge className={getEventTypeColor(event.eventType)}>
                          {eventTypes.find(type => type.id === event.eventType)?.name}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(event.date)} - {getProjectName(event.projectId)}
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
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.eventType)}`} />
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </p>
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
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveEvent}
        eventTypes={eventTypes}
        projects={mockProjects}
      />
      
      {selectedEvent && (
        <EventDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          event={selectedEvent}
          eventTypes={eventTypes}
          projects={mockProjects}
        />
      )}
    </div>
  );
};

export default CalendarPage;
