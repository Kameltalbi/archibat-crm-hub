
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Leaves from "./pages/Leaves";
import Settings from "./pages/Settings";
import Documentation from "./pages/Documentation";
import TreasuryPlan from "./pages/TreasuryPlan";
import Expenses from "./pages/Expenses";
import SalesForecastPage from "./pages/SalesForecastPage";
import { Toaster } from "./components/ui/toaster";
import { SidebarProvider } from "./components/ui/sidebar";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Configurer l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setIsLoading(false);
      }
    );

    // Vérifier la session actuelle au chargement
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setIsLoading(false);
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={session ? <Navigate to="/dashboard" replace /> : <Home />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/:id" element={<ClientDetails />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="products" element={<Products />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="leaves" element={<Leaves />} />
            <Route path="treasury-plan" element={<TreasuryPlan />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="sales-forecast" element={<SalesForecastPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="documentation" element={<Documentation />} />
          </Route>
          <Route path="/settings" element={<Layout />}>
            <Route index element={<Settings />} />
          </Route>
          <Route path="/documentation" element={<Layout />}>
            <Route index element={<Documentation />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SidebarProvider>
  );
};

export default App;
