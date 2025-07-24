import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  score: number;
  maxScore: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
  description: string;
  color: "blue" | "green" | "orange" | "red";
}

const colorClasses = {
  blue: "from-data-blue/10 to-primary/5 border-data-blue/20",
  green: "from-data-green/10 to-accent/5 border-data-green/20",
  orange: "from-data-orange/10 to-warning/5 border-data-orange/20",
  red: "from-data-red/10 to-destructive/5 border-data-red/20",
};

const scoreColors = {
  blue: "text-data-blue",
  green: "text-data-green",
  orange: "text-data-orange",
  red: "text-data-red",
};

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

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} shadow-card hover:shadow-elevated transition-all duration-300 border`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <div className={`text-3xl font-bold ${scoreColors[color]}`}>
              {score}
              <span className="text-lg text-muted-foreground">/{maxScore}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {trend === "up" && <TrendingUp className="h-4 w-4 text-success" />}
            {trend === "down" && (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
            <span
              className={`text-sm font-medium ${
                trend === "up"
                  ? "text-success"
                  : trend === "down"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {trend !== "stable"
                ? `${trendValue > 0 ? "+" : ""}${trendValue}%`
                : "—"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-muted/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                color === "blue"
                  ? "bg-data-blue"
                  : color === "green"
                  ? "bg-data-green"
                  : color === "orange"
                  ? "bg-data-orange"
                  : "bg-data-red"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
