
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";
import { SaleFormData } from "./form/types";
import { Dispatch, SetStateAction } from "react";

// Créer un type union pour supporter à la fois l'utilisation basée sur un formulaire et une gestion d'état directe
export type DatePickerFieldProps = 
  | {
      form: UseFormReturn<SaleFormData>;
      name: string;
      label: string;
      date?: never;
      onDateChange?: never;
    }
  | {
      form?: never;
      name?: never;
      date: Date;
      onDateChange: Dispatch<SetStateAction<Date>>;
      label: string;
    };

const DatePickerField = (props: DatePickerFieldProps) => {
  // Si un formulaire est fourni, utiliser l'intégration react-hook-form
  if ('form' in props && props.form) {
    const { form, name, label } = props;
    return (
      <FormField
        control={form.control}
        name={name as any}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date)}
                  locale={fr}
                  className="pointer-events-auto"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  } 
  // Sinon utiliser la gestion d'état directe
  else {
    const { date, onDateChange, label } = props;
    return (
      <div className="grid w-full items-center gap-2">
        <label className="text-sm font-medium leading-none">{label}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? (
                format(date, "PP", { locale: fr })
              ) : (
                <span>Sélectionner une date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && onDateChange(newDate)}
              locale={fr}
              className="pointer-events-auto"
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
};

export default DatePickerField;
