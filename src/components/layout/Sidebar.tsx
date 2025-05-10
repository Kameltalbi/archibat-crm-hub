
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
import { Home, Users, Briefcase, Calendar, Settings } from "lucide-react";
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
  
  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <span className="text-xl font-semibold text-terracotta">Archibat Pro</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                className={cn(
                  "transition-colors hover:bg-sidebar-accent",
                  location.pathname === item.path && "bg-sidebar-accent text-terracotta"
                )}
              >
                <Link 
                  to={item.path} 
                  className="flex items-center gap-3 py-2 px-3"
                >
                  <item.icon size={20} />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center text-xs text-sidebar-foreground/70">
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
