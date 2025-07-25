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
import dynamic from "next/dynamic";

const ProvinceDetailMap = dynamic(
  () => import("@/app/components/Province/ProvinceDetailMap"),
  { ssr: false }
);

import InterventionTimelineSection from "@/app/components/Province/InterventionTimelineSection";
import { Users, Heart, Building, Calculator } from "lucide-react";
import { useProvince } from "@/app/hooks/use-province";
import { useProvinceStore } from "@/app/store/provinceStore";
import {
  calculateSchoolRequirements,
  calculateTeacherRequirements,
} from "@/lib/utils";

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

  const provinceName =
    (params.slug as string)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "Jawa Barat";

  // Find matching province in providedData
  const matchingProvince = providedData.find(
    (province) => province.name.toLowerCase() === provinceName.toLowerCase()
  );

  const { data, isLoading } = useProvince({
    provinceId: matchingProvince?.id,
  });

  const provinceData = {
    name: data?.provinces?.name || provinceName,
    totalStudents: data?.total?.students?.toLocaleString() || "12.1 juta",
    totalTeachers: data?.total?.teachers?.toLocaleString() || "485.000",
    totalSchools: data?.total?.schools?.toLocaleString() || "45.230",
    educationBudget: data?.funding
      ? `Rp ${(data.funding / 1e12).toFixed(1)}T`
      : "Rp 4.3T",
    gapScore: (data as any)?.gap_score || 72,
    literacy: data?.social?.literacy_rate || 96.4,
    enrollment: data?.social?.school_participation_rate || 98.7,
    budgetAllocation: [
      { name: "Gaji Guru", value: 45.2, color: "#3b82f6" },
      { name: "Infrastruktur", value: 28.3, color: "#10b981" },
      { name: "Program Bantuan", value: 16.8, color: "#f59e0b" },
      { name: "Operasional", value: 9.7, color: "#ef4444" },
    ],
    estimatedBudget: "Rp 28.9T", // Placeholder - calculated recommendation
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

  const teacherReq = calculateTeacherRequirements(data!);
  const schoolReq = calculateSchoolRequirements(data!);

  const interventionData = {
    expectedGapScore: (data as any)?.gap_score
      ? Math.min(100, (data as any).gap_score + 10)
      : 72,
    headline: {
      title: "Rekomendasi Strategis untuk Peningkatan Kualitas Pendidikan",
      description: `Berdasarkan analisis komprehensif ${
        data?.provinces?.name || provinceName
      }, diperlukan intervensi terfokus pada 3 aspek utama dengan realokasi anggaran sebesar Rp 28.9T untuk mencapai standar nasional dalam 3 tahun ke depan.`,
    },
    budgetRecommendation: [
      {
        name: "Tenaga Pendidik",
        value: 45.0,
        color: "#3b82f6",
        change: "+12.5%",
      },
      {
        name: "Infrastruktur",
        value: 35.0,
        color: "#10b981",
        change: "+18.2%",
      },
      {
        name: "Smart Budget",
        value: 20.0,
        color: "#f59e0b",
        change: "+25.0%",
      },
    ],
    detailedRecommendations: [
      {
        aspect: "Tenaga Pendidik",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        budget: `Rp ${(28.9 * 0.45).toFixed(1)}T (45.0%)`,
        actions:
          teacherReq.required > 0
            ? [
                `Rekrut ${teacherReq.required.toLocaleString()} guru baru untuk mencapai rasio optimal 1:16 (saat ini ${teacherReq.current})`,
                `Sertifikasi ${Math.round(data?.total?.teachers * 0.3).toLocaleString()} guru yang belum tersertifikasi`,
                `Pelatihan digital dan pedagogi untuk ${Math.round(data?.total?.teachers * 0.8).toLocaleString()} guru`,
                "Peningkatan tunjangan guru daerah terpencil sebesar 50% (khusus Papua)",
                `Program mentoring untuk ${Math.round(data?.total?.teachers * 0.2).toLocaleString()} guru junior`,
                "Bantuan transportasi dan akomodasi guru di daerah terisolir",
              ]
            : [
                `Sertifikasi ${Math.round(data?.total?.teachers * 0.3).toLocaleString()} guru yang belum tersertifikasi`,
                `Pelatihan digital dan pedagogi untuk ${Math.round(data?.total?.teachers * 0.8).toLocaleString()} guru`,
                "Peningkatan tunjangan guru daerah terpencil sebesar 50% (khusus Papua)",
                `Program mentoring untuk ${Math.round(data?.total?.teachers * 0.2).toLocaleString()} guru junior`,
                "Bantuan transportasi dan akomodasi guru di daerah terisolir",
                "Pengembangan kompetensi kepemimpinan untuk kepala sekolah",
              ],
        targets: [
          `Rasio guru-siswa optimal (1:16) dalam 2 tahun dari ${teacherReq.current} saat ini`,
          "100% guru tersertifikasi dalam 3 tahun",
          "Kompetensi digital guru meningkat 60%",
          "Retensi guru di daerah terpencil meningkat 50%",
          "Tingkat kehadiran guru mencapai 95%",
        ],
      },
      {
        aspect: "Infrastruktur",
        icon: Building,
        color: "text-green-600",
        bgColor: "bg-green-50",
        budget: `Rp ${(28.9 * 0.35).toFixed(1)}T (35.0%)`,
        actions:
          schoolReq.required > 0
            ? [
                `Pembangunan ${schoolReq.required.toLocaleString()} sekolah baru untuk mencapai rasio optimal 1:500 (saat ini ${schoolReq.current})`,
                `Renovasi ${Math.round(data?.total?.schools * 0.4).toLocaleString()} sekolah dengan standar nasional`,
                `Internet satelit dan WiFi untuk ${Math.round(data?.total?.schools * 0.6).toLocaleString()} sekolah (prioritas daerah terpencil)`,
                `Laboratorium komputer untuk ${Math.round(data?.infrastructure?.schools?.senior_high?.total + data?.infrastructure?.schools?.junior_high?.total).toLocaleString()} sekolah menengah`,
                `Perpustakaan dan buku untuk ${Math.round(data?.total?.schools * 0.8).toLocaleString()} sekolah`,
                "Sistem komunikasi satelit untuk koordinasi sekolah terpencil",
                "Pembangunan asrama guru di daerah terisolir",
              ]
            : [
                `Renovasi ${Math.round(data?.total?.schools * 0.4).toLocaleString()} sekolah dengan standar nasional`,
                `Internet satelit dan WiFi untuk ${Math.round(data?.total?.schools * 0.6).toLocaleString()} sekolah (prioritas daerah terpencil)`,
                `Laboratorium komputer untuk ${Math.round(data?.infrastructure?.schools?.senior_high?.total + data?.infrastructure?.schools?.junior_high?.total).toLocaleString()} sekolah menengah`,
                `Perpustakaan dan buku untuk ${Math.round(data?.total?.schools * 0.8).toLocaleString()} sekolah`,
                "Sistem komunikasi satelit untuk koordinasi sekolah terpencil",
                "Pembangunan asrama guru di daerah terisolir",
                "Peningkatan fasilitas olahraga dan seni",
              ],
        targets: [
          `Rasio siswa per sekolah optimal (1:500) dari ${schoolReq.current} saat ini`,
          "70% sekolah memiliki akses internet berkualitas dalam 3 tahun",
          "Semua sekolah menengah memiliki laboratorium komputer",
          "100% sekolah memiliki perpustakaan dengan koleksi memadai",
          "Akses jalan ke 90% sekolah dalam kondisi baik",
        ],
      },
      {
        aspect: "Smart Budget",
        icon: Calculator,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        budget: `Rp ${(28.9 * 0.2).toFixed(1)}T (20.0%)`,
        actions: [
          "Implementasi sistem monitoring anggaran digital real-time",
          "Platform transparansi pengeluaran pendidikan Papua",
          "Analisis data untuk optimasi distribusi anggaran ke daerah terpencil",
          `Program efisiensi energi (solar panel) di ${Math.round(data?.total?.schools * 0.3).toLocaleString()} sekolah`,
          "Sistem procurement digital untuk penghematan 20%",
          "Pelatihan manajemen keuangan untuk semua kepala sekolah",
          "Program bantuan transportasi siswa berbasis data geografis",
        ],
        targets: [
          "Efisiensi anggaran meningkat 25% (fokus distribusi geografis)",
          "Transparansi pengeluaran 100% dapat diakses publik",
          "Penghematan operasional 20% per tahun",
          "Akuntabilitas keuangan mencapai 98%",
          "Biaya transportasi pendidikan turun 30%",
        ],
      },
    ],
  };

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
            currentBudget={provinceData.educationBudget}
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
            <ProvinceDetailMap provinceName={provinceName} />
            <InterventionTimelineSection provinceName={provinceName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvincePage;
