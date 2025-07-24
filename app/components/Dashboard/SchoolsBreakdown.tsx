import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { GraduationCap, BookOpen } from "lucide-react";

const schoolData = [
  {
    name: "Elementary (SD)",
    value: 148420,
    percentage: 68.2,
    color: "hsl(var(--data-blue))",
  },
  {
    name: "Junior High (SMP)",
    value: 40576,
    percentage: 18.6,
    color: "hsl(var(--data-green))",
  },
  {
    name: "Senior High (SMA)",
    value: 28745,
    percentage: 13.2,
    color: "hsl(var(--data-orange))",
  },
];

const totalSchools = schoolData.reduce((sum, item) => sum + item.value, 0);

export const SchoolsBreakdown = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Total Schools in Indonesia
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution by education level (2024 data)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Statistics */}
          <div className="space-y-4">
            {/* Total Schools */}
            <div className="text-center lg:text-left mb-6">
              <div className="text-3xl font-bold text-primary">
                {totalSchools.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Schools</div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
              {schoolData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-transparent rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.value.toLocaleString()} schools
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">
                      {item.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Key Insights */}
            <div className="bg-primary/5 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Key Insights
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Elementary schools dominate education infrastructure</li>
                <li>• Transition rate: 97.8% SD→SMP, 89.3% SMP→SMA</li>
                <li>• Rural areas need more secondary schools</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
