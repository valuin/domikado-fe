"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend, ReferenceLine } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"
import { Users } from "lucide-react"

const teacherFluctuationData = [
  { year: "2020", elementary: 1180000, juniorHigh: 840000, seniorHigh: 1020000, studentsElementary: 24544000, studentsJuniorHigh: 11844000, studentsSeniorHigh: 12750000 },
  { year: "2021", elementary: 1160000, juniorHigh: 870000, seniorHigh: 1080000, studentsElementary: 24788000, studentsJuniorHigh: 11914500, studentsSeniorHigh: 12875000 },
  { year: "2022", elementary: 1240000, juniorHigh: 820000, seniorHigh: 995000, studentsElementary: 25032000, studentsJuniorHigh: 11985000, studentsSeniorHigh: 13000000 },
  { year: "2023", elementary: 1150000, juniorHigh: 890000, seniorHigh: 1125000, studentsElementary: 25276000, studentsJuniorHigh: 12055500, studentsSeniorHigh: 13125000 },
  { year: "2024", elementary: 1280000, juniorHigh: 815000, seniorHigh: 1040000, studentsElementary: 25520000, studentsJuniorHigh: 12126000, studentsSeniorHigh: 13250000 },
].map(d => ({
  ...d,
  ratioElementary: d.studentsElementary / d.elementary,
  ratioJuniorHigh: d.studentsJuniorHigh / d.juniorHigh,
  ratioSeniorHigh: d.studentsSeniorHigh / d.seniorHigh,
}));

const chartConfig = {
  elementary: {
    label: "Elementary Ratio",
    color: "hsl(var(--chart-1))",
  },
  juniorHigh: {
    label: "Junior High Ratio",
    color: "hsl(var(--chart-2))",
  },
  seniorHigh: {
    label: "Senior High Ratio",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function TeacherChart() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Teacher to Student Ratio Trends (2020-2024)
        </CardTitle>
        <CardDescription>
          Time-series fluctuation of student to teacher ratios across education levels.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={teacherFluctuationData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `1:${value.toFixed(1)}`}
            />
            <ReferenceLine y={16} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label={{ value: "UNESCO Standard Ratio (1:16)", position: "insideTopRight", fill: "hsl(var(--destructive))", fontSize: 10 }} />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="w-[240px] space-y-2 p-4 bg-background border rounded-lg shadow-lg">
                      <div className="font-bold text-lg">{label}</div>
                      <div className="border-t my-2"></div>
                      {payload.map((entry) => {
                        if (!entry.dataKey) return null;
                        // Extract the original key (e.g., "elementary" from "ratioElementary")
                        const originalDataKey = (entry.dataKey as string).replace('ratio', '').toLowerCase();
                        const dataKey = originalDataKey as keyof typeof chartConfig;

                        // Ensure chartConfig[dataKey] exists before accessing its properties
                        if (!chartConfig[dataKey]) return null;

                        const originalLabel = chartConfig[dataKey].label.replace(' Ratio', '');
                        const studentKey = `students${originalLabel}`;
                        const teacherKey = originalLabel.toLowerCase();
                        const ratioKey = `ratio${originalLabel}`;

                        return (
                          <div key={entry.dataKey}>
                            <div className="flex justify-between items-center">
                              <span style={{ color: entry.color }}>
                                {chartConfig[dataKey].label}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Teachers:</span>
                              <span className="font-bold">{(entry.payload[teacherKey] as number).toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Students:</span>
                              <span className="font-bold">{(entry.payload[studentKey] as number).toLocaleString('en-US')}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Ratio:</span>
                              <span className="font-bold">1 : {(entry.payload[ratioKey] as number).toFixed(1)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              dataKey="ratioElementary"
              type="monotone"
              stroke="var(--color-elementary)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ratioJuniorHigh"
              type="monotone"
              stroke="var(--color-juniorHigh)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ratioSeniorHigh"
              type="monotone"
              stroke="var(--color-seniorHigh)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
