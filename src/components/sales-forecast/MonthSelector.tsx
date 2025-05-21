
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  onMonthChange: (month: number, year: number) => void;
  showMonthDropdown?: boolean;
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  currentMonth,
  currentYear,
  onMonthChange,
  showMonthDropdown = false,
}) => {
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const handlePreviousMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    
    onMonthChange(newMonth, newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    
    onMonthChange(newMonth, newYear);
  };

  const handleMonthSelect = (value: string) => {
    const month = parseInt(value, 10);
    onMonthChange(month, currentYear);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handlePreviousMonth}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {showMonthDropdown ? (
        <Select 
          value={currentMonth.toString()} 
          onValueChange={handleMonthSelect}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder={monthNames[currentMonth - 1]} />
          </SelectTrigger>
          <SelectContent>
            {monthNames.map((month, index) => (
              <SelectItem key={index} value={(index + 1).toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-lg font-medium min-w-32 text-center">
          {monthNames[currentMonth - 1]} {currentYear}
        </div>
      )}
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleNextMonth}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
