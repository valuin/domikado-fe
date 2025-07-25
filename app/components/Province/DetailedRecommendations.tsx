import React from "react";

interface DetailedRecommendation {
  aspect: string;
  icon: any;
  color: string;
  bgColor: string;
  budget: string;
  actions: string[];
  targets: string[];
}

interface DetailedRecommendationsProps {
  interventionData: {
    detailedRecommendations: DetailedRecommendation[];
  };
}

export default function DetailedRecommendations({
  interventionData,
}: DetailedRecommendationsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-foreground">
        Detailed Recommendations by Aspect
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
                    : rec.aspect === "Infrastruktur"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {rec.aspect === "Tenaga Pendidik"
                  ? "High"
                  : rec.aspect === "Infrastruktur"
                  ? "Medium"
                  : "Medium"}{" "}
                Priority
              </span>
            </div>

            <p className="text-gray-700 mb-4">
              {rec.aspect === "Tenaga Pendidik"
                ? "Meningkatkan kualitas dan kuantitas tenaga pendidik untuk mencapai rasio guru-siswa optimal dan meningkatkan kompetensi mengajar."
                : rec.aspect === "Infrastruktur"
                ? "Pengembangan dan perbaikan infrastruktur fisik dan digital untuk mendukung pembelajaran modern dan akses teknologi."
                : "Implementasi sistem manajemen anggaran yang cerdas dan transparan untuk optimasi penggunaan dana pendidikan."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">
                  Budget Allocation
                </h5>
                <p className="text-blue-800">{rec.budget}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {rec.aspect === "Tenaga Pendidik"
                    ? "45.0%"
                    : rec.aspect === "Infrastruktur"
                    ? "35.0%"
                    : "20.0%"}{" "}
                  of total budget
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold text-green-900 mb-2">
                  Achievement Targets
                </h5>
                <div className="text-green-800 text-sm space-y-1">
                  {rec.targets.slice(0, 2).map((target, idx) => (
                    <p key={idx}>• {target}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="font-semibold text-gray-900 mb-3">Action Plan</h5>
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
                Current Challenges & Gaps
              </h5>
              <div className="text-orange-800 text-sm space-y-1">
                {rec.aspect === "Teaching Staff" && (
                  <>
                    <p>• Shortage of 12,500 teachers to achieve ideal ratio</p>
                    <p>• 8,200 teachers not yet certified</p>
                    <p>
                      • Low digital competency among teachers (60% untrained)
                    </p>
                  </>
                )}
                {rec.aspect === "Direct Assistance" && (
                  <>
                    <p>• 450,000 students have not received PIP assistance</p>
                    <p>• Dropout rate still at 2.3% (target &lt;1%)</p>
                    <p>• Educational access gaps in remote areas</p>
                  </>
                )}
                {rec.aspect === "Digital Infrastructure" && (
                  <>
                    <p>• 2,800 schools lack internet access</p>
                    <p>• Student-computer ratio still 15:1 (target 8:1)</p>
                    <p>• 40% of classrooms lack digital devices</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
