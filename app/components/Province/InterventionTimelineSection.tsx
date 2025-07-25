"use client";

import React from "react";
import { Slider } from "@/app/components/ui/slider";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useProvinceStore } from "@/app/store/provinceStore";

// Monthly narration data for 5 years (60 months)
const getMonthlyNarration = (
  step: number
): {
  title: string;
  description: string;
  trend: "up" | "down";
  year: number;
  monthName: string;
} => {
  const totalMonths = (step - 1) * 3;
  const year = Math.floor(totalMonths / 12) + 2025;
  const monthIndex = (totalMonths % 12) + 5; // Start from June (index 5)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[monthIndex % 12];

  type PhaseData = {
    phase: "planning" | "early" | "accelerated" | "transformation" | "sustainability";
    title: string;
    trend: "up" | "down";
  };

  const narrativePhases: Record<number, PhaseData> = {
    // Steps 1-4 (Year 1): Planning and Early Intervention
    1: {
      phase: "planning",
      title: "Intervention Planning & Mobilization",
      trend: "down",
    },
    4: {
      phase: "early",
      title: "Early Intervention & Initial Results",
      trend: "up",
    },
    // Steps 5-8 (Year 2): Accelerated Progress
    8: {
      phase: "accelerated",
      title: "Accelerated Progress & Scaling Up",
      trend: "up",
    },
    // Steps 9-12 (Year 3): Transformation
    12: {
      phase: "transformation",
      title: "Educational Transformation & Deep Impact",
      trend: "up",
    },
    // Steps 13-16 (Year 4): Sustainability
    16: {
      phase: "sustainability",
      title: "Sustainability & Long-term Success",
      trend: "up",
    },
    // Steps 17-20 (Year 5): Final evaluation
    20: {
        phase: "sustainability",
        title: "Final Evaluation & Future Outlook",
        trend: "up",
    }
  };

  // Find the closest narrative phase
  let selectedPhase: PhaseData = narrativePhases[1];
  for (const [phaseStep, phase] of Object.entries(narrativePhases)) {
    if (step >= parseInt(phaseStep)) {
      selectedPhase = phase;
    }
  }

  const descriptions = {
    planning:
      "Initial phase focuses on strategic planning, resource allocation, and community engagement. The heatmap shows dark orange, indicating the significant challenges ahead.",
    early:
      "Targeted interventions are rolled out. The heatmap begins to shift towards lighter orange and yellow, reflecting early positive changes and improvements in key areas.",
    accelerated:
      "Successful programs are scaled up, leading to widespread improvements. The heatmap shows a clear transition to yellow and light green, indicating significant progress.",
    transformation:
      "The educational landscape is fundamentally transformed. The heatmap is now predominantly light green, with pockets of dark green emerging as a result of deep and sustained impact.",
    sustainability:
      "Focus shifts to ensuring long-term success and sustainability of the interventions. The heatmap is now a vibrant green, symbolizing a resilient and thriving educational ecosystem.",
  };

  return {
    title: selectedPhase.title,
    description: descriptions[selectedPhase.phase as keyof typeof descriptions],
    trend: selectedPhase.trend,
    year: year + Math.floor(monthIndex / 12),
    monthName,
  };
};

interface InterventionTimelineSectionProps {
  provinceName: string;
}
 
export const InterventionTimelineSection: React.FC<InterventionTimelineSectionProps> = ({
  provinceName,
}) => {
  const { currentMonth, setCurrentMonth } = useProvinceStore();
  const currentNarration = getMonthlyNarration(currentMonth);

  return (
    <div className="space-y-6">
      {/* Time Series Controls */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Educational Intervention Timeline: {provinceName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">
                Timeline: {currentNarration.monthName} {currentNarration.year}
              </label>
              <div className="text-sm text-gray-600">
                {`Quarter ${currentMonth}`}
              </div>
            </div>

            <Slider
              value={[currentMonth]}
              onValueChange={(value) => setCurrentMonth(value[0])}
              min={1}
              max={21}
              step={1}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>Jun 2025</span>
              <span>2026</span>
              <span>2027</span>
              <span>2028</span>
              <span>2029</span>
              <span>Jun 2030</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yearly Narration */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {currentNarration.trend === "up" ? (
              <TrendingUp className="w-5 h-5 text-green-600" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-600" />
            )}
            {currentNarration.monthName} {currentNarration.year}:{" "}
            {currentNarration.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {currentNarration.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterventionTimelineSection;