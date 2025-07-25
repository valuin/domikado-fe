import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Target, TrendingUp, ArrowUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import DetailedRecommendations from "./DetailedRecommendations";
import dynamic from "next/dynamic";
import { ProvinceData } from "@/app/types/province";

const ProvinceDetailMap = dynamic(() => import("./ProvinceDetailMap"), {
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat peta...</p>
      </div>
    </div>
  ),
});
interface InterventionRecommendationsSectionProps {
  interventionData: {
    expectedGapScore: number;
    headline: {
      title: string;
      description: string;
    };
    budgetRecommendation: {
      name: string;
      value: number;
      color: string;
      change: string;
    }[];
    detailedRecommendations: {
      aspect: string;
      icon: React.ElementType;
      color: string;
      bgColor: string;
      budget: string;
      actions: string[];
      targets: string[];
    }[];
  };
  estimatedBudget: string;
  provinceName: string;
  provinceData?: ProvinceData;
}

const InterventionRecommendationsSection: React.FC<
  InterventionRecommendationsSectionProps
> = ({ interventionData, estimatedBudget, provinceName, provinceData }) => {
  return (
    <div className="space-y-8">
      {/* Headline Recommendation */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <Target className="w-8 h-8 text-blue-600 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3">
                {interventionData.headline.title}
              </h2>
              <p className="text-blue-800 text-lg leading-relaxed">
                {interventionData.headline.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-10 gap-6">
        {/* Alokasi Anggaran Rekomendasi */}
        <div className="lg:col-span-6 p-8 rounded-2xl border bg-white border-gray-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Recommendation Budget Allocation
            </h3>
          </div>
          <p className="text-xl text-gray-600 font-medium mb-4 flex gap-2">
            Total:{" "}
            <span className="font-bold text-blue-600 flex gap-4 ">
              {estimatedBudget || "Rp 2.1T"}
            </span>
          </p>
          <div className="h-[320px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={interventionData.budgetRecommendation}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {interventionData.budgetRecommendation.map(
                    (entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    )
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="absolute right-4 top-4 space-y-2">
              {interventionData.budgetRecommendation.map(
                (item: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Expected Impact to Gap Score */}
        <div className="lg:col-span-4 p-8 rounded-2xl border bg-white border-gray-300 flex flex-col items-center justify-between">
          <div className="flex gap-2 mb-2 items-center justify-center w-full">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold  text-gray-900 text-left w-full">
              Expected Impact to Gap Score
            </h3>
          </div>
          <div
            className="relative flex items-center justify-center mb-4"
            style={{ width: 180, height: 180 }}
          >
            <svg width={180} height={180}>
              <circle
                cx={90}
                cy={90}
                r={80}
                stroke="#e5e7eb"
                strokeWidth={16}
                fill="none"
              />
              <circle
                cx={90}
                cy={90}
                r={80}
                stroke="#6366f1"
                strokeWidth={16}
                fill="none"
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={
                  2 *
                  Math.PI *
                  80 *
                  (1 - interventionData.expectedGapScore / 100)
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s" }}
                transform="rotate(-90 90 90)"
              />
            </svg>
            <div
              className="absolute flex flex-col items-center justify-center"
              style={{ left: 0, top: 0, width: 180, height: 180 }}
            >
              <span className="text-5xl font-bold text-indigo-700">
                {interventionData.expectedGapScore}
              </span>
              <span className="text-lg text-gray-500 font-medium">/ 100</span>
            </div>
          </div>
          <p className="text-center text-gray-700 text-base">
            Skor gap pendidikan diproyeksikan meningkat menjadi{" "}
            <span className="font-semibold text-indigo-700">
              {interventionData.expectedGapScore}
            </span>{" "}
            dari skala 0-100 setelah intervensi.
          </p>
        </div>
      </div>
      {/* Budget Allocation Recommendation */}

      {/* Aceh Heatmap Analysis */}
      <ProvinceDetailMap provinceName={provinceName} />

      <DetailedRecommendations interventionData={interventionData} />
    </div>
  );
};

export default InterventionRecommendationsSection;
