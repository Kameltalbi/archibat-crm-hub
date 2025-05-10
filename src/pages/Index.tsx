
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopClients from "@/components/dashboard/TopClients";
import RecentProjects from "@/components/dashboard/RecentProjects";
import CategoryDistribution from "@/components/dashboard/CategoryDistribution";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Tableau de bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre activité</p>
      </div>
      
      <DashboardSummary />
      
      <div className="grid gap-6 md:grid-cols-2">
        <RevenueChart />
        <CategoryDistribution />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentProjects />
        <TopClients />
      </div>
    </div>
  );
};

export default Dashboard;
