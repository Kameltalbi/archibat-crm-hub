
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, User } from "lucide-react";

const Header = () => {
  const isMobile = useIsMobile();
  
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
        <Button variant="outline" size="icon" className="text-muted-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon" className="text-muted-foreground">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
