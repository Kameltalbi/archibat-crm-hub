
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Home,
  Users,
  Briefcase,
  Package,
  ListFilter,
  Calendar as CalendarIcon,
  Settings as SettingsIcon,
  Book,
  LineChart,
  Wallet,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";

const Sidebar = () => {
  const location = useLocation();
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Déterminer l'élément de menu actif en fonction de l'URL
    const path = location.pathname;
    const menuItem = menuItems.find(item => item.path === path || path.startsWith(item.path + '/'));
    setActiveItem(menuItem ? menuItem.id : null);

    // Forcer la sidebar en mode replié au chargement
    setOpen(false);
  }, [location, setOpen]);

  const handleItemClick = (id: number) => {
    setActiveItem(id);
    setOpenMobile(false); // Ferme la sidebar après avoir cliqué sur un élément (sur mobile)
  };

  const menuItems = [
    { id: 1, title: "Tableau de bord", icon: <Home size={18} />, path: "/dashboard" },
    { id: 2, title: "Clients", icon: <Users size={18} />, path: "/dashboard/clients" },
    { id: 3, title: "Projets", icon: <Briefcase size={18} />, path: "/dashboard/projects" },
    { id: 4, title: "Produits", icon: <Package size={18} />, path: "/dashboard/products" },
    { id: 5, title: "Catégories", icon: <ListFilter size={18} />, path: "/dashboard/categories" },
    { id: 6, title: "Plan de trésorerie", icon: <LineChart size={18} />, path: "/dashboard/treasury-plan" },
    { id: 7, title: "Dépenses", icon: <Wallet size={18} />, path: "/dashboard/expenses" },
    { id: 8, title: "Calendrier", icon: <CalendarIcon size={18} />, path: "/dashboard/calendar" },
    { id: 9, title: "Congés", icon: <Briefcase size={18} />, path: "/dashboard/leaves" },
    { id: 10, title: "Paramètres", icon: <SettingsIcon size={18} />, path: "/dashboard/settings" },
    { id: 11, title: "Documentation", icon: <Book size={18} />, path: "/dashboard/documentation" },
  ];

  return (
    <>
      {/* Mobile menu */}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-0 data-[state=open]:bg-transparent focus:bg-transparent hover:bg-transparent md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 border-r md:hidden">
          <SheetHeader className="text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Naviguez à travers les différentes sections de l'application.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-2.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline text-white ${
                  activeItem === item.id
                    ? "font-bold text-primary underline underline-offset-4"
                    : "text-white"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                {item.icon}
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop menu */}
      <div 
        className="hidden border-r bg-sidebar h-full md:block transition-all duration-300 ease-in-out"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex flex-col space-y-2 h-full ${isHovered ? 'w-64' : 'w-16'} transition-all duration-300`}>
          <Separator className="my-4" />
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={`flex items-center ${isHovered ? 'justify-start' : 'justify-center'} rounded-md p-2 text-sm font-medium hover:bg-sidebar-accent ${
                  activeItem === item.id
                    ? "bg-sidebar-accent text-white font-semibold"
                    : "text-white"
                } transition-all duration-300`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-center">
                  <div className="text-white">{item.icon}</div>
                  {isHovered && <span className="ml-2 text-white">{item.title}</span>}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
