import React from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PersonStanding,
  User,
  School,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import RatioAnalysis from "./RatioAnalysis";

import { ProvinceData } from "@/app/types/province";
import {
  calculateSchoolRequirements,
  calculateTeacherRequirements,
} from "@/lib/utils";
import BudgetCalculator from "../calculator";

// Function to analyze gap score and provide description
const analyzeGapScore = (gapScore: number) => {
  if (gapScore >= 80) {
    return {
      status: "critical",
      title: "Gap Tinggi - Kondisi Kritis",
      description:
        "Provinsi mengalami gap pendidikan yang sangat tinggi. Terjadi ketertinggalan signifikan dalam rasio guru, dan infrastruktur pendidikan. Perlu intervensi mendesak dan alokasi anggaran besar untuk memperbaiki kondisi ini.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: XCircle as React.ElementType,
      iconColor: "text-red-600",
      severity: "Kritis",
    };
  } else if (gapScore >= 60) {
    return {
      status: "warning",
      title: "Gap Sedang - Perlu Perhatian",
      description:
        "Provinsi memiliki gap pendidikan yang sedang. Ada ketimpangan dalam distribusi guru, kualitas infrastruktur, dan akses pendidikan. Diperlukan perbaikan bertahap dan monitoring yang ketat.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      icon: AlertTriangle as React.ElementType,
      iconColor: "text-orange-600",
      severity: "Sedang",
    };
  } else if (gapScore >= 40) {
    return {
      status: "moderate",
      title: "Gap Rendah - Kondisi Baik",
      description:
        "Provinsi memiliki gap pendidikan yang rendah. Rasio guru, infrastruktur, dan fasilitas pendidikan sudah cukup baik. Perlu pemeliharaan dan peningkatan bertahap untuk mencapai standar optimal.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: AlertTriangle as React.ElementType,
      iconColor: "text-yellow-600",
      severity: "Rendah",
    };
  } else {
    return {
      status: "excellent",
      title: "Gap Minimal - Kondisi Optimal",
      description:
        "Provinsi memiliki gap pendidikan yang minimal. Rasio guru, infrastruktur, dan fasilitas pendidikan sudah optimal. Fokus pada pemeliharaan kualitas dan inovasi pendidikan.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: CheckCircle as React.ElementType,
      iconColor: "text-green-600",
      severity: "Minimal",
    };
  }
};

interface CurrentSituationSection {
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
  currentBudget: string;
  provinceData?: ProvinceData;
}

