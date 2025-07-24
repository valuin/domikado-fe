import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Users, Target, AlertTriangle, CheckCircle } from "lucide-react";

const teacherData = [
  {
    name: "Elementary Schools (SD)",
    count: 1200000,
    formatted: "1.2M",
    percentage: 41.5,
    color: "hsl(var(--data-blue))",
    ratio: 20.8,
  },
  {
    name: "Junior High Schools (SMP)",
    count: 850000,
    formatted: "850K",
    percentage: 29.4,
    color: "hsl(var(--data-green))",
    ratio: 14.1,
  },
  {
    name: "Senior High Schools (SMA/SMK)",
    count: 1040000,
    formatted: "1.04M",
    percentage: 36.0,
    color: "hsl(var(--data-orange))",
    ratio: 12.5,
  },
];

const totalTeachers = teacherData.reduce((sum, item) => sum + item.count, 0);
const overallRatio = 18.2; // Calculated average

export const TeacherChart = () => {
  const isGoodRatio = overallRatio <= 16;
  const ratioStatus = isGoodRatio ? "Good" : "Needs Improvement";
  const ratioColor = isGoodRatio ? "text-success" : "text-warning";

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Teacher Distribution by Education Level
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total {totalTeachers.toLocaleString()} teaching staff in Indonesia
        </p>
      </CardHeader>
      <CardContent>
        {/* Teacher breakdown by education level */}
        <div className="space-y-3">
          {teacherData.map((item, index) => {
            const isGoodRatio = item.ratio <= 16;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-transparent rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.percentage}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {item.formatted}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ratio 1:{item.ratio}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Teacher-Student Ratio Summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-accent/5 to-success/5 rounded-lg border border-accent/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-accent" />
              <span className="font-medium text-sm text-accent">
                Teacher-Student Ratio
              </span>
            </div>
            <div className={`flex items-center space-x-1 ${ratioColor}`}>
              {isGoodRatio ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{ratioStatus}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-accent">
                1:{overallRatio}
              </div>
              <div className="text-xs text-muted-foreground">
                National Ratio
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-success">1:16</div>
              <div className="text-xs text-muted-foreground">
                UNESCO Standard
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
