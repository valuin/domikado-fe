"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Badge } from "@/app/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Users,
  School,
  GraduationCap,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Building,
  Heart,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const ProvincePage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("current");

  const provinceName =
    (params.slug as string)
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "Jawa Barat";

  // Mock province data
  const provinceData = {
    name: provinceName,
    population: "48.2 juta",
    totalStudents: "12.1 juta",
    totalTeachers: "485.000",
    totalSchools: "45.230",
    educationBudget: "Rp 12.3T",
    gapScore: 72,
    ranking: 5,
    literacy: 96.4,
    enrollment: 98.7,
    budgetAllocation: [
      { name: "Gaji Guru", value: 45.2, color: "#3b82f6" },
      { name: "Infrastruktur", value: 28.3, color: "#10b981" },
      { name: "Program Bantuan", value: 16.8, color: "#f59e0b" },
      { name: "Operasional", value: 9.7, color: "#ef4444" },
    ],
    estimatedBudget: "Rp 2.1T",
  };

  const currentSituationData = {
    kpiMetrics: [
      {
        title: "Skor PISA Matematika",
        value: 385,
        max: 600,
        status: "warning",
        trend: "+2.1%",
      },
      {
        title: "Rasio Guru-Siswa",
        value: "1:18",
        target: "1:16",
        status: "warning",
        trend: "+0.3%",
      },
      {
        title: "Tingkat Literasi",
        value: "96.4%",
        target: "98%",
        status: "good",
        trend: "+1.2%",
      },
      {
        title: "Angka Partisipasi",
        value: "98.7%",
        target: "99%",
        status: "good",
        trend: "+0.8%",
      },
    ],
    schoolBreakdown: [
      {
        name: "SD/MI",
        count: 28450,
        teachers: 285000,
        students: 4800000,
        ratio: 16.8,
      },
      {
        name: "SMP/MTs",
        count: 12230,
        teachers: 122000,
        students: 1680000,
        ratio: 13.8,
      },
      {
        name: "SMA/SMK",
        count: 4550,
        teachers: 78000,
        students: 980000,
        ratio: 12.6,
      },
    ],
    budgetAllocation: [
      { name: "Gaji Guru", value: 45.2, color: "#3b82f6" },
      { name: "Infrastruktur", value: 28.3, color: "#10b981" },
      { name: "Program Bantuan", value: 16.8, color: "#f59e0b" },
      { name: "Operasional", value: 9.7, color: "#ef4444" },
    ],
  };

  const interventionData = {
    expectedGapScore: 72,
    headline: {
      title: "Rekomendasi Strategis untuk Peningkatan Kualitas Pendidikan",
      description:
        "Berdasarkan analisis komprehensif, diperlukan intervensi terfokus pada 3 aspek utama dengan realokasi anggaran sebesar Rp 2.1T untuk mencapai standar nasional dalam 3 tahun ke depan.",
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
          "100% guru tersertifikasi dalam 3 tahun",
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-primary font-bold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Button>
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {provinceData.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Provinsi • Peringkat #{provinceData.ranking} Nasional
                  </p>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Skor Gap: {provinceData.gapScore}/100
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-5 border border-primary/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Total Siswa
                </h2>
              </div>
              <p className="text-2xl font-bold text-primary">
                {provinceData.totalStudents}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-primary/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Total Guru
                </h2>
              </div>
              <p className="text-2xl font-bold text-primary">
                {provinceData.totalTeachers}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-primary/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Total Sekolah
                </h2>
              </div>
              <p className="text-2xl font-bold text-primary">
                {provinceData.totalSchools}
              </p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-primary/10 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Anggaran
                </h2>
              </div>
              <p className="text-2xl font-bold text-primary">
                {provinceData.educationBudget}
              </p>
            </div>
          </div>
        </div>
      </div>

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
            {/* KPI Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentSituationData.kpiMetrics.map((metric, index) => (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </h3>
                      {metric.status === "good" ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-warning" />
                      )}
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {metric.value}
                    </div>
                    {metric.target && (
                      <div className="text-xs text-muted-foreground mb-2">
                        Target: {metric.target}
                      </div>
                    )}
                    <div className="text-xs text-success font-medium">
                      {metric.trend}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* School Breakdown & Budget */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* School Breakdown */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <School className="h-5 w-5 text-primary" />
                    Rincian Sekolah Berdasarkan Jenjang
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentSituationData.schoolBreakdown.map(
                      (school, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{school.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {school.count.toLocaleString()} sekolah
                              </p>
                            </div>
                            <Badge
                              variant={
                                school.ratio <= 16 ? "default" : "secondary"
                              }
                            >
                              Rasio 1:{school.ratio}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Guru:{" "}
                              </span>
                              <span className="font-medium">
                                {school.teachers.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Siswa:{" "}
                              </span>
                              <span className="font-medium">
                                {school.students.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Budget Allocation */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Alokasi Anggaran Saat Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={currentSituationData.budgetAllocation}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {currentSituationData.budgetAllocation.map(
                            (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            )
                          )}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab 2: Intervention Recommendations */}
          <TabsContent value="recommendations" className="space-y-8">
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
              <div className="lg:col-span-6 p-8 rounded-2xl border border-gray-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Alokasi Anggaran Rekomendasi
                  </h3>
                </div>
                <p className="text-xl text-gray-600 font-medium mb-4 flex gap-2">
                  Total:{" "}
                  <span className="font-bold text-blue-600 flex gap-4 ">
                    {provinceData.estimatedBudget || "Rp 2.1T"}
                  </span>
                </p>
                <div className="h-[320px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={provinceData.budgetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {provinceData.budgetAllocation.map(
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
                    {provinceData.budgetAllocation.map(
                      (item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-gray-600">
                            {item.name}
                          </span>
                          <span className="text-sm font-semibold">
                            {item.value}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Expected Impact to Gap Score */}
              <div className="lg:col-span-4 p-8 rounded-2xl border border-gray-300 flex flex-col items-center justify-between">
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
                    <span className="text-lg text-gray-500 font-medium">
                      / 100
                    </span>
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

            {/* Detailed Recommendations */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">
                Rincian Rekomendasi per Aspek
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {interventionData.detailedRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white/80 border border-gray-300 p-6 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {rec.aspect}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rec.aspect === "Tenaga Pendidik"
                            ? "bg-red-100 text-red-700"
                            : rec.aspect === "Bantuan Langsung"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {rec.aspect === "Tenaga Pendidik"
                          ? "High"
                          : rec.aspect === "Bantuan Langsung"
                          ? "Medium"
                          : "Low"}{" "}
                        Priority
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">
                      {rec.aspect === "Tenaga Pendidik"
                        ? "Peningkatan kualitas dan kuantitas tenaga pendidik untuk mencapai rasio guru-siswa optimal dan meningkatkan kompetensi pengajaran."
                        : rec.aspect === "Bantuan Langsung"
                        ? "Program bantuan langsung untuk meningkatkan akses pendidikan dan mengurangi angka putus sekolah di daerah."
                        : "Pembangunan dan peningkatan infrastruktur digital untuk mendukung pembelajaran modern dan akses teknologi."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">
                          Alokasi Anggaran
                        </h5>
                        <p className="text-blue-800">{rec.budget}</p>
                        <p className="text-sm text-blue-600 mt-1">
                          {rec.aspect === "Tenaga Pendidik"
                            ? "52.5%"
                            : rec.aspect === "Bantuan Langsung"
                            ? "25.2%"
                            : "22.3%"}{" "}
                          dari total anggaran
                        </p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">
                          Target Pencapaian
                        </h5>
                        <div className="text-green-800 text-sm space-y-1">
                          {rec.targets.slice(0, 2).map((target, idx) => (
                            <p key={idx}>• {target}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h5 className="font-semibold text-gray-900 mb-3">
                        Rencana Aksi
                      </h5>
                      <ul className="space-y-2">
                        {rec.actions.map((action, actionIndex) => (
                          <li
                            key={actionIndex}
                            className="flex items-start gap-2"
                          >
                            <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700 text-sm">
                              {action}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                      <h5 className="font-semibold text-orange-900 mb-2">
                        Tantangan & Gap Saat Ini
                      </h5>
                      <div className="text-orange-800 text-sm space-y-1">
                        {rec.aspect === "Tenaga Pendidik" && (
                          <>
                            <p>
                              • Kekurangan 12.500 guru untuk mencapai rasio
                              ideal
                            </p>
                            <p>• 8.200 guru belum tersertifikasi</p>
                            <p>
                              • Kompetensi digital guru masih rendah (60% belum
                              terlatih)
                            </p>
                          </>
                        )}
                        {rec.aspect === "Bantuan Langsung" && (
                          <>
                            <p>• 450.000 siswa belum mendapat bantuan PIP</p>
                            <p>
                              • Angka putus sekolah masih 2.3% (target &lt;1%)
                            </p>
                            <p>
                              • Kesenjangan akses pendidikan di daerah terpencil
                            </p>
                          </>
                        )}
                        {rec.aspect === "Infrastruktur Digital" && (
                          <>
                            <p>• 2.800 sekolah belum memiliki akses internet</p>
                            <p>
                              • Rasio siswa per komputer masih 15:1 (target 8:1)
                            </p>
                            <p>• 40% kelas belum memiliki perangkat digital</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProvincePage;
