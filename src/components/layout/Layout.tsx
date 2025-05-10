
import { Outlet } from "react-router-dom";
import AppSidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full flex bg-beige dark:bg-matte-black overflow-hidden">
        <div className="fixed h-full z-40">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col ml-[var(--sidebar-width)]">
          <Header />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
