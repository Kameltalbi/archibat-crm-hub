
import { useState } from "react";
import {
  LayoutDashboard, BarChart3, Wallet, Users, FolderKanban,
  PackageSearch, NotebookText, Calendar, UserCog, Settings,
  Smartphone, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  { icon: LayoutDashboard, label: "Tableau de bord", path: "/dashboard" },
  { icon: BarChart3, label: "Statistiques", path: "/dashboard/statistics" },
  { icon: Wallet, label: "Dépenses", path: "/dashboard/expenses" },
  { icon: Users, label: "Employés", path: "/dashboard/employees" },
  { icon: FolderKanban, label: "Projets", path: "/dashboard/projects" },
  { icon: PackageSearch, label: "Produits", path: "/dashboard/products" },
  { icon: NotebookText, label: "Facturation", path: "/dashboard/invoices" },
  { icon: Calendar, label: "Congés", path: "/dashboard/conges" },
  { icon: UserCog, label: "Utilisateurs", path: "/dashboard/users" },
  { icon: Settings, label: "Paramètres", path: "/dashboard/settings" },
  { icon: Smartphone, label: "Mobile", path: "/dashboard/mobile" },
];

const Sidebar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = () => {
    console.log("Déconnexion");
    // ici : logique de déconnexion si besoin
  };

  return (
    <div className="w-20 h-full min-h-screen bg-[#2c3e50] py-4 flex flex-col justify-between items-center fixed left-0">
      
      {/* Haut : menu principal */}
      <div className="flex flex-col items-center space-y-4">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          return (
            <div key={index} className="group relative">
              <Link
                to={item.path}
                onClick={() => setActiveIndex(index)}
                className={`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200
                  ${isActive ? 'bg-blue-600 shadow-lg' : 'hover:bg-blue-700'}`}
              >
                <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-200" />
              </Link>
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bas : bouton de déconnexion */}
      <div className="pb-4">
        <div className="group relative">
          <button
            onClick={handleLogout}
            className="w-14 h-14 flex items-center justify-center rounded-xl hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut className="w-6 h-6 text-white" />
          </button>
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50">
            Se déconnecter
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
