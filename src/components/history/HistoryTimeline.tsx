
import { format } from "date-fns";
import { ActivitySquare, CheckCircle, FileBox, MessageCircle, Phone } from "lucide-react";

export type HistoryItemType = 'modification' | 'document' | 'call' | 'meeting' | 'note';

export interface HistoryItem {
  id: string;
  type: HistoryItemType;
  date: string;
  title: string;
  description?: string;
  user?: string;
}

interface HistoryTimelineProps {
  items: HistoryItem[];
  emptyMessage?: string;
}

export const HistoryTimeline = ({ items, emptyMessage = "Aucun historique disponible" }: HistoryTimelineProps) => {
  // Early return if no items
  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Get icon based on item type
  const getIcon = (type: HistoryItemType) => {
    switch (type) {
      case 'modification':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'document':
        return <FileBox className="h-5 w-5 text-orange-500" />;
      case 'call':
        return <Phone className="h-5 w-5 text-blue-500" />;
      case 'meeting':
        return <ActivitySquare className="h-5 w-5 text-emerald-500" />;
      case 'note':
        return <MessageCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <ActivitySquare className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-muted bg-background">
              {getIcon(item.type)}
            </div>
            {index < items.length - 1 && (
              <div className="w-px grow bg-muted my-1"></div>
            )}
          </div>
          <div className="space-y-1 pt-1 pb-4">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">{item.title}</h4>
              <span className="text-xs text-muted-foreground">{format(new Date(item.date), "dd/MM/yyyy à HH:mm")}</span>
            </div>
            {item.description && (
              <p className="text-sm text-muted-foreground">{item.description}</p>
            )}
            {item.user && (
              <p className="text-xs text-muted-foreground">Par {item.user}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
