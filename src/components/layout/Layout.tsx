
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-beige dark:bg-matte-black">
      <AppSidebar />
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header />
        <main className="flex-1 p-3 md:p-6 overflow-y-auto animate-fade-in">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
