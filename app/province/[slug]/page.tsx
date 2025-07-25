"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import ProvinceHeader from "@/app/components/Province/ProvinceHeader";
import CurrentSituationSection from "@/app/components/Province/CurrentSituationSection";
import InterventionRecommendationsSection from "@/app/components/Province/InterventionRecommendationsSection";
import { Users, Heart, Building, Calculator } from "lucide-react";
import { useProvince } from "@/app/hooks/use-province";

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
  const [activeTab, setActiveTab] = useState("current");

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

  console.log("Province data:", data);
  console.log("Matching province:", matchingProvince);

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
        budget: "Rp 5.5T (+12.5%)",
        actions: [
          "Rekrut 15.000 guru baru untuk mencapai rasio optimal 1:16",
          "Program sertifikasi untuk 10.000 guru tidak tersertifikasi",
          "Pelatihan digital dan pedagogi untuk 30.000 guru",
          "Peningkatan tunjangan guru daerah terpencil sebesar 30%",
          "Program mentoring guru senior untuk guru junior",
        ],
        targets: [
          "Rasio guru-siswa optimal (1:16) dalam 2 tahun",
          "100% guru tersertifikasi dalam 3 tahun",
          "Kompetensi digital guru meningkat 50%",
          "Retensi guru di daerah terpencil meningkat 40%",
        ],
      },
      {
        aspect: "Infrastruktur",
        icon: Building,
        color: "text-green-600",
        bgColor: "bg-green-50",
        budget: "Rp 4.3T (+18.2%)",
        actions: [
          "Pembangunan 600 sekolah baru di daerah underserved",
          "Renovasi 1.500 sekolah dengan standar nasional",
          "Internet fiber dan WiFi untuk 3.500 sekolah",
          "Laboratorium komputer dan sains untuk 1.000 sekolah",
          "Pembangunan perpustakaan digital di 2.000 sekolah",
          "Sistem keamanan dan CCTV di semua sekolah",
        ],
        targets: [
          "100% sekolah memiliki akses internet berkualitas",
          "Rasio siswa per komputer menjadi 6:1",
          "Semua kelas dilengkapi projector dan smart board",
          "100% sekolah memiliki perpustakaan digital",
        ],
      },
      {
        aspect: "Smart Budget",
        icon: Calculator,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        budget: "Rp 2.4T (+25.0%)",
        actions: [
          "Implementasi sistem monitoring anggaran real-time",
          "Platform digital untuk transparansi pengeluaran",
          "Analisis data untuk optimasi alokasi anggaran",
          "Program efisiensi energi di 5.000 sekolah",
          "Sistem procurement digital untuk penghematan 15%",
          "Pelatihan manajemen keuangan untuk 2.000 kepala sekolah",
        ],
        targets: [
          "Efisiensi anggaran meningkat 20%",
          "Transparansi pengeluaran 100% real-time",
          "Penghematan operasional 15% per tahun",
          "Akuntabilitas keuangan mencapai 95%",
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
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="current">Situasi Saat Ini</TabsTrigger>
            <TabsTrigger value="recommendations">
              Rekomendasi Intervensi
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Current Situations */}
          <TabsContent value="current" className="space-y-8">
            <CurrentSituationSection
              interventionData={interventionData}
              currentBudget={provinceData.educationBudget}
              provinceData={data}
            />
          </TabsContent>

          {/* Tab 2: Intervention Recommendations */}
          <TabsContent value="recommendations" className="space-y-8">
            <InterventionRecommendationsSection
              interventionData={interventionData}
              estimatedBudget={provinceData.estimatedBudget}
              provinceName={provinceName}
              provinceData={data}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProvincePage;
