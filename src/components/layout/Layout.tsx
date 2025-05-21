
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-light-bg dark:bg-bluegray-deep">
      <AppSidebar />
      {/* Add margin-left to account for fixed sidebar */}
      <div className="flex-1 flex flex-col w-full overflow-hidden md:ml-20">
        <Header />
        <main className="flex-1 p-3 md:p-6 overflow-y-auto animate-fade-in w-full">
          <div className="w-full max-w-[1920px] mx-auto">
            <Outlet />
          </div>
        </main>
        <div className="py-2 px-4 text-xs text-center text-muted-foreground bg-background dark:bg-bluegray-deep border-t border-border">
          abc-crmv1 © {new Date().getFullYear()} — Tableau de bord professionnel
        </div>
      </div>
    </div>
  );
};

export default Layout;
