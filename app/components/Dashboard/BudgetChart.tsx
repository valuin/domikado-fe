import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { TrendingUp } from "lucide-react";

const budgetData = [
  { year: "2021", budget: 550.5, formatted: "Rp 550.5T" },
  { year: "2022", budget: 612.2, formatted: "Rp 612.2T" },
  { year: "2023", budget: 665.1, formatted: "Rp 665.1T" },
  { year: "2024", budget: 720.8, formatted: "Rp 720.8T" },
];

export const BudgetChart = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          National Education Budget (4 Years)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total allocation for education sector in trillions (Rupiah)
        </p>
      </CardHeader>
      <CardContent>
        {/* Simple visual chart replacement */}
        <div className="space-y-4">
          {budgetData.map((item, index) => (
            <div
              key={item.year}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-lg font-semibold text-primary">
                  {item.year}
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-sm text-muted-foreground">
                    Year over year
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {item.formatted}
                </div>
                <div className="text-xs text-muted-foreground">
                  {index > 0 &&
                    `+${(
                      ((item.budget - budgetData[index - 1].budget) /
                        budgetData[index - 1].budget) *
                      100
                    ).toFixed(1)}%`}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 p-4 bg-gradient-to-r from-primary/5 to-primary-glow/5 rounded-lg border border-primary/10">
          <div>
            <p className="text-sm text-muted-foreground">Total Growth</p>
            <p className="text-lg font-semibold text-primary">+30.9%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Latest Budget</p>
            <p className="text-lg font-semibold text-primary">Rp 720.8T</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">YoY Growth</p>
            <p className="text-lg font-semibold text-success">+8.4%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
