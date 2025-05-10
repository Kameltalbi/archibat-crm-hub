
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Index";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import { Toaster } from "./components/ui/toaster";
import { SidebarProvider } from "./components/ui/sidebar";

const App = () => {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="products" element={<Products />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </SidebarProvider>
  );
};

export default App;
