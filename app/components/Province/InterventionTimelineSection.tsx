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

// Monthly narration data for 3 years (36 months)
const getMonthlyNarration = (
  month: number
): {
  title: string;
  description: string;
  trend: "up" | "down";
  year: number;
  monthName: string;
} => {
  const year = Math.floor((month - 1) / 12) + 2022;
  const monthIndex = (month - 1) % 12;
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
  const monthName = monthNames[monthIndex];

  type PhaseData = {
    phase: "baseline" | "planning" | "early" | "accelerated" | "transformation";
    title: string;
    trend: "up" | "down";
  };

  const narrativePhases: Record<number, PhaseData> = {
    // Months 1-6: Critical baseline period
    1: {
      phase: "baseline",
      title: "Baseline Assessment - Critical Situation",
      trend: "down",
    },
    2: {
      phase: "baseline",
      title: "Initial Data Collection",
      trend: "down",
    },
    3: {
      phase: "baseline",
      title: "Problem Identification",
      trend: "down",
    },
    4: {
      phase: "planning",
      title: "Intervention Planning Phase",
      trend: "down",
    },
    5: {
      phase: "planning",
      title: "Resource Allocation",
      trend: "down",
    },
    6: {
      phase: "planning",
      title: "Early Implementation Preparation",
      trend: "up",
    },

    // Months 7-18: Early intervention
    7: {
      phase: "early",
      title: "Initial Intervention Deployment",
      trend: "up",
    },
    12: {
      phase: "early",
      title: "First Quarter Results",
      trend: "up",
    },
    18: {
      phase: "early",
      title: "Early Positive Indicators",
      trend: "up",
    },

    // Months 19-30: Accelerated progress
    24: {
      phase: "accelerated",
      title: "Significant Improvement Phase",
      trend: "up",
    },
    30: {
      phase: "accelerated",
      title: "Sustained Positive Trends",
      trend: "up",
    },

    // Months 31-36: Transformation
    33: {
      phase: "transformation",
      title: "Educational Transformation",
      trend: "up",
    },
    36: {
      phase: "transformation",
      title: "Comprehensive Success",
      trend: "up",
    },
  };

  // Find the closest narrative phase
  let selectedPhase: PhaseData = narrativePhases[1];
  for (const [phaseMonth, phase] of Object.entries(narrativePhases)) {
    if (month >= parseInt(phaseMonth)) {
      selectedPhase = phase;
    }
  }

  const descriptions = {
    baseline:
      "High-intensity red zones dominate the landscape, indicating critical educational gaps requiring immediate intervention. Assessment reveals significant disparities in educational quality, infrastructure, and access across the province.",
    planning:
      "Strategic planning and resource mobilization phase shows continued challenges while preparing comprehensive intervention strategies. Initial groundwork being laid for systematic educational improvements.",
    early:
      "First signs of improvement emerge as targeted interventions begin implementation. Orange and yellow zones start appearing, indicating early positive responses to educational reforms and infrastructure development.",
    accelerated:
      "Notable progress accelerates across multiple districts with expanding yellow and light green zones. Community engagement programs and digital learning initiatives show measurable positive impact on educational outcomes.",
    transformation:
      "Remarkable transformation with predominantly green zones indicating successful intervention outcomes. Comprehensive improvements in educational quality, accessibility, and equity demonstrate the lasting impact of sustained reform efforts.",
  };

  return {
    title: selectedPhase.title,
    description: descriptions[selectedPhase.phase as keyof typeof descriptions],
    trend: selectedPhase.trend,
    year,
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
                {currentMonth === 1
                  ? "Baseline"
                  : `Month ${currentMonth} of intervention`}
              </div>
            </div>

            <Slider
              value={[currentMonth]}
              onValueChange={(value) => setCurrentMonth(value[0])}
              min={1}
              max={36}
              step={1}
              className="w-full"
            />

            <div className="flex justify-between text-xs text-gray-500">
              <span>Jan 2022</span>
              <span>2022</span>
              <span>2023</span>
              <span>2024</span>
              <span>Dec 2024</span>
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