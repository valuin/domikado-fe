'use client'
import { useState } from "react";
import { Header } from "@/app/components/Dashboard/Header";
import { IndonesiaMap } from "@/app/components/Dashboard/IndonesiaMap"; 
import { KPICard } from "@/app/components/Dashboard/KPICard";
import { BudgetChart } from "@/app/components/Dashboard/BudgetChart";
import { SchoolsBreakdown } from "@/app/components/Dashboard/SchoolsBreakdown";
import { Footer } from "@/app/components/Dashboard/Footer";
import { useToast } from "@/app/hooks/use-toast";

const Index = () => {
  const [selectedIndex, setSelectedIndex] = useState("student-performance");
  const { toast } = useToast();

  const handleProvinceClick = (province: any) => {
    toast({
      title: `${province.name} Selected`,
      description: `Score: ${province.score}/100 - Provincial details coming soon!`,
    });
  };

  const kpiData = {
    "student-performance": [
      { title: "Student Performance Index", score: 73, maxScore: 100, trend: "up" as const, trendValue: 3.2, description: "PISA + Social Index Combined", color: "blue" as const },
      { title: "PISA Math Score", score: 379, maxScore: 600, trend: "up" as const, trendValue: 1.8, description: "International Assessment", color: "green" as const },
      { title: "Literacy Rate", score: 96, maxScore: 100, trend: "up" as const, trendValue: 0.5, description: "Population 15+ years", color: "green" as const },
      { title: "Completion Rate", score: 89, maxScore: 100, trend: "stable" as const, trendValue: 0, description: "Primary to Secondary", color: "orange" as const }
    ],
    "budget-allocation": [
      { title: "Budget Allocation Index", score: 68, maxScore: 100, trend: "up" as const, trendValue: 4.1, description: "Efficiency & Distribution", color: "blue" as const },
      { title: "Per-Student Spending", score: 1750, maxScore: 3000, trend: "up" as const, trendValue: 8.3, description: "USD per student annually", color: "green" as const },
      { title: "Regional Equity", score: 72, maxScore: 100, trend: "up" as const, trendValue: 2.1, description: "Budget distribution fairness", color: "orange" as const },
      { title: "Utilization Rate", score: 85, maxScore: 100, trend: "down" as const, trendValue: -1.5, description: "Budget absorption capacity", color: "orange" as const }
    ],
    "infrastructure": [
      { title: "Infrastructure Index", score: 65, maxScore: 100, trend: "up" as const, trendValue: 5.2, description: "Buildings & Digital Access", color: "blue" as const },
      { title: "School Buildings", score: 78, maxScore: 100, trend: "up" as const, trendValue: 3.1, description: "Good condition facilities", color: "green" as const },
      { title: "Internet Access", score: 52, maxScore: 100, trend: "up" as const, trendValue: 12.5, description: "Schools with broadband", color: "red" as const },
      { title: "Digital Devices", score: 45, maxScore: 100, trend: "up" as const, trendValue: 15.8, description: "Student-device ratio", color: "red" as const }
    ],
    "educator-workforce": [
      { title: "Educator Workforce Index", score: 71, maxScore: 100, trend: "stable" as const, trendValue: 0.3, description: "Quality & Distribution", color: "blue" as const },
      { title: "Teacher Certification", score: 82, maxScore: 100, trend: "up" as const, trendValue: 4.7, description: "Certified educators %", color: "green" as const },
      { title: "Student-Teacher Ratio", score: 67, maxScore: 100, trend: "down" as const, trendValue: -2.1, description: "Optimal ratio achievement", color: "orange" as const },
      { title: "Professional Development", score: 59, maxScore: 100, trend: "up" as const, trendValue: 6.8, description: "Training participation", color: "orange" as const }
    ]
  };

  const currentKPIs = kpiData[selectedIndex as keyof typeof kpiData] || kpiData["student-performance"];
  
  const indexDisplayName = {
    "student-performance": "Student Performance Index",
    "budget-allocation": "Budget Allocation Index", 
    "infrastructure": "Infrastructure Index",
    "educator-workforce": "Educator Workforce Index"
  };

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Header 
        selectedIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            National Education Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive insights into Indonesia's education system
          </p>
        </div>

        {/* Interactive Map */}
        <div className="mb-12">
          <IndonesiaMap 
            selectedIndex={indexDisplayName[selectedIndex as keyof typeof indexDisplayName]}
            onProvinceClick={handleProvinceClick}
          />
        </div>

        {/* KPI Summary Cards */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <BudgetChart />
          <SchoolsBreakdown />
        </div>

        {/* Additional Insights */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 border border-primary/10">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Key National Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">217,741</div>
              <div className="text-sm text-muted-foreground">Total Schools</div>
              <div className="text-xs text-muted-foreground mt-1">Across all education levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-2">45.3M</div>
              <div className="text-sm text-muted-foreground">Total Students</div>
              <div className="text-xs text-muted-foreground mt-1">From elementary to high school</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">2.9M</div>
              <div className="text-sm text-muted-foreground">Teachers</div>
              <div className="text-xs text-muted-foreground mt-1">Public and private educators</div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;