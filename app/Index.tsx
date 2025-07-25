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
import { PersonStanding, School, User } from "lucide-react";
import { ProvinceData } from "./types/province";

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

  const generalData = {
    totalStudent: {
      value: data.total.students.toLocaleString(),
      description: "Total Students",
      icon: <PersonStanding />,
    },
    totalTeacher: {
      value: data.total.teachers.toLocaleString(),
      description: "Total Teachers",
      icon: <User />,
    },
    totalSchool: {
      value: data.total.schools.toLocaleString(),
      description: "Total Schools",
      icon: <School />,
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

        {/* 3. Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="col-span-2 flex flex-col gap-8">
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(generalData).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white rounded-lg p-5 border border-primary/10 flex flex-col gap-2"
                >
                  <div className="flex items-center gap-2 ">
                    {value.icon}
                    <h2 className="text-xl font-semibold  text-foreground">
                      {value.description}
                    </h2>
                  </div>
                  <p className="text-2xl font-bold text-primary ">
                    {value.value}
                  </p>
                </div>
              ))}
            </div>
            <TeacherChart provinceData={data} />

            <SchoolsBreakdown />
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
