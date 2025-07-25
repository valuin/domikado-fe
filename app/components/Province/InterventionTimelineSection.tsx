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
import confetti from "canvas-confetti";

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
      "Baseline: 42 % of teachers lack digital-pedagogy certification and 38 % of students are below minimum reading proficiency. Planning allocates 1,200 micro-grants for teacher upskilling and 15 mobile STEM labs to target the highest-deficit districts shown in dark orange.",
    early:
      "After 3 months: 18 % of teachers have earned certification (+760 teachers). Reading proficiency gains lift 2,300 students above the minimum threshold. Mobile labs reach 4,500 students; early metrics shift heat zones from dark orange to yellow.",
    accelerated:
      "Month 12: 68 % teacher certification achieved (additional 1,150 teachers). Skill-deficit gap shrinks to 15 %. Grade-level reading proficiency rises to 74 % (+8,100 students). Heatmap transitions to light green as the province moves from bottom-quartile to mid-tier nationally.",
    transformation:
      "Month 24: 85 % of teachers certified; digital-skills deficit eliminated. Grade-level literacy reaches 91 % (additional 12,400 students). Province now ranks top-15 nationwide; heatmap shows dark-green clusters in all but two districts.",
    sustainability:
      "Month 36: 92 % sustained certification rate; zero districts remain in critical deficit. Literacy stabilises at 94 %; STEM-lab usage averages 4.8 hrs/week. Heatmap is vibrant green, signalling a resilient talent pipeline ready for the 2030 knowledge economy.",
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

  React.useEffect(() => {
    if (currentMonth === 21) {
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#15803d'],
      });
    }
  }, [currentMonth]);

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