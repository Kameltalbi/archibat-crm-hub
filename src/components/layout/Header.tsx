
import React from "react";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import MobileNavigation from "./MobileNavigation";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-background border-b h-16 sticky top-0 z-30 flex items-center px-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <MobileNavigation />
        </div>
        <div className="flex items-center space-x-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Bell className="h-5 w-5" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 w-[300px]">
                    <p className="text-sm font-medium mb-2">Notifications</p>
                    <p className="text-sm text-muted-foreground">Aucune notification</p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
