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

// Generate school data based on province data or use defaults
const generateSchoolData = (provinceData?: any): SchoolTopic[] => {
  if (!provinceData) {
    return [
      {
        name: "Elementary Schools (SD)",
        totalValue: 151335,
        totalPercentage: 66.5,
        color: "hsl(var(--data-blue))",
        teachers: 1654764,
        students: 24081832,
        ratio: 15.2,
        breakdown: [
          {
            name: "Public Elementary",
            value: 129284,
            description: "Government-run elementary schools",
          },
          {
            name: "Private Elementary",
            value: 19750,
            description: "Private elementary schools",
          },
          {
            name: "Special Education",
            value: 2301,
            description: "Schools for children with special needs",
          },
        ],
      },
      {
        name: "Junior High Schools (SMP)",
        totalValue: 45298,
        totalPercentage: 19.9,
        color: "hsl(var(--data-green))",
        teachers: 729780,
        students: 10151103,
        ratio: 13.9,
        breakdown: [
          {
            name: "Public Junior High",
            value: 24076,
            description: "Government-run junior high schools",
          },
          {
            name: "Private Junior High",
            value: 19022,
            description: "Private junior high schools",
          },
          {
            name: "Special Education",
            value: 2200,
            description: "Schools for children with special needs",
          },
        ],
      },
      {
        name: "Senior High Schools (SMA)",
        totalValue: 30957,
        totalPercentage: 13.6,
        color: "hsl(var(--data-orange))",
        teachers: 701781,
        students: 10481481,
        ratio: 14.9,
        breakdown: [
          {
            name: "Public Senior High",
            value: 10805,
            description: "Government-run senior high schools",
          },
          {
            name: "Private Senior High",
            value: 18135,
            description: "Private senior high schools",
          },
          {
            name: "Special Education",
            value: 2017,
            description: "Schools for children with special needs",
          },
        ],
      },
    ];
  }

  // Use real province data
  const totalSchools = provinceData.total.schools;
  const elementarySchools = provinceData.infrastructure.schools.elementary;
  const juniorHighSchools = provinceData.infrastructure.schools.junior_high;
  const seniorHighSchools = provinceData.infrastructure.schools.senior_high;
  const higherEducationSchools =
    provinceData.infrastructure.schools.higher_education;

  const elementaryTeachers = provinceData.workers.teachers.elementary.total;
  const juniorHighTeachers = provinceData.workers.teachers.junior_high.total;
  const seniorHighTeachers = provinceData.workers.teachers.senior_high.total;
  const higherEducationTeachers =
    provinceData.workers.teachers.higher_education.total;

  const elementaryStudents =
    provinceData.infrastructure.students.elementary.total;
  const juniorHighStudents =
    provinceData.infrastructure.students.junior_high.total;
  const seniorHighStudents =
    provinceData.infrastructure.students.senior_high.total;
  const higherEducationStudents =
    provinceData.infrastructure.students.higher_education.total;

  return [
    {
      name: "Elementary Schools (SD)",
      totalValue: elementarySchools.total,
      totalPercentage: (elementarySchools.total / totalSchools) * 100,
      color: "hsl(var(--data-blue))",
      teachers: elementaryTeachers,
      students: elementaryStudents,
      ratio: elementaryStudents / elementaryTeachers,
      breakdown: [
        {
          name: "Public Elementary",
          value: elementarySchools.public,
          description: "Government-run elementary schools",
        },
        {
          name: "Private Elementary",
          value: elementarySchools.private,
          description: "Private elementary schools",
        },
        {
          name: "Special Education",
          value: elementarySchools.special_needs,
          description: "Schools for children with special needs",
        },
      ],
    },
    {
      name: "Junior High Schools (SMP)",
      totalValue: juniorHighSchools.total,
      totalPercentage: (juniorHighSchools.total / totalSchools) * 100,
      color: "hsl(var(--data-green))",
      teachers: juniorHighTeachers,
      students: juniorHighStudents,
      ratio: juniorHighStudents / juniorHighTeachers,
      breakdown: [
        {
          name: "Public Junior High",
          value: juniorHighSchools.public,
          description: "Government-run junior high schools",
        },
        {
          name: "Private Junior High",
          value: juniorHighSchools.private,
          description: "Private junior high schools",
        },
        {
          name: "Special Education",
          value: juniorHighSchools.special_needs,
          description: "Schools for children with special needs",
        },
      ],
    },
    {
      name: "Senior High Schools (SMA)",
      totalValue: seniorHighSchools.total,
      totalPercentage: (seniorHighSchools.total / totalSchools) * 100,
      color: "hsl(var(--data-orange))",
      teachers: seniorHighTeachers,
      students: seniorHighStudents,
      ratio: seniorHighStudents / seniorHighTeachers,
      breakdown: [
        {
          name: "Public Senior High",
          value: seniorHighSchools.public,
          description: "Government-run senior high schools",
        },
        {
          name: "Private Senior High",
          value: seniorHighSchools.private,
          description: "Private senior high schools",
        },
        {
          name: "Special Education",
          value: seniorHighSchools.special_needs,
          description: "Schools for children with special needs",
        },
      ],
    },
    // Add higher education if it exists
    ...(higherEducationSchools.total > 0
      ? [
          {
            name: "Higher Education",
            totalValue: higherEducationSchools.total,
            totalPercentage:
              (higherEducationSchools.total / totalSchools) * 100,
            color: "hsl(var(--data-yellow))",
            teachers: higherEducationTeachers,
            students: higherEducationStudents,
            ratio: higherEducationStudents / higherEducationTeachers,
            breakdown: [
              {
                name: "Public Universities",
                value: higherEducationSchools.public,
                description: "Government-run universities",
              },
              {
                name: "Private Universities",
                value: higherEducationSchools.private,
                description: "Private universities",
              },
              {
                name: "Official Institutions",
                value: higherEducationSchools.official,
                description: "Official educational institutions",
              },
            ],
          },
        ]
      : []),
  ];
};

// Using real data from API: 227,590 total schools
const totalSchools = 227590;

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

  d3
    .treemap<HierarchyData>()
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
          const parentColor = colorScale(
            leaf.parent?.data.name || ""
          ) as string;

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

interface SchoolsBreakdownProps {
  provinceData?: any;
}

export const SchoolsBreakdown = ({ provinceData }: SchoolsBreakdownProps) => {
  const schoolData = generateSchoolData(provinceData);
  const totalSchools = provinceData?.total?.schools || 227590;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          School Breakdown by Type
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Detailed distribution of {totalSchools.toLocaleString("en-US")}{" "}
          schools across {provinceData?.provinces?.name || "Indonesia"} (2024)
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
                {totalSchools.toLocaleString("en-US")}
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
