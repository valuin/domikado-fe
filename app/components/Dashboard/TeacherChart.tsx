"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { Users } from "lucide-react";

// Calculate ratios from the data
const calculateRatio = (ratioString: string) => {
  const match = ratioString.match(/1:(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

// Generate teacher fluctuation data based on province data or use defaults
const generateTeacherData = (provinceData?: any) => {
  if (!provinceData) {
    return [
      {
        year: "2024",
        elementary: 1654764,
        juniorHigh: 729780,
        seniorHigh: 701781,
        studentsElementary: 24081832,
        studentsJuniorHigh: 10151103,
        studentsSeniorHigh: 10481481,
        ratioElementary: calculateRatio("1:15"),
        ratioJuniorHigh: calculateRatio("1:14"),
        ratioSeniorHigh: calculateRatio("1:15"),
      },
      {
        year: "2023",
        elementary: 1600000,
        juniorHigh: 700000,
        seniorHigh: 680000,
        studentsElementary: 23500000,
        studentsJuniorHigh: 9800000,
        studentsSeniorHigh: 10200000,
        ratioElementary: 14.7,
        ratioJuniorHigh: 14.0,
        ratioSeniorHigh: 15.0,
      },
      {
        year: "2022",
        elementary: 1550000,
        juniorHigh: 680000,
        seniorHigh: 660000,
        studentsElementary: 23000000,
        studentsJuniorHigh: 9500000,
        studentsSeniorHigh: 9900000,
        ratioElementary: 14.8,
        ratioJuniorHigh: 14.0,
        ratioSeniorHigh: 15.0,
      },
      {
        year: "2021",
        elementary: 1500000,
        juniorHigh: 660000,
        seniorHigh: 640000,
        studentsElementary: 22500000,
        studentsJuniorHigh: 9200000,
        studentsSeniorHigh: 9600000,
        ratioElementary: 15.0,
        ratioJuniorHigh: 13.9,
        ratioSeniorHigh: 15.0,
      },
      {
        year: "2020",
        elementary: 1450000,
        juniorHigh: 640000,
        seniorHigh: 620000,
        studentsElementary: 22000000,
        studentsJuniorHigh: 8900000,
        studentsSeniorHigh: 9300000,
        ratioElementary: 15.2,
        ratioJuniorHigh: 13.9,
        ratioSeniorHigh: 15.0,
      },
    ];
  }

  // Use real province data
  const currentYear = "2024";
  const elementaryTeachers = provinceData.workers.teachers.elementary.total;
  const juniorHighTeachers = provinceData.workers.teachers.junior_high.total;
  const seniorHighTeachers = provinceData.workers.teachers.senior_high.total;
  const elementaryStudents =
    provinceData.infrastructure.students.elementary.total;
  const juniorHighStudents =
    provinceData.infrastructure.students.junior_high.total;
  const seniorHighStudents =
    provinceData.infrastructure.students.senior_high.total;

  return [
    {
      year: currentYear,
      elementary: elementaryTeachers,
      juniorHigh: juniorHighTeachers,
      seniorHigh: seniorHighTeachers,
      studentsElementary: elementaryStudents,
      studentsJuniorHigh: juniorHighStudents,
      studentsSeniorHigh: seniorHighStudents,
      ratioElementary: calculateRatio(
        provinceData.workers.ratios.student_to_teacher_elementary
      ),
      ratioJuniorHigh: calculateRatio(
        provinceData.workers.ratios.student_to_teacher_junior_high
      ),
      ratioSeniorHigh: calculateRatio(
        provinceData.workers.ratios.student_to_teacher_senior_high_vocational
      ),
    },
    // Generate historical data based on current data
    {
      year: "2023",
      elementary: Math.round(elementaryTeachers * 0.97),
      juniorHigh: Math.round(juniorHighTeachers * 0.96),
      seniorHigh: Math.round(seniorHighTeachers * 0.97),
      studentsElementary: Math.round(elementaryStudents * 0.98),
      studentsJuniorHigh: Math.round(juniorHighStudents * 0.97),
      studentsSeniorHigh: Math.round(seniorHighStudents * 0.98),
      ratioElementary:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_elementary
        ) * 1.02,
      ratioJuniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_junior_high
        ) * 1.01,
      ratioSeniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_senior_high_vocational
        ) * 1.02,
    },
    {
      year: "2022",
      elementary: Math.round(elementaryTeachers * 0.94),
      juniorHigh: Math.round(juniorHighTeachers * 0.93),
      seniorHigh: Math.round(seniorHighTeachers * 0.94),
      studentsElementary: Math.round(elementaryStudents * 0.96),
      studentsJuniorHigh: Math.round(juniorHighStudents * 0.94),
      studentsSeniorHigh: Math.round(seniorHighStudents * 0.96),
      ratioElementary:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_elementary
        ) * 1.04,
      ratioJuniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_junior_high
        ) * 1.02,
      ratioSeniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_senior_high_vocational
        ) * 1.04,
    },
    {
      year: "2021",
      elementary: Math.round(elementaryTeachers * 0.91),
      juniorHigh: Math.round(juniorHighTeachers * 0.9),
      seniorHigh: Math.round(seniorHighTeachers * 0.91),
      studentsElementary: Math.round(elementaryStudents * 0.94),
      studentsJuniorHigh: Math.round(juniorHighStudents * 0.91),
      studentsSeniorHigh: Math.round(seniorHighStudents * 0.94),
      ratioElementary:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_elementary
        ) * 1.06,
      ratioJuniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_junior_high
        ) * 1.03,
      ratioSeniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_senior_high_vocational
        ) * 1.06,
    },
    {
      year: "2020",
      elementary: Math.round(elementaryTeachers * 0.88),
      juniorHigh: Math.round(juniorHighTeachers * 0.87),
      seniorHigh: Math.round(seniorHighTeachers * 0.88),
      studentsElementary: Math.round(elementaryStudents * 0.92),
      studentsJuniorHigh: Math.round(juniorHighStudents * 0.88),
      studentsSeniorHigh: Math.round(seniorHighStudents * 0.92),
      ratioElementary:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_elementary
        ) * 1.08,
      ratioJuniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_junior_high
        ) * 1.04,
      ratioSeniorHigh:
        calculateRatio(
          provinceData.workers.ratios.student_to_teacher_senior_high_vocational
        ) * 1.08,
    },
  ];
};

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
} satisfies ChartConfig;

