"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTrigger,
} from "@/app/components/ui/stepper";
import ProvinceHeader from "@/app/components/Province/ProvinceHeader";
import CurrentSituationSection from "@/app/components/Province/CurrentSituationSection";
import InterventionRecommendationsSection from "@/app/components/Province/InterventionRecommendationsSection";
import dynamic from 'next/dynamic';

const ProvinceDetailMap = dynamic(
  () => import("@/app/components/Province/ProvinceDetailMap"),
  { ssr: false }
);

import InterventionTimelineSection from "@/app/components/Province/InterventionTimelineSection";
import { Users, Heart, Building } from "lucide-react";
import { useProvince } from "@/app/hooks/use-province";
import { useProvinceStore } from "@/app/store/provinceStore";

const providedData = [
  {
    id: "0b9fb40b-0533-4092-bc06-b4e8ce7c367e",
    name: "Jakarta",
  },
  {
    id: "5afad633-fc10-4382-acef-13aaaa5f4c26",
    name: "Papua",
  },
];

const ProvincePage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("current");
  const { currentMonth, isMapReady, setCurrentMonth, setIsMapReady } = useProvinceStore();

  const provinceName =
    (params.slug as string)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "Jawa Barat";

  // Find matching province in providedData
  const matchingProvince = providedData.find(
    (province) => province.name.toLowerCase() === provinceName.toLowerCase()
  );

  // Fetch data if province exists in providedData, otherwise use null
  const { data, isLoading } = useProvince({
    provinceId: matchingProvince?.id,
  });

  console.log("Province data:", data);
  console.log("Matching province:", matchingProvince);

  // Use real data if available, otherwise fallback to placeholder data
  const provinceData = {
    name: data?.provinces?.name || provinceName,
    population: "48.2 juta", // Placeholder - not in API
    totalStudents: data?.total?.students?.toLocaleString() || "12.1 juta",
    totalTeachers: data?.total?.teachers?.toLocaleString() || "485.000",
    totalSchools: data?.total?.schools?.toLocaleString() || "45.230",
    educationBudget: data?.funding
      ? `Rp ${(data.funding / 1e12).toFixed(1)}T`
      : "Rp 12.3T",
    gapScore: (data as any)?.gap_score || 72,
    ranking: 5, // Placeholder - not in API
    literacy: data?.social?.literacy_rate || 96.4,
    enrollment: data?.social?.school_participation_rate || 98.7,
    budgetAllocation: [
      { name: "Gaji Guru", value: 45.2, color: "#3b82f6" },
      { name: "Infrastruktur", value: 28.3, color: "#10b981" },
      { name: "Program Bantuan", value: 16.8, color: "#f59e0b" },
      { name: "Operasional", value: 9.7, color: "#ef4444" },
    ],
    estimatedBudget: "Rp 2.1T", // Placeholder - calculated recommendation
  };

  const interventionData = {
    expectedGapScore: (data as any)?.gap_score
      ? Math.min(100, (data as any).gap_score + 10)
      : 72,
    headline: {
      title: "Rekomendasi Strategis untuk Peningkatan Kualitas Pendidikan",
      description: `Berdasarkan analisis komprehensif ${
        data?.provinces?.name || provinceName
      }, diperlukan intervensi terfokus pada 3 aspek utama dengan realokasi anggaran sebesar Rp 2.1T untuk mencapai standar nasional dalam 3 tahun ke depan.`,
    },
    budgetRecommendation: [
      {
        name: "Tenaga Pendidik",
        value: 52.5,
        color: "#3b82f6",
        change: "+7.3%",
      },
      {
        name: "Bantuan Langsung",
        value: 25.2,
        color: "#10b981",
        change: "+8.4%",
      },
      {
        name: "Infrastruktur Digital",
        value: 22.3,
        color: "#f59e0b",
        change: "+6.0%",
      },
    ],
    detailedRecommendations: [
      {
        aspect: "Tenaga Pendidik",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        budget: "Rp 6.4T (+15%)",
        actions: [
          "Rekrut 12.500 guru baru untuk mengurangi rasio menjadi 1:16",
          "Program sertifikasi untuk 8.200 guru tidak tersertifikasi",
          "Pelatihan digital untuk 25.000 guru",
          "Peningkatan tunjangan guru daerah terpencil sebesar 25%",
        ],
        targets: [
          "Rasio guru-siswa optimal (1:16) dalam 2 tahun",
          "100% guru tersertifikasi dalam 3 years",
          "Kompetensi digital guru meningkat 40%",
        ],
      },
      {
        aspect: "Bantuan Langsung",
        icon: Heart,
        color: "text-green-600",
        bgColor: "bg-green-50",
        budget: "Rp 3.1T (+35%)",
        actions: [
          "Perluasan Program Indonesia Pintar untuk 450.000 siswa",
          "Bantuan transportasi untuk siswa daerah terpencil",
          "Program makan siang gratis untuk 280.000 siswa SD",
          "Beasiswa prestasi untuk 15.000 siswa SMA/SMK",
        ],
        targets: [
          "Angka putus sekolah turun menjadi <1%",
          "Partisipasi pendidikan mencapai 99.5%",
          "Kesenjangan akses pendidikan berkurang 60%",
        ],
      },
      {
        aspect: "Infrastruktur Digital",
        icon: Building,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        budget: "Rp 2.7T (+50%)",
        actions: [
          "Pembangunan 450 sekolah baru di daerah underserved",
          "Renovasi 1.200 sekolah dengan standar nasional",
          "Internet fiber untuk 2.800 sekolah",
          "Laboratorium komputer untuk 800 SMP/SMA",
        ],
        targets: [
          "100% sekolah memiliki akses internet berkualitas",
          "Rasio siswa per komputer menjadi 8:1",
          "Semua kelas dilengkapi projector digital",
        ],
      },
    ],
  };

  // Show loading state while fetching data
  if (isLoading && matchingProvince) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Loading {provinceName} data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ProvinceHeader
        provinceData={provinceData}
        onBackClick={() => router.push("/")}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper
          defaultValue={1} // Default to the first step
          value={
            activeTab === "current"
              ? 1
              : activeTab === "recommendations"
              ? 2
              : 3
          }
          onValueChange={(value) => {
            if (value === 1) setActiveTab("current");
            else if (value === 2) setActiveTab("recommendations");
            else if (value === 3) setActiveTab("timeline");
          }}
          className="space-y-6 mb-5"
        >
          <div className="mx-auto max-w-7xl space-y-8 text-center">
            <Stepper
              defaultValue={1}
              value={
                activeTab === "current"
                  ? 1
                  : activeTab === "recommendations"
                  ? 2
                  : 3
              }
              onValueChange={(value) => {
                if (value === 1) setActiveTab("current");
                else if (value === 2) setActiveTab("recommendations");
                else if (value === 3) setActiveTab("timeline");
              }}
              className="w-full"
            >
              <StepperItem key={1} step={1} className="not-last:flex-1">
                <StepperTrigger>
                  <StepperIndicator />
                  Current Situation
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
              <StepperItem key={2} step={2} className="not-last:flex-1">
                <StepperTrigger>
                  <StepperIndicator />
                  Funding Recommendation
                </StepperTrigger>
                <StepperSeparator />
              </StepperItem>
              <StepperItem key={3} step={3} className="not-last:flex-1">
                <StepperTrigger>
                  <StepperIndicator />
                  Projected Impact
                </StepperTrigger>
              </StepperItem>
            </Stepper>
          </div>
        </Stepper>

        {/* Content for Stepper Item 1: Current Situations */}
        {activeTab === "current" && (
          <CurrentSituationSection
            interventionData={interventionData}
            estimatedBudget={provinceData.estimatedBudget}
            provinceData={data}
          />
        )}

        {/* Content for Stepper Item 2: Intervention Recommendations */}
        {activeTab === "recommendations" && (
          <InterventionRecommendationsSection
            interventionData={interventionData}
            estimatedBudget={provinceData.estimatedBudget}
            provinceName={provinceName}
            provinceData={data}
          />
        )}

        {/* Content for Stepper Item 3: Intervention Timeline (now includes map) */}
        {activeTab === "timeline" && (
          <div className="space-y-8">
            <ProvinceDetailMap
              provinceName={provinceName}
            />
            <InterventionTimelineSection
              provinceName={provinceName}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvincePage;
