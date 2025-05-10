
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
import { Home, Users, Briefcase, Calendar, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Clients",
    icon: Users,
    path: "/clients",
  },
  {
    title: "Projets",
    icon: Briefcase,
    path: "/projects",
  },
  {
    title: "Produits",
    icon: Calendar,
    path: "/products",
  },
  {
    title: "Calendrier",
    icon: Calendar,
    path: "/calendar",
  },
  {
    title: "Paramètres",
    icon: Settings,
    path: "/settings",
  },
];

const AppSidebar = () => {
  const location = useLocation();
  
  const handleLogout = () => {
    // This is where you would implement logout functionality
    console.log("Logout clicked");
  };

  return (
    <Sidebar className="bg-menu-bg">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <span className="text-xl font-semibold text-terracotta">Archibat Pro</span>
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