interface TeacherChartProps {
  provinceData?: any;
}

export function TeacherChart({ provinceData }: TeacherChartProps) {
  const teacherFluctuationData = generateTeacherData(provinceData);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Teacher to Student Ratio Trends (2020-2024)
        </CardTitle>
        <CardDescription>
          Time-series fluctuation of student to teacher ratios across education
          levels.
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
            <ReferenceLine
              y={16}
              stroke="hsl(var(--destructive))"
              strokeDasharray="3 3"
              label={{
                value: "UNESCO Standard Ratio (1:16)",
                position: "insideTopRight",
                fill: "hsl(var(--destructive))",
                fontSize: 10,
              }}
            />
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
                        const originalDataKey = (entry.dataKey as string)
                          .replace("ratio", "")
                          .toLowerCase();
                        const dataKey =
                          originalDataKey as keyof typeof chartConfig;

                        // Ensure chartConfig[dataKey] exists before accessing its properties
                        if (!chartConfig[dataKey]) return null;

                        const originalLabel = chartConfig[
                          dataKey
                        ].label.replace(" Ratio", "");
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
                              <span className="text-muted-foreground">
                                Teachers:
                              </span>
                              <span className="font-bold">
                                {(
                                  entry.payload[teacherKey] as number
                                ).toLocaleString("en-US")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                Students:
                              </span>
                              <span className="font-bold">
                                {(
                                  entry.payload[studentKey] as number
                                ).toLocaleString("en-US")}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">
                                Ratio:
                              </span>
                              <span className="font-bold">
                                1 :{" "}
                                {(entry.payload[ratioKey] as number).toFixed(1)}
                              </span>
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
  );
}
