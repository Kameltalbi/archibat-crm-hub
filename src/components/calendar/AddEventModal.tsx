
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EventType, Event } from "@/pages/Calendar";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
  eventTypes: EventType[];
  initialData?: Event | null;
}

const AddEventModal = ({ isOpen, onClose, onSave, eventTypes, initialData }: AddEventModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventType, setEventType] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Initialize form with event data when editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDate(new Date(initialData.date));
      setEventType(initialData.eventType);
      setNotes(initialData.notes || "");
    }
  }, [initialData]);
  
  const handleSubmit = () => {
    // Validate form
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "Le titre est requis";
    }
    
    if (!date) {
      newErrors.date = "La date est requise";
    }
    
    if (!eventType) {
      newErrors.eventType = "Le type d'événement est requis";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Form is valid, save event
    onSave({
      title,
      date,
      eventType,
      notes: notes || undefined
    });
    
    // Reset form
    resetForm();
  };
  
  const resetForm = () => {
    setTitle("");
    setDate(new Date());
    setEventType("");
    setNotes("");
    setErrors({});
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre de l'événement*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Réunion de projet"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    errors.date && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd MMMM yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="eventType">Type d'événement*</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger id="eventType" className={errors.eventType ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                      <span>{type.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && <p className="text-sm text-destructive">{errors.eventType}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations supplémentaires..."
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Annuler</Button>
          <Button onClick={handleSubmit}>
            {initialData ? "Mettre à jour" : "Enregistrer l'événement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventModal;
