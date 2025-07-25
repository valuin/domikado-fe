import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  score: number;
  maxScore: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  description: string;
  color: "green" | "blue" | "red" | "yellow";
}

export const KPICard = ({
  title,
  score,
  maxScore,
  trend,
  trendValue,
  description,
  color,
}: KPICardProps) => {
  const percentage = (score / maxScore) * 100;

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "stable":
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      case "stable":
        return "text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    switch (color) {
      case "green":
        return "bg-success";
      case "blue":
        return "bg-primary";
      case "red":
        return "bg-destructive";
      case "yellow":
        return "bg-warning";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-foreground">{score}</span>
            <span className="text-sm text-muted-foreground">/ {maxScore}</span>
          </div>

          <Progress value={percentage} className="h-2" />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{description}</span>
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs font-medium">
                {trend === "stable" ? "±" : trend === "up" ? "+" : "-"}
                {trendValue}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
