"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/Dashboard/Header";
import { IndonesiaMap } from "@/app/components/Dashboard/IndonesiaMap";
import { KPICard } from "@/app/components/Dashboard/KPICard";
import { TeacherChart } from "@/app/components/Dashboard/TeacherChart";
import { SchoolsBreakdown } from "@/app/components/Dashboard/SchoolsBreakdown";
import { BudgetAllocationPieChart } from "@/app/components/Dashboard/BudgetAllocationPieChart";
import { Footer } from "@/app/components/Dashboard/Footer";
import { PersonStanding, School, User, TrendingUp, Target, Calculator } from "lucide-react";
import { ProvinceData } from "./types/province";
import { calculateSchoolRequirements, calculateTeacherRequirements } from "@/lib/utils";

const Index = ({ data }: { data: ProvinceData }) => {
  const [selectedIndex, setSelectedIndex] = useState("student-performance");
  const router = useRouter();

  // Add null check to prevent runtime errors
  if (!data || !data.total) {
    return <div>Loading...</div>;
  }

  const handleProvinceClick = (province: any) => {
    const provinceSlug = province.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/province/${provinceSlug}`);
  };



  const teacherReq = calculateTeacherRequirements(data);
  const schoolReq = calculateSchoolRequirements(data);

  const generalData = {
    totalStudent: {
      value: data.total.students.toLocaleString(),
      description: "Total Students",
      icon: <PersonStanding />,
      details: {
        trend: "Enrollment continues to grow",
        status: "stable"
      }
    },
    totalTeacher: {
      value: data.total.teachers.toLocaleString(),
      description: "Total Teachers",
      icon: <User />,
      currentRatio: teacherReq.current,
      targetRatio: teacherReq.target,
      required: teacherReq.required,
      status: teacherReq.status,
      details: {
        requirement: teacherReq.required > 0 
          ? `Need ${teacherReq.required.toLocaleString()} additional teachers`
          : "Target ratio achieved",
        trend: teacherReq.status === 'achieved' ? "Target met" : "Requires attention"
      }
    },
    totalSchool: {
      value: data.total.schools.toLocaleString(),
      description: "Total Schools",
      icon: <School />,
      currentRatio: schoolReq.current,
      targetRatio: schoolReq.target,
      required: schoolReq.required,
      status: schoolReq.status,
      details: {
        requirement: schoolReq.required > 0 
          ? `Need ${schoolReq.required.toLocaleString()} additional schools`
          : "Target ratio achieved",
        trend: schoolReq.status === 'achieved' ? "Target met" : "Infrastructure expansion needed"
      }
    },
  };

  const kpiData = {
    "student-performance": [
      {
        title: "Literacy Rate",
        score: Math.round(data.social.literacy_rate),
        maxScore: 100,
        trend: "up" as const,
        trendValue: 2.1,
        description: "National Literacy Level",
        color: "green" as const,
      },
      {
        title: "Human Development Index",
        score: Math.round(data.social.human_development_index),
        maxScore: 100,
        trend: "up" as const,
        trendValue: 1.5,
        description: "Overall Development Score",
        color: "blue" as const,
      },
      {
        title: "Education Completion Rate",
        score: Math.round(data.social.education_completion_rate),
        maxScore: 100,
        trend: "up" as const,
        trendValue: 3.2,
        description: "Student Completion Success",
        color: "blue" as const,
      },
      {
        title: "School Participation Rate",
        score: Math.round(data.social.school_participation_rate),
        maxScore: 100,
        trend: "stable" as const,
        trendValue: 0.8,
        description: "Student Enrollment Rate",
        color: "green" as const,
      },
    ],
  };

  const currentKPIs =
    kpiData[selectedIndex as keyof typeof kpiData] ||
    kpiData["student-performance"];

  const indexDisplayName = {
    "student-performance": "Student Performance Index",
    "budget-allocation": "Budget Allocation Index",
    infrastructure: "Infrastructure Index",
    "educator-workforce": "Teaching Staff Index",
  };

  return (
    <div className="min-h-screen ">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Indonesia Education Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into {data.provinces.name}'s education system
          </p>
        </div>

        {/* 1. Summary KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentKPIs.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi.title}
              score={kpi.score}
              maxScore={kpi.maxScore}
              trend={kpi.trend}
              trendValue={kpi.trendValue}
              description={kpi.description}
              color={kpi.color}
            />
          ))}
        </div>

        {/* 2. Interactive Map */}
        <div className="mb-12">
          <IndonesiaMap
            selectedIndex={
              indexDisplayName[selectedIndex as keyof typeof indexDisplayName]
            }
            onProvinceClick={handleProvinceClick}
          />
        </div>

        {/* 3. Enhanced General Data Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(generalData).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white rounded-lg p-6 border  border-gray-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {value.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {value.description}
                    </h2>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-primary mb-1">
                      {value.value}
                    </p>
                  </div>

                  {/* Ratio Information (for Teachers and Schools) */}
                  {(key === 'totalTeacher' || key === 'totalSchool') && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {/* Progress Bar Section */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-gray-700">Current Ratio</p>
                          <p className="text-sm font-semibold text-gray-900">{value.currentRatio}</p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              value.status === 'achieved' 
                                ? 'bg-gradient-to-r from-green-400 to-green-600' 
                                : 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            }`}
                            style={{
                              width: value.status === 'achieved' ? '100%' : '75%'
                            }}
                          ></div>
                          {/* Target line indicator */}
                          {value.status !== 'achieved' && (
                            <div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-gray-500">Current</p>
                          <p className="text-xs text-green-600 font-medium">Target: {value.targetRatio}</p>
                        </div>
                      </div>

                      {/* Two Info Boxes */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                          <Target className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-green-700 font-medium">Target Ratio</p>
                            <p className="text-sm font-bold text-green-800">{value.targetRatio}</p>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                          value.status === 'achieved' 
                            ? 'bg-green-50 border-green-100' 
                            : 'bg-orange-50 border-orange-100'
                        }`}>
                          <Calculator className={`w-4 h-4 ${
                            value.status === 'achieved' ? 'text-green-600' : 'text-orange-600'
                          }`} />
                          <div>
                            <p className={`text-xs font-medium ${
                              value.status === 'achieved' ? 'text-green-700' : 'text-orange-700'
                            }`}>
                              {value.status === 'achieved' ? 'Status' : 'Need Additional'}
                            </p>
                            <p className={`text-sm font-bold ${
                              value.status === 'achieved' ? 'text-green-800' : 'text-orange-800'
                            }`}>
                              {value.status === 'achieved' 
                                ? 'Target Met!' 
                                : `+${value.required?.toLocaleString()}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Simple details for Students */}
                  {key === 'totalStudent' && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-medium">{value.details?.trend}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* <TeacherChart provinceData={data} />

            <SchoolsBreakdown /> */}
          </div>

          <div className="col-span-1">
            <BudgetAllocationPieChart funding={data.funding} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;