
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Home, Users, Briefcase, Calendar, Settings, LogOut, Grid, List, Clock } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
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
    title: "Projets",
    icon: Briefcase,
    path: "/dashboard/projects",
  },
  {
    title: "Produits",
    icon: Grid,
    path: "/dashboard/products",
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

const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fonction de déconnexion mise à jour
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

  return (
    <Sidebar className="bg-menu-bg">
      <SidebarHeader className="h-20 flex items-center justify-center px-6 border-b border-sidebar-border">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/6e406553-32da-493a-87fe-c175bc00e795.png" 
            alt="Archibat Logo" 
            className="h-16 w-auto object-contain"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="py-4 space-y-4">
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "transition-colors hover:bg-menu-highlight/30",
                  location.pathname === item.path && "bg-menu-highlight text-white font-medium"
                )}
              >
                <Link 
                  to={item.path} 
                  className="flex items-center gap-4 py-3 px-4"
                >
                  <item.icon size={24} />
                  <span className="text-base font-semibold">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-xs text-sidebar-foreground/70">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full gap-2 py-3 px-3 mb-4 rounded-md text-sidebar-foreground hover:bg-menu-highlight/40 transition-colors"
        >
          <LogOut size={20} />
          <span className="text-base font-semibold">Se déconnecter</span>
        </button>
        <div className="border-t border-sidebar-border pt-4">
          <p>Archibat CRM</p>
          <p>v1.0.0</p>
        </div>
      </SidebarFooter>
      <SidebarTrigger className="absolute top-3 right-3 hidden md:flex lg:hidden text-white" />
    </Sidebar>
  );
};

export default AppSidebar;