const CurrentSituationSection: React.FC<CurrentSituationSection> = ({
  interventionData,
  currentBudget,
  provinceData,
}) => {
  const gapScore =
    provinceData?.province_id == "0b9fb40b-0533-4092-bc06-b4e8ce7c367e"
      ? 61
      : provinceData?.province_id == "5afad633-fc10-4382-acef-13aaaa5f4c26"
      ? 74
      : provinceData?.gap_score || 0;

  const actualCurrentBudget =
    provinceData?.province_id == "0b9fb40b-0533-4092-bc06-b4e8ce7c367e"
      ? 91.43
      : provinceData?.province_id == "5afad633-fc10-4382-acef-13aaaa5f4c26"
      ? 23.24
      : provinceData?.gap_score || 0;

  const teacherReq = calculateTeacherRequirements(provinceData!);
  const schoolReq = calculateSchoolRequirements(provinceData!);

  const generalData = {
    totalStudent: {
      value: provinceData?.total.students.toLocaleString(),
      description: "Total Students",
      icon: <PersonStanding />,
      details: {
        trend: "Enrollment continues to grow",
        status: "stable",
      },
    },
    totalTeacher: {
      value: provinceData?.total.teachers.toLocaleString(),
      description: "Total Teachers",
      icon: <User />,
      currentRatio: teacherReq.current,
      targetRatio: teacherReq.target,
      required: teacherReq.required,
      status: teacherReq.status,
      details: {
        requirement:
          teacherReq.required > 0
            ? `Need ${teacherReq.required.toLocaleString()} additional teachers`
            : "Target ratio achieved",
        trend:
          teacherReq.status === "achieved"
            ? "Target met"
            : "Requires attention",
      },
    },
    totalSchool: {
      value: provinceData?.total.schools.toLocaleString(),
      description: "Total Schools",
      icon: <School />,
      currentRatio: schoolReq.current,
      targetRatio: schoolReq.target,
      required: schoolReq.required,
      status: schoolReq.status,
      details: {
        requirement:
          schoolReq.required > 0
            ? `Need ${schoolReq.required.toLocaleString()} additional schools`
            : "Target ratio achieved",
        trend:
          schoolReq.status === "achieved"
            ? "Target met"
            : "Infrastructure expansion needed",
      },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-10 gap-6">
        {/* Alokasi Anggaran Rekomendasi */}
        <div className="lg:col-span-6 p-8 rounded-2xl border bg-white border-gray-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Current Budget Allocation
            </h3>
          </div>
          <p className="text-xl text-gray-600 font-medium mb-4 flex gap-2">
            Total:{" "}
            <span className="font-bold text-blue-600 flex gap-4 ">
              {`${actualCurrentBudget}T` || "Rp 2.1T"}
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

        <div className="lg:col-span-4 p-8 rounded-2xl border bg-white border-gray-300 flex flex-col items-center justify-between">
          {(() => {
            const gapAnalysis = analyzeGapScore(gapScore);
            const IconComponent = gapAnalysis.icon;

            return (
              <>
                <div className="flex items-center gap-3 mb-4 w-full">
                  <div className={`p-2 rounded-lg ${gapAnalysis.bgColor}`}>
                    <IconComponent
                      className={`w-5 h-5 ${gapAnalysis.iconColor}`}
                    />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${gapAnalysis.color}`}>
                      {gapAnalysis.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Severity: {gapAnalysis.severity}
                    </p>
                  </div>
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
                      stroke={
                        gapAnalysis.status === "critical"
                          ? "#ef4444"
                          : gapAnalysis.status === "warning"
                          ? "#f97316"
                          : gapAnalysis.status === "moderate"
                          ? "#eab308"
                          : "#22c55e"
                      }
                      strokeWidth={16}
                      fill="none"
                      strokeDasharray={2 * Math.PI * 80}
                      strokeDashoffset={2 * Math.PI * 80 * (1 - gapScore / 100)}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 1s" }}
                      transform="rotate(-90 90 90)"
                    />
                  </svg>
                  <div
                    className="absolute flex flex-col items-center justify-center"
                    style={{ left: 0, top: 0, width: 180, height: 180 }}
                  >
                    <span className={`text-5xl font-bold ${gapAnalysis.color}`}>
                      {gapScore}
                    </span>
                    <span className="text-lg text-gray-500 font-medium">
                      / 100
                    </span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg border ${gapAnalysis.bgColor} ${gapAnalysis.borderColor}`}
                >
                  <p className={`text-sm leading-relaxed ${gapAnalysis.color}`}>
                    {gapAnalysis.description}
                  </p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Ratio Analysis Section */}
      {provinceData && <RatioAnalysis provinceData={provinceData} />}



      {/* General Data Section */}
      {/* <div className="grid grid-cols-2 gap-6">
        {Object.entries(generalData).map(([key, value]) => (
          <div
            key={key}
            className={`bg-white rounded-lg p-6 border  border-gray-300 ${
              key === "totalStudent" ? "col-span-2" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">{value.icon}</div>
              <h2 className="text-xl font-semibold text-foreground">
                {value.description}
              </h2>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-primary mb-1">
                {value.value}
              </p>
            </div>

            {(key === "totalTeacher" || key === "totalSchool") && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-gray-700">
                      Current Ratio
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {value.currentRatio}
                    </p>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        value.status === "achieved"
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-yellow-400 to-orange-500"
                      }`}
                      style={{
                        width: value.status === "achieved" ? "100%" : "75%",
                      }}
                    ></div>
                    {value.status !== "achieved" && (
                      <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">Current</p>
                    <p className="text-xs text-green-600 font-medium">
                      Target: {value.targetRatio}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                    <Target className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-green-700 font-medium">
                        Target Ratio
                      </p>
                      <p className="text-sm font-bold text-green-800">
                        {value.targetRatio}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg border ${
                      value.status === "achieved"
                        ? "bg-green-50 border-green-100"
                        : "bg-orange-50 border-orange-100"
                    }`}
                  >
                    <Calculator
                      className={`w-4 h-4 ${
                        value.status === "achieved"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          value.status === "achieved"
                            ? "text-green-700"
                            : "text-orange-700"
                        }`}
                      >
                        {value.status === "achieved"
                          ? "Status"
                          : "Need Additional"}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          value.status === "achieved"
                            ? "text-green-800"
                            : "text-orange-800"
                        }`}
                      >
                        {value.status === "achieved"
                          ? "Target Met!"
                          : `+${value.required?.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {key === "totalStudent" && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm font-medium">{value.details?.trend}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div> */}

      {/* {provinceData && (
        <>
          <TeacherChart provinceData={provinceData} />
          <SchoolsBreakdown provinceData={provinceData} />
        </>
      )} */}
    </div>
  );
};

export default CurrentSituationSection;
