import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  GraduationCap,
  BookOpen,
  Building2,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const schoolData = [
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
        type: "Public Elementary",
        value: 132456,
        percentage: 89.3,
        description: "Government-run elementary schools",
      },
      {
        type: "Private Elementary",
        value: 14964,
        percentage: 10.1,
        description: "Private elementary schools",
      },
      {
        type: "Special Education",
        value: 1000,
        percentage: 0.6,
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
        type: "Public Junior High",
        value: 32461,
        percentage: 80.0,
        description: "Government-run junior high schools",
      },
      {
        type: "Private Junior High",
        value: 8115,
        percentage: 20.0,
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
        type: "Public Senior High",
        value: 20122,
        percentage: 70.0,
        description: "Government-run senior high schools",
      },
      {
        type: "Private Senior High",
        value: 8623,
        percentage: 30.0,
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
        type: "Public Vocational",
        value: 8700,
        percentage: 60.0,
        description: "Government-run vocational schools",
      },
      {
        type: "Private Vocational",
        value: 5800,
        percentage: 40.0,
        description: "Private vocational schools",
      },
    ],
  },
];

const totalSchools = schoolData.reduce((sum, item) => sum + item.totalValue, 0);

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
        <Accordion type="single" collapsible className="w-full">
          {schoolData.map((item, index) => {
            const isGoodRatio = item.ratio <= 16;
            const ratioStatus = isGoodRatio ? "Good" : "Needs Improvement";
            const ratioColor = isGoodRatio ? "text-success" : "text-warning";

            return (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center  justify-between w-full pr-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="text-left">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.totalValue.toLocaleString()} schools (
                          {item.totalPercentage}%)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="font-semibold text-sm">
                          {item.totalPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {item.breakdown.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/30 to-transparent rounded-lg border border-muted/20 ml-5"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            <div>
                              <div className="font-medium text-sm">
                                {subItem.type}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {subItem.description}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">
                            {subItem.value.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {subItem.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Teacher-Student Ratio for this category */}
                    <div className="mt-4 p-3 bg-accent/5 rounded-lg border border-accent/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-accent">
                            Teacher-Student Ratio for {item.name}
                          </span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${ratioColor}`}
                        >
                          {isGoodRatio ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertTriangle className="w-3 h-3" />
                          )}
                          <span className="text-xs font-medium">
                            {ratioStatus}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-sm font-semibold text-accent">
                            {item.teachers.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Teachers
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-accent">
                            {item.students.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Students
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-accent">
                            1:{item.ratio}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Ratio
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Summary for this category */}
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            {item.name} Summary
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {item.totalValue.toLocaleString()} schools
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.totalPercentage}% of total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Overall summary */}
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
