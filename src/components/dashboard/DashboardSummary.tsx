
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, Calendar, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  delay: number;
}

const StatCard = ({ title, value, description, icon: Icon, trend, trendLabel, delay }: StatCardProps) => (
  <Card className={`animate-fade-in delay-${delay}`}>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <ArrowUp className="h-3 w-3 text-terracotta" />
          <span className="text-xs font-medium text-terracotta">{trend}%</span>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const DashboardSummary = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="CA Total"
        value="154 890 TND"
        description="Chiffre d'affaires global"
        icon={Calendar}
        trend={12}
        trendLabel="vs période précédente"
        delay={100}
      />
      <StatCard
        title="Projets Actifs"
        value="24"
        description="Projets en cours"
        icon={Briefcase}
        trend={8}
        trendLabel="vs période précédente"
        delay={200}
      />
      <StatCard
        title="Clients"
        value="47"
        description="Total des clients"
        icon={Users}
        trend={5}
        trendLabel="vs période précédente"
        delay={300}
      />
      <StatCard
        title="Ventes du mois"
        value="38 450 TND"
        description="CA du mois en cours"
        icon={Calendar}
        trend={15}
        trendLabel="vs mois précédent"
        delay={400}
      />
    </div>
  );
};

export default DashboardSummary;
