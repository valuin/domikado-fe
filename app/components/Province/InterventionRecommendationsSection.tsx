import React from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Target, TrendingUp, ArrowUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
}

const InterventionRecommendationsSection: React.FC<
  InterventionRecommendationsSectionProps
> = ({ interventionData, estimatedBudget }) => {
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
                    <li key={actionIndex} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-700 text-sm">{action}</span>
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
                        • Kekurangan 12.500 guru untuk mencapai rasio ideal
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
    </div>
  );
};

export default InterventionRecommendationsSection;