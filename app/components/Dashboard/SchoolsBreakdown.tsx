import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ClientTooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/d3-tooltip";
import * as d3 from "d3";
import { GraduationCap, BookOpen } from "lucide-react";

interface ExtendedHierarchyNode<T> extends d3.HierarchyNode<T> {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

type Subtopic = {
  name: string; // Changed from 'type' to 'name'
  value: number;
  description: string;
};

type SchoolTopic = {
  name: string;
  totalValue: number;
  totalPercentage: number;
  color: string;
  teachers: number;
  students: number;
  ratio: number;
  breakdown: Subtopic[];
};

type HierarchyData = {
  name: string;
  value?: number; // Make value optional for non-leaf nodes
  color?: string;
  description?: string; // Add description for leaf nodes
  children?: {
    name: string;
    color?: string;
    ratio?: number; // Add ratio to parent data
    teachers?: number; // Add teachers to parent data
    students?: number; // Add students to parent data
    children: Subtopic[];
  }[];
};

const schoolData: SchoolTopic[] = [
  {
    name: "Elementary Schools (SD)",
    totalValue: 148420,
    totalPercentage: 68.2,
    color: "hsl(var(--data-blue))",
    teachers: 1200000,
    students: 25000000,
    ratio: 20.8,
    breakdown: [
      {
        name: "Public Elementary",
        value: 82457,
        description: "Government-run elementary schools",
      },
      {
        name: "Private Elementary",
        value: 17964,
        description: "Private elementary schools",
      },
      {
        name: "Special Education",
        value: 5000,
        description: "Schools for children with special needs",
      },
    ],
  },
  {
    name: "Junior High Schools (SMP)",
    totalValue: 40576,
    totalPercentage: 18.6,
    color: "hsl(var(--data-green))",
    teachers: 850000,
    students: 12000000,
    ratio: 14.1,
    breakdown: [
      {
        name: "Public Junior High",
        value: 32461,
        description: "Government-run junior high schools",
      },
      {
        name: "Private Junior High",
        value: 8115,
        description: "Private junior high schools",
      },
    ],
  },
  {
    name: "Senior High Schools (SMA)",
    totalValue: 28745,
    totalPercentage: 13.2,
    color: "hsl(var(--data-orange))",
    teachers: 650000,
    students: 8000000,
    ratio: 12.3,
    breakdown: [
      {
        name: "Public Senior High",
        value: 20122,
        description: "Government-run senior high schools",
      },
      {
        name: "Private Senior High",
        value: 8623,
        description: "Private senior high schools",
      },
    ],
  },
  {
    name: "Vocational Schools (SMK)",
    totalValue: 14500,
    totalPercentage: 6.7,
    color: "hsl(var(--data-yellow))",
    teachers: 390000,
    students: 5000000,
    ratio: 12.8,
    breakdown: [
      {
        name: "Public Vocational",
        value: 8700,
        description: "Government-run vocational schools",
      },
      {
        name: "Private Vocational",
        value: 5800,
        description: "Private vocational schools",
      },
    ],
  },
];

const totalSchools = schoolData.reduce((sum, item) => sum + item.totalValue, 0);

const VISIBLE_TEXT_WIDTH = 10;
const VISIBLE_TEXT_HEIGHT = 10;

interface TreemapChartProps {
  data: SchoolTopic[];
}

export function TreemapChart({ data: rawData }: TreemapChartProps) {
  const data: HierarchyData = {
    name: "root",
    value: 0,
    children: rawData.map((topic) => ({
      name: topic.name,
      color: topic.color,
      ratio: topic.ratio, // Include ratio
      teachers: topic.teachers, // Include teachers
      students: topic.students, // Include students
      children: topic.breakdown.map((sub) => ({
        name: sub.name,
        value: sub.value,
        description: sub.description,
      })),
    })),
  };

  const root = d3
    .hierarchy(data)
    .sum((d) => d.value || 0)
    .sort((a, b) => (b.value || 0) - (a.value || 0));

  d3.treemap<HierarchyData>()
    .size([100, 100])
    .paddingInner(0.75)
    .paddingOuter(1)
    .round(false)(root);

  const leaves = root.leaves() as ExtendedHierarchyNode<HierarchyData>[];

  const colorScale = d3
    .scaleOrdinal<string, string>()
    .domain(rawData.map((d) => d.name))
    .range(rawData.map((d) => d.color));

  return (
    <ClientTooltip>
      <div className="relative w-full h-[250px]">
        {leaves.map((leaf, i) => {
          const leafWidth = leaf.x1 - leaf.x0;
          const leafHeight = leaf.y1 - leaf.y0;
          const parentColor = colorScale(leaf.parent?.data.name || "") as string;

          return (
            <TooltipTrigger key={i} data={leaf}>
              <div
                className="absolute rounded-md p-0.5 box-border flex justify-center items-center"
                style={{
                  left: `${leaf.x0}%`,
                  top: `${leaf.y0}%`,
                  width: `${leafWidth}%`,
                  height: `${leafHeight}%`,
                  backgroundColor: parentColor,
                }}
              >
                {leafWidth > VISIBLE_TEXT_WIDTH &&
                  leafHeight > VISIBLE_TEXT_HEIGHT && (
                    <span className="text-white text-xs font-medium text-center">
                      {leaf.data.name}
                    </span>
                  )}
              </div>
            </TooltipTrigger>
          );
        })}
        <TooltipContent />
      </div>
    </ClientTooltip>
  );
}

export const SchoolsBreakdown = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          School Breakdown by Type
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed distribution of {totalSchools.toLocaleString()} schools
          across Indonesia (2024)
        </p>
      </CardHeader>
      <CardContent>
        <TreemapChart data={schoolData} />

       <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/10">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-2">
             <BookOpen className="w-5 h-5 text-primary" />
             <span className="font-semibold text-primary">
               Total Schools in Indonesia
             </span>
           </div>
           <div className="text-right">
             <div className="text-xl font-bold text-primary">
               {totalSchools.toLocaleString()}
             </div>
             <div className="text-sm text-muted-foreground">
               Across all education levels
             </div>
           </div>
         </div>
       </div>
     </CardContent>
   </Card>
 );
};
