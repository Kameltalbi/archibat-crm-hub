
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
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleLogout = async () => {
    try {
      // Nettoyer les états d'authentification
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) throw error;
      
      // Afficher une notification de déconnexion réussie
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      
      // Rediriger vers la page d'accueil
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion.",
        variant: "destructive",
      });
    }
  };

  // Define menu sections with items
  const menuSections: MenuSection[] = [
    {
      id: "overview",
      title: "Vue globale",
      items: [
        { id: 1, title: "Tableau de bord", icon: <LayoutDashboard size={24} />, path: "/dashboard" },
        { id: 7, title: "Prévisions des ventes", icon: <BarChart3 size={24} />, path: "/dashboard/sales-forecast" },
        { id: 5, title: "Plan de trésorerie", icon: <Wallet size={24} />, path: "/dashboard/treasury-plan" }
      ]
    },
    {
      id: "activities",
      title: "Gestion des activités",
      items: [
        { id: 2, title: "Clients", icon: <Users size={24} />, path: "/dashboard/clients" },
        { id: 3, title: "Actions commerciales", icon: <Folder size={24} />, path: "/dashboard/projects" },
        { id: 4, title: "Produits/Services", icon: <Package size={24} />, path: "/dashboard/products" },
        { id: 6, title: "Charges & Dépenses", icon: <Wallet size={24} />, path: "/dashboard/expenses" },
        { id: 8, title: "Calendrier", icon: <Calendar size={24} />, path: "/dashboard/calendar" }
      ]
    },
    {
      id: "hr",
      title: "Ressources humaines",
      items: [
        { id: 9, title: "Congés", icon: <UserCog size={24} />, path: "/dashboard/leaves" }
      ]
    },
    {
      id: "settings",
      title: "Réglages & support",
      items: [
        { id: 10, title: "Paramètres", icon: <Settings size={24} />, path: "/dashboard/settings" },
        { id: 11, title: "Documentation", icon: <Book size={24} />, path: "/dashboard/documentation" }
      ]
    }
  ];

  // Render a menu item or submenu
  const renderMenuItem = (item: MenuItem) => {
    const key = `menu-item-${item.id}`;
    if (item.hasSubItems) {
      return (
        <li key={key} className="group/menu-item relative">
          <Collapsible
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <button
                className={`flex w-full items-center justify-between rounded-md p-3 font-medium transition-colors duration-200 hover:bg-blue-700 ${
                  activeItem === item.id ? "bg-blue-700 text-white font-semibold shadow-md border-l-4 border-blue-300" : "text-white"
                }`}
              >
                <div className="flex items-center">
                  <div className="transition-transform duration-200 group-hover/menu-item:scale-110">{item.icon}</div>
                  {isHovered && <span className="ml-3 text-white">{item.title}</span>}
                </div>
                {isHovered && <ChevronRight className={`h-5 w-5 transform transition-transform ${false ? 'rotate-90' : ''}`} />}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {isHovered && item.subItems?.map((subItem: MenuItem) => (
                <NavLink
                  key={`submenu-item-${subItem.id}`}
                  to={subItem.path}
                  className={({ isActive }) => `flex items-center pl-10 py-3 text-sm font-medium transition-colors duration-200 hover:bg-blue-700 ${
                    isActive ? "bg-blue-700/50 text-white font-semibold border-l-4 border-blue-300" : "text-white"
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
        <TooltipProvider key={key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to={item.path}
                className={`group flex h-14 w-full items-center ${isHovered ? 'justify-start px-3' : 'justify-center'} rounded-lg transition-all duration-300 hover:bg-blue-700 ${
                  activeItem === item.id
                    ? "bg-blue-700 text-white font-semibold shadow-md border-l-4 border-blue-300"
                    : "text-white"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-center">
                  <div className="transition-transform duration-200 group-hover:scale-110">{item.icon}</div>
                  {isHovered && <span className="ml-3 text-white">{item.title}</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {!isHovered && <TooltipContent side="right">{item.title}</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      );
    }
  };

  const renderSectionItems = (section: MenuSection) => {
    const key = `section-${section.id}`;
    return (
      <div key={key} className="mb-4 w-full">
        {isHovered && (
          <div className="px-4 py-2 text-xs font-medium text-blue-200 uppercase tracking-wider">
            {section.title}
          </div>
        )}
        <div className="flex flex-col w-full gap-1">
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
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-3/4 border-r md:hidden bg-bluegray-deep">
          <SheetHeader className="text-left">
            <SheetTitle className="text-white">Menu</SheetTitle>
            <SheetDescription className="text-gray-400">
              Naviguez à travers les différentes sections de l'application.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4 bg-gray-700" />
          <div className="flex flex-col space-y-2.5 h-full">
            <div className="flex-grow">
              {menuSections.map((section) => (
                <div key={`mobile-${section.id}`} className="mb-4">
                  <div className="px-3 py-1 text-xs font-medium text-blue-200 uppercase tracking-wider">
                    {section.title}
                  </div>
                  {section.items.map((item) => (
                    <NavLink
                      key={`mobile-item-${item.id}`}
                      to={item.path}
                      className={({ isActive }) => `flex items-center space-x-3 rounded-lg p-3 text-sm font-medium transition-colors duration-200 hover:bg-blue-700 ${
                        isActive ? "bg-blue-700 text-white font-semibold border-l-4 border-blue-300" : "text-white"
                      }`}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <div className="transition-transform duration-200 group-hover:scale-110">{item.icon}</div>
                      <span>{item.title}</span>
                    </NavLink>
                  ))}
                  <Separator className="my-2 bg-gray-700" />
                </div>
              ))}
            </div>
            
            {/* Logout button with app name */}
            <div className="mt-auto pt-4 border-t border-gray-700">
              <div className="px-3 py-2 mb-2 text-center text-xs font-medium text-gray-400">
                abc-crmv1
              </div>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start space-x-3 rounded-lg p-3 text-sm font-medium transition-colors duration-200 hover:bg-blue-700 text-white"
                onClick={handleLogout}
              >
                <LogOut size={24} />
                <span>Se déconnecter</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop menu */}
      <div 
        className="hidden fixed h-screen border-r bg-bluegray-deep md:block transition-all duration-300 ease-in-out z-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex flex-col h-screen ${isHovered ? 'w-64' : 'w-20'} transition-all duration-300 py-6`}>
          <div className="flex-grow flex flex-col w-full px-2">
            {menuSections.map(section => renderSectionItems(section))}
          </div>
          
          {/* Logout button with app name */}
          <div className="mt-auto pt-4 border-t border-gray-700 px-2">
            {isHovered && (
              <div className="text-center py-2 text-xs font-medium text-gray-400">
                abc-crmv1
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`flex items-center w-full h-14 ${isHovered ? 'justify-start px-3' : 'justify-center'} rounded-lg transition-all duration-300 hover:bg-blue-700 text-white`}
                    onClick={handleLogout}
                  >
                    <LogOut size={24} className="transition-transform duration-200 hover:scale-110" />
                    {isHovered && <span className="ml-3">Se déconnecter</span>}
                  </button>
                </TooltipTrigger>
                {!isHovered && <TooltipContent side="right">Se déconnecter</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
