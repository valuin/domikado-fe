import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { AlertTriangle, CheckCircle, School, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface CurrentSituationSectionProps {
  currentSituationData: {
    kpiMetrics: {
      title: string;
      value: string | number;
      max?: number;
      status: "warning" | "good";
      trend: string;
      target?: string;
    }[];
    schoolBreakdown: {
      name: string;
      count: number;
      teachers: number;
      students: number;
      ratio: number;
    }[];
    budgetAllocation: {
      name: string;
      value: number;
      color: string;
    }[];
  };
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary font-bold">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const CurrentSituationSection: React.FC<CurrentSituationSectionProps> = ({
  currentSituationData,
}) => {
  return (
    <div className="space-y-8">
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentSituationData.kpiMetrics.map((metric, index) => (
          <Card key={index} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </h3>
                {metric.status === "good" ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
              </div>
              <div className="text-2xl font-bold text-primary mb-1">
                {metric.value}
              </div>
              {metric.target && (
                <div className="text-xs text-muted-foreground mb-2">
                  Target: {metric.target}
                </div>
              )}
              <div className="text-xs text-success font-medium">
                {metric.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* School Breakdown & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* School Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <School className="h-5 w-5 text-primary" />
              Rincian Sekolah Berdasarkan Jenjang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentSituationData.schoolBreakdown.map((school, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{school.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {school.count.toLocaleString()} sekolah
                      </p>
                    </div>
                    <Badge
                      variant={school.ratio <= 16 ? "default" : "secondary"}
                    >
                      Rasio 1:{school.ratio}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Guru: </span>
                      <span className="font-medium">
                        {school.teachers.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Siswa: </span>
                      <span className="font-medium">
                        {school.students.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Budget Allocation */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Alokasi Anggaran Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentSituationData.budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {currentSituationData.budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrentSituationSection;