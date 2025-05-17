
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, Users, Briefcase, Calendar, Settings, LogOut, Grid, List, Clock, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Clients",
    icon: Users,
    path: "/dashboard/clients",
  },
  {
    title: "Actions commerciales",
    icon: Briefcase,
    path: "/dashboard/projects",
  },
  {
    title: "Produits/Services",
    icon: Grid,
    path: "/dashboard/products",
  },
  {
    title: "Charges & Dépenses",
    icon: Wallet,
    path: "/dashboard/expenses",
  },
  {
    title: "Catégories",
    icon: List,
    path: "/dashboard/categories",
  },
  {
    title: "Calendrier",
    icon: Calendar,
    path: "/dashboard/calendar",
  },
  {
    title: "Congés",
    icon: Clock,
    path: "/dashboard/leaves",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/dashboard/settings",
  },
];

const MobileNavigation = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (path: string) => {
    navigate(path);
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

  if (!isMobile) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] sm:w-[350px] bg-bluegray-deep text-white">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-center border-b border-sidebar-border pb-4">
            <img 
              src="/lovable-uploads/6e406553-32da-493a-87fe-c175bc00e795.png" 
              alt="Archibat Logo" 
              className="h-16 w-auto object-contain"
            />
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="mt-6 flex flex-col space-y-2 flex-grow">
            {menuItems.map((item) => (
              <SheetClose key={item.path} asChild>
                <Button 
                  variant="ghost" 
                  className="justify-start hover:bg-blue-accent/30 py-6 text-white"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="text-base font-semibold">{item.title}</span>
                </Button>
              </SheetClose>
            ))}
          </div>
          <div className="pt-4 mt-auto border-t border-sidebar-border">
            <div className="text-center mb-2 text-xs text-gray-400">
              abc-crmv1
            </div>
            <Button 
              variant="ghost" 
              className="justify-start hover:bg-blue-accent/30 py-6 w-full text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              <span className="text-base font-semibold">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
