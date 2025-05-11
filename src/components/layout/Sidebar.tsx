
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
import { Home, Users, Briefcase, Calendar, Settings, LogOut, Grid, List } from "lucide-react";
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
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/cd2bb4ea-8bca-441f-bdff-c9319ac0e042.png" 
            alt="Archibat Logo" 
            className="h-8 mr-2" 
          />
          <span className="text-xl font-semibold text-charcoal">Pro</span>
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
          <p>Archibat Pro CRM</p>
          <p>v1.0.0</p>
        </div>
      </SidebarFooter>
      <SidebarTrigger className="absolute top-3 right-3 lg:hidden text-white" />
    </Sidebar>
  );
};

export default AppSidebar;
