
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProjectObjectivesProps {
  targetRevenue?: number;
  totalRevenue: number;
}

export const ProjectObjectives = ({ targetRevenue, totalRevenue }: ProjectObjectivesProps) => {
  // Calculate percentage of target reached
  const percentageReached = useMemo(() => {
    if (!targetRevenue || targetRevenue === 0) return 0;
    const percentage = (totalRevenue / targetRevenue) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }, [totalRevenue, targetRevenue]);

  // Format the target revenue for display
  const formatTargetRevenue = (amount: number | undefined) => {
    if (amount === undefined) return "Non défini";
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Objectif CA</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center h-[200px]">
        <div className="text-3xl font-bold text-terracotta">
          {formatTargetRevenue(targetRevenue)}
        </div>
        {targetRevenue && totalRevenue > 0 && (
          <>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {Math.round(percentageReached)}% de l'objectif atteint
                </p>
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND', minimumFractionDigits: 0 }).format(totalRevenue)}
                </p>
              </div>
              <Progress value={percentageReached} className="h-2" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
