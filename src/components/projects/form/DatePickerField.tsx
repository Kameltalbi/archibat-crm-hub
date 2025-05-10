
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DatePickerFieldProps {
  id: string;
  label: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
  required?: boolean;
}

const DatePickerField = ({ 
  id, 
  label, 
  value, 
  onChange, 
  required 
}: DatePickerFieldProps) => {
  // Initialiser le mois du calendrier avec la date actuelle si aucune valeur n'est fournie
  const [calendarMonth, setCalendarMonth] = useState<Date>(value || new Date());

  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && "*"}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? (
              format(value, "dd MMMM yyyy", { locale: fr })
            ) : (
              <span>Sélectionner une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            className="pointer-events-auto"
            locale={fr}
            fromDate={new Date(2000, 0, 1)}
            captionLayout="dropdown-buttons"
            showOutsideDays={true}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
