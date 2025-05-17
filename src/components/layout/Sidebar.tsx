
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
  LayoutDashboard,
  Users,
  Folder,
  Package,
  Calendar,
  Settings,
  Book,
  BarChart3,
  Wallet,
  UserCog,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Define a proper type for menu items
interface MenuItem {
  id: number;
  title: string;
  icon: React.ReactNode;
  path: string;
  hasSubItems?: boolean;
  subItems?: MenuItem[];
  section?: string;
}

interface MenuSection {
  id: string;
  title: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const location = useLocation();
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Déterminer l'élément de menu actif en fonction de l'URL
    const path = location.pathname;
    const menuItem = menuSections.flatMap(section => section.items).find(item => 
      (item.path && (item.path === path || path.startsWith(item.path + '/'))) ||
      (item.subItems && item.subItems.some(subItem => 
        subItem.path === path || path.startsWith(subItem.path + '/')
      ))
    );
    setActiveItem(menuItem ? menuItem.id : null);

    // Forcer la sidebar en mode replié au chargement
    setOpen(false);
  }, [location, setOpen]);

  const handleItemClick = (id: number) => {
    setActiveItem(id);
    setOpenMobile(false); // Ferme la sidebar après avoir cliqué sur un élément (sur mobile)
  };

  // Define menu sections with items
  const menuSections: MenuSection[] = [
    {
      id: "overview",
      title: "Vue globale",
      items: [
        { id: 1, title: "Tableau de bord", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
        { id: 7, title: "Prévisions des ventes", icon: <BarChart3 size={18} />, path: "/dashboard/sales-forecast" },
        { id: 5, title: "Plan de trésorerie", icon: <Wallet size={18} />, path: "/dashboard/treasury-plan" }
      ]
    },
    {
      id: "activities",
      title: "Gestion des activités",
      items: [
        { id: 2, title: "Clients", icon: <Users size={18} />, path: "/dashboard/clients" },
        { id: 3, title: "Projets", icon: <Folder size={18} />, path: "/dashboard/projects" },
        { id: 4, title: "Produits/Services", icon: <Package size={18} />, path: "/dashboard/products" },
        { id: 6, title: "Dépenses", icon: <Wallet size={18} />, path: "/dashboard/expenses" },
        { id: 8, title: "Calendrier", icon: <Calendar size={18} />, path: "/dashboard/calendar" }
      ]
    },
    {
      id: "hr",
      title: "Ressources humaines",
      items: [
        { id: 9, title: "Congés", icon: <UserCog size={18} />, path: "/dashboard/leaves" }
      ]
    },
    {
      id: "settings",
      title: "Réglages & support",
      items: [
        { id: 10, title: "Paramètres", icon: <Settings size={18} />, path: "/dashboard/settings" },
        { id: 11, title: "Documentation", icon: <Book size={18} />, path: "/dashboard/documentation" }
      ]
    }
  ];

  // Render a menu item or submenu
  const renderMenuItem = (item: MenuItem) => {
    if (item.hasSubItems) {
      return (
        <li key={item.id} className="group/menu-item relative">
          <Collapsible
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button
                className={`flex w-full items-center justify-between rounded-md p-2 text-sm font-medium hover:bg-sidebar-accent text-white ${
                  activeItem === item.id ? "bg-sidebar-accent text-white font-semibold" : "text-white"
                }`}
              >
                <div className="flex items-center">
                  {item.icon}
                  {isHovered && <span className="ml-2 text-white">{item.title}</span>}
                </div>
                {isHovered && <ChevronRight className={`h-4 w-4 transform transition-transform ${false ? 'rotate-90' : ''}`} />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {isHovered && item.subItems?.map((subItem: MenuItem) => (
                <NavLink
                  key={subItem.id}
                  to={subItem.path}
                  className={({ isActive }) => `flex items-center pl-8 py-2 text-sm font-medium hover:bg-sidebar-accent ${
                    isActive ? "bg-sidebar-accent/50 text-white font-semibold" : "text-white"
                  }`}
                  onClick={() => handleItemClick(subItem.id)}
                >
                  <span>{subItem.title}</span>
                </NavLink>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </li>
      );
    } else {
      return (
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
      );
    }
  };

  const renderSectionItems = (section: MenuSection) => {
    return (
      <div key={section.id} className="mb-4">
        {isHovered && (
          <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
            {section.title}
          </div>
        )}
        <div className="flex flex-col space-y-1">
          {section.items.map(item => renderMenuItem(item))}
        </div>
        {isHovered && <Separator className="my-2 bg-gray-700" />}
      </div>
    );
  };

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
        <SheetContent side="left" className="w-3/4 border-r md:hidden bg-sidebar">
          <SheetHeader className="text-left">
            <SheetTitle className="text-white">Menu</SheetTitle>
            <SheetDescription className="text-gray-400">
              Naviguez à travers les différentes sections de l'application.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4 bg-gray-700" />
          <div className="flex flex-col space-y-2.5">
            {menuSections.map((section) => (
              <div key={section.id} className="mb-4">
                <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {section.title}
                </div>
                {section.items.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-sidebar-accent text-white ${
                      activeItem === item.id
                        ? "bg-sidebar-accent text-white font-semibold"
                        : "text-white"
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </NavLink>
                ))}
                <Separator className="my-2 bg-gray-700" />
              </div>
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
        <div className={`flex flex-col space-y-2 h-full ${isHovered ? 'w-64' : 'w-16'} transition-all duration-300 py-4`}>
          <div className="flex flex-col space-y-1 px-2">
            {menuSections.map(section => renderSectionItems(section))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
