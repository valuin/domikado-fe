import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { DollarSign } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const budgetData = [
  {
    name: "Teacher Salaries",
    value: 42.5,
    color: "hsl(var(--data-blue))",
    description: "Compensation for 3.1M teachers",
  },
  {
    name: "School Operations",
    value: 31.2,
    color: "hsl(var(--data-green))",
    description: "Daily operations & maintenance",
  },
  {
    name: "Infrastructure",
    value: 18.8,
    color: "hsl(var(--data-orange))",
    description: "Buildings, facilities & equipment",
  },
  {
    name: "Student Support",
    value: 5.2,
    color: "hsl(var(--data-yellow))",
    description: "Scholarships & assistance programs",
  },
  {
    name: "Administration",
    value: 2.3,
    color: "hsl(var(--data-red))",
    description: "Ministry & regional operations",
  },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-primary font-bold">{payload[0].value}%</p>
        <p className="text-xs text-muted-foreground">
          {payload[0].payload.description}
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-col space-y-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-foreground">{entry.value}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {budgetData.find((item) => item.name === entry.value)?.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

export const BudgetAllocationPieChart = ({ funding }: { funding: number }) => {
  const formattedFunding = formatRupiah(funding);
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          National Budget Allocation
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Education budget breakdown by sector (2024)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Education Budget
            </p>
            <p className="text-lg font-bold text-primary">{formattedFunding}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">of National Budget</p>
            <p className="text-lg font-bold text-success">20.1%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
