import { AlertTriangle, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const reference = {
  province_id: "5afad633-fc10-4382-acef-13aaaa5f4c26",
  infrastructure: {
    ratios: {
      student_to_school_elementary: "1:137",
      student_to_school_junior_high: "1:183",
      student_to_school_higher_education: "1:1",
      student_to_school_senior_high_vocational: "1:275",
    },
    schools: {
      elementary: { total: 857, public: 515, private: 335, special_needs: 7 },
      junior_high: { total: 283, public: 196, private: 80, special_needs: 7 },
      senior_high: { total: 124, public: 62, private: 56, special_needs: 6 },
      higher_education: { total: 0, public: 0, private: 0, official: 0 },
    },
    students: {
      elementary: {
        total: 118152,
        public: 70293,
        private: 47619,
        special_needs: 240,
      },
      junior_high: {
        total: 51786,
        public: 39424,
        private: 12244,
        special_needs: 138,
      },
      senior_high: {
        total: 34136,
        public: 23108,
        private: 10946,
        special_needs: 82,
      },
      higher_education: { total: 0, public: 0, private: 0, official: 0 },
    },
  },
  workers: {
    ratios: {
      student_to_teacher_elementary: "1:15",
      student_to_teacher_junior_high: "1:42",
      student_to_teacher_higher_education: "1:1",
      student_to_teacher_senior_high_vocational: "1:14",
    },
    teachers: {
      elementary: {
        total: 7919,
        public: 5195,
        private: 2694,
        special_needs: 30,
      },
      junior_high: {
        total: 1247,
        public: 402,
        private: 828,
        special_needs: 17,
      },
      senior_high: {
        total: 2407,
        public: 1630,
        private: 766,
        special_needs: 11,
      },
      higher_education: {
        total: 575,
        public: 375,
        private: 200,
        special_needs: 0,
      },
    },
  },
  funding: 2100000000000,
  social: {
    literacy_rate: 47.57,
    poverty_index: 18.09,
    human_development_index: 73,
    education_completion_rate: 62.24,
    school_participation_rate: 91.48,
  },
  provinces: {
    id: "5afad633-fc10-4382-acef-13aaaa5f4c26",
    name: "Papua",
  },
  gap_score: 94,
};

const TOTAL_BUDGET = 81_700_000_000_000; // 81.7T
const TOTAL_ALLOCATION_FACTOR = 1900;

// Scoring functions
const literacyRateScore = (value) => Math.min(1, value / 95); // Target 95%
const povertyIndexScore = (value) => Math.max(0, (25 - value) / 25); // Inverse, lower is better
const hdiScore = (value) => Math.min(1, value / 85); // Target HDI 85
const completionRateScore = (value) => Math.min(1, value / 95); // Target 95%
const participationRateScore = (value) => Math.min(1, value / 98); // Target 98%

const infrastructureScore = (data) => {
  const totalStudents =
    data.infrastructure.students.elementary.total +
    data.infrastructure.students.junior_high.total +
    data.infrastructure.students.senior_high.total;
  const totalSchools =
    data.infrastructure.schools.elementary.total +
    data.infrastructure.schools.junior_high.total +
    data.infrastructure.schools.senior_high.total;

  const avgStudentPerSchool = totalStudents / totalSchools;
  const idealRatio = 200; // Ideal students per school
  return Math.max(0, Math.min(1, idealRatio / avgStudentPerSchool));
};

const teacherRatioScore = (data) => {
  const totalStudents =
    data.infrastructure.students.elementary.total +
    data.infrastructure.students.junior_high.total +
    data.infrastructure.students.senior_high.total;
  const totalTeachers =
    data.workers.teachers.elementary.total +
    data.workers.teachers.junior_high.total +
    data.workers.teachers.senior_high.total;

  const studentTeacherRatio = totalStudents / totalTeachers;
  const idealRatio = 20; // Ideal 1:20 ratio
  return Math.max(0, Math.min(1, idealRatio / studentTeacherRatio));
};

const fundingAdequacyScore = (data) => {
  const totalStudents =
    data.infrastructure.students.elementary.total +
    data.infrastructure.students.junior_high.total +
    data.infrastructure.students.senior_high.total;
  const fundingPerStudent = data.funding / totalStudents;
  const idealFundingPerStudent = 15_000_000; // Rp 15 juta per siswa per tahun
  return Math.min(1, fundingPerStudent / idealFundingPerStudent);
};

const specialNeedsScore = (data) => {
  const totalSpecialStudents =
    data.infrastructure.students.elementary.special_needs +
    data.infrastructure.students.junior_high.special_needs +
    data.infrastructure.students.senior_high.special_needs;

  const totalSpecialSchools =
    data.infrastructure.schools.elementary.special_needs +
    data.infrastructure.schools.junior_high.special_needs +
    data.infrastructure.schools.senior_high.special_needs;

  if (totalSpecialStudents === 0) return 1;

  const specialStudentPerSchool =
    totalSpecialStudents / Math.max(1, totalSpecialSchools);
  const idealSpecialRatio = 30; // Ideal 30 students per special school
  return Math.max(0, Math.min(1, idealSpecialRatio / specialStudentPerSchool));
};

const allParameters = [
  {
    id: "literacy_rate",
    label: "Tingkat Literasi",
    getValue: (data) => `${data.social.literacy_rate}%`,
    scoreFunction: (data) => literacyRateScore(data.social.literacy_rate),
  },
  {
    id: "poverty_index",
    label: "Indeks Kemiskinan",
    getValue: (data) => `${data.social.poverty_index}%`,
    scoreFunction: (data) => povertyIndexScore(data.social.poverty_index),
  },
  {
    id: "human_development_index",
    label: "Indeks Pembangunan Manusia",
    getValue: (data) => data.social.human_development_index,
    scoreFunction: (data) => hdiScore(data.social.human_development_index),
  },
  {
    id: "education_completion_rate",
    label: "Tingkat Penyelesaian Pendidikan",
    getValue: (data) => `${data.social.education_completion_rate}%`,
    scoreFunction: (data) =>
      completionRateScore(data.social.education_completion_rate),
  },
  {
    id: "school_participation_rate",
    label: "Angka Partisipasi Sekolah",
    getValue: (data) => `${data.social.school_participation_rate}%`,
    scoreFunction: (data) =>
      participationRateScore(data.social.school_participation_rate),
  },
  {
    id: "infrastructure_score",
    label: "Skor Infrastruktur Sekolah",
    getValue: (data) => "Lihat Detail Kalkulasi",
    scoreFunction: (data) => infrastructureScore(data),
  },
  {
    id: "teacher_ratio_score",
    label: "Rasio Guru-Siswa",
    getValue: (data) => "Lihat Detail Kalkulasi",
    scoreFunction: (data) => teacherRatioScore(data),
  },
  {
    id: "funding_adequacy",
    label: "Kecukupan Pendanaan",
    getValue: (data) => `Rp ${(data.funding / 1_000_000_000).toFixed(1)}M`,
    scoreFunction: (data) => fundingAdequacyScore(data),
  },
  {
    id: "special_needs_score",
    label: "Layanan Pendidikan Khusus",
    getValue: (data) => "Lihat Detail Kalkulasi",
    scoreFunction: (data) => specialNeedsScore(data),
  },
];

const formatCurrency = (value) => {
  if (typeof value !== "number" || isNaN(value)) return "N/A";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const getParameterRecommendations = (data, scores, totalAllocation) => {
  const recommendations = [];
  const MAX_ALLOCATION_PERCENTAGE = 0.15; // 15%
  const maxBudgetPerParameter = totalAllocation * MAX_ALLOCATION_PERCENTAGE;

  // Infrastructure Recommendations
  if (scores.infrastructure_score && scores.infrastructure_score.score < 0.7) {
    const totalStudents =
      data.infrastructure.students.elementary.total +
      data.infrastructure.students.junior_high.total +
      data.infrastructure.students.senior_high.total;
    const totalSchools =
      data.infrastructure.schools.elementary.total +
      data.infrastructure.schools.junior_high.total +
      data.infrastructure.schools.senior_high.total;

    const currentRatio = totalStudents / totalSchools;
    const targetRatio = 200;

    if (currentRatio > targetRatio) {
      const schoolsNeeded = Math.ceil(
        totalStudents / targetRatio - totalSchools
      );
      const costPerSchool = 3_000_000_000; // Rp 3 miliar per sekolah
      const affordableSchools = Math.min(
        schoolsNeeded,
        Math.floor(maxBudgetPerParameter / costPerSchool)
      );

      if (affordableSchools > 0) {
        const actualCost = affordableSchools * costPerSchool;
        const budgetUtilization = (actualCost / maxBudgetPerParameter) * 100;

        recommendations.push({
          parameter: "Infrastruktur Sekolah",
          priority: currentRatio > 300 ? "High" : "Medium",
          totalNeeded: { schools: schoolsNeeded },
          affordable: { schools: affordableSchools },
          gap: {
            unfundedSchools: schoolsNeeded - affordableSchools,
            currentRatio: currentRatio.toFixed(0),
            targetRatio: targetRatio,
          },
          cost: actualCost,
          budgetUtilization: budgetUtilization,
          maxBudget: maxBudgetPerParameter,
          description: `Dapat membangun ${affordableSchools} dari ${schoolsNeeded} sekolah yang dibutuhkan`,
          actions: [
            `Pembangunan ${affordableSchools} unit sekolah baru`,
            "Rehabilitasi sekolah existing yang rusak",
            "Penyediaan fasilitas penunjang pembelajaran",
            "Program pembangunan sekolah bertahap",
            affordableSchools < schoolsNeeded
              ? `Perlu ${
                  schoolsNeeded - affordableSchools
                } sekolah tambahan di tahap selanjutnya`
              : null,
          ].filter(Boolean),
        });
      }
    }
  }

  // Teacher Ratio Recommendations
  if (scores.teacher_ratio_score && scores.teacher_ratio_score.score < 0.7) {
    const totalStudents =
      data.infrastructure.students.elementary.total +
      data.infrastructure.students.junior_high.total +
      data.infrastructure.students.senior_high.total;
    const totalTeachers =
      data.workers.teachers.elementary.total +
      data.workers.teachers.junior_high.total +
      data.workers.teachers.senior_high.total;

    const currentRatio = totalStudents / totalTeachers;
    const targetRatio = 20;

    if (currentRatio > targetRatio) {
      const teachersNeeded = Math.ceil(
        totalStudents / targetRatio - totalTeachers
      );
      const costPerTeacher = 600_000_000; // Rp 600 juta per guru (gaji + tunjangan + pelatihan)
      const affordableTeachers = Math.min(
        teachersNeeded,
        Math.floor(maxBudgetPerParameter / costPerTeacher)
      );

      if (affordableTeachers > 0) {
        const actualCost = affordableTeachers * costPerTeacher;
        const budgetUtilization = (actualCost / maxBudgetPerParameter) * 100;

        recommendations.push({
          parameter: "Kebutuhan Guru",
          priority: currentRatio > 30 ? "High" : "Medium",
          totalNeeded: { teachers: teachersNeeded },
          affordable: { teachers: affordableTeachers },
          gap: {
            unfundedTeachers: teachersNeeded - affordableTeachers,
            currentRatio: `1:${currentRatio.toFixed(0)}`,
            targetRatio: `1:${targetRatio}`,
          },
          cost: actualCost,
          budgetUtilization: budgetUtilization,
          maxBudget: maxBudgetPerParameter,
          description: `Dapat merekrut ${affordableTeachers} dari ${teachersNeeded} guru yang dibutuhkan`,
          actions: [
            `Rekrutmen ${affordableTeachers} guru baru`,
            "Program pelatihan dan sertifikasi guru",
            "Peningkatan kesejahteraan guru",
            "Program guru kontrak dengan tunjangan kompetitif",
            affordableTeachers < teachersNeeded
              ? `Perlu ${
                  teachersNeeded - affordableTeachers
                } guru tambahan di tahap selanjutnya`
              : null,
          ].filter(Boolean),
        });
      }
    }
  }

  // Literacy Rate Recommendations
  if (scores.literacy_rate && scores.literacy_rate.score < 0.7) {
    const currentLiteracy = data.social.literacy_rate;
    const targetLiteracy = 95;
    const literacyGap = targetLiteracy - currentLiteracy;

    if (literacyGap > 0) {
      const totalPopulation = 3_265_000; // Estimasi populasi Papua
      const illiteratePopulation = Math.round(
        (literacyGap * totalPopulation) / 100
      );
      const costPerPerson = 2_000_000; // Rp 2 juta per orang program literasi
      const affordablePeople = Math.min(
        illiteratePopulation,
        Math.floor(maxBudgetPerParameter / costPerPerson)
      );

      if (affordablePeople > 0) {
        const actualCost = affordablePeople * costPerPerson;
        const budgetUtilization = (actualCost / maxBudgetPerParameter) * 100;
        const achievableLiteracy =
          currentLiteracy + (affordablePeople / totalPopulation) * 100;

        recommendations.push({
          parameter: "Program Literasi",
          priority: currentLiteracy < 60 ? "High" : "Medium",
          totalNeeded: {
            literacyGap: literacyGap.toFixed(1),
            peopleNeedingLiteracy: illiteratePopulation,
          },
          affordable: {
            peopleToEducate: affordablePeople,
            achievableLiteracy: achievableLiteracy.toFixed(1),
          },
          gap: {
            remainingIlliterate: illiteratePopulation - affordablePeople,
            currentLiteracy: currentLiteracy,
            remainingGap: (targetLiteracy - achievableLiteracy).toFixed(1),
          },
          cost: actualCost,
          budgetUtilization: budgetUtilization,
          maxBudget: maxBudgetPerParameter,
          description: `Dapat memberikan program literasi kepada ${affordablePeople.toLocaleString(
            "id-ID"
          )} orang (meningkatkan literasi menjadi ${achievableLiteracy.toFixed(
            1
          )}%)`,
          actions: [
            `Program literasi untuk ${affordablePeople.toLocaleString(
              "id-ID"
            )} orang dewasa`,
            "Pembangunan taman bacaan masyarakat",
            "Program keaksaraan fungsional",
            "Pelatihan tutor literasi komunitas",
            affordablePeople < illiteratePopulation
              ? `Perlu program tambahan untuk ${(
                  illiteratePopulation - affordablePeople
                ).toLocaleString("id-ID")} orang`
              : null,
          ].filter(Boolean),
        });
      }
    }
  }

  // Education Completion Rate Recommendations
  if (
    scores.education_completion_rate &&
    scores.education_completion_rate.score < 0.7
  ) {
    const currentCompletion = data.social.education_completion_rate;
    const targetCompletion = 95;
    const completionGap = targetCompletion - currentCompletion;

    if (completionGap > 0) {
      const schoolAgePopulation = 600_000; // Estimasi populasi usia sekolah
      const dropoutPopulation = Math.round(
        (completionGap * schoolAgePopulation) / 100
      );
      const costPerStudent = 8_000_000; // Rp 8 juta per siswa program pencegahan dropout
      const affordableStudents = Math.min(
        dropoutPopulation,
        Math.floor(maxBudgetPerParameter / costPerStudent)
      );

      if (affordableStudents > 0) {
        const actualCost = affordableStudents * costPerStudent;
        const budgetUtilization = (actualCost / maxBudgetPerParameter) * 100;
        const achievableCompletion =
          currentCompletion + (affordableStudents / schoolAgePopulation) * 100;

        recommendations.push({
          parameter: "Pencegahan Putus Sekolah",
          priority: currentCompletion < 70 ? "High" : "Medium",
          totalNeeded: {
            completionGap: completionGap.toFixed(1),
            dropoutStudents: dropoutPopulation,
          },
          affordable: {
            studentsToSupport: affordableStudents,
            achievableCompletion: achievableCompletion.toFixed(1),
          },
          gap: {
            remainingDropouts: dropoutPopulation - affordableStudents,
            currentCompletion: currentCompletion,
            remainingGap: (targetCompletion - achievableCompletion).toFixed(1),
          },
          cost: actualCost,
          budgetUtilization: budgetUtilization,
          maxBudget: maxBudgetPerParameter,
          description: `Dapat mencegah putus sekolah ${affordableStudents.toLocaleString(
            "id-ID"
          )} siswa (meningkatkan completion rate menjadi ${achievableCompletion.toFixed(
            1
          )}%)`,
          actions: [
            `Program beasiswa untuk ${affordableStudents.toLocaleString(
              "id-ID"
            )} siswa berisiko dropout`,
            "Program bantuan operasional sekolah tambahan",
            "Konseling dan bimbingan siswa",
            "Program makanan sekolah gratis",
            affordableStudents < dropoutPopulation
              ? `Perlu program tambahan untuk ${(
                  dropoutPopulation - affordableStudents
                ).toLocaleString("id-ID")} siswa`
              : null,
          ].filter(Boolean),
        });
      }
    }
  }

  return recommendations.sort((a, b) => {
    if (a.priority === "High" && b.priority !== "High") return -1;
    if (b.priority === "High" && a.priority !== "High") return 1;
    return b.budgetUtilization - a.budgetUtilization;
  });
};

const EducationBudgetCalculator = ({
  isCompact = false,
  regionData = reference,
}) => {
  const [selectedParamIds, setSelectedParamIds] = useState([
    "literacy_rate",
    "infrastructure_score",
    "teacher_ratio_score",
  ]);
  const [calculatedScores, setCalculatedScores] = useState({});
  const [combinedGapScore, setCombinedGapScore] = useState(0);
  const [allocation, setAllocation] = useState(0);
  const [recommendations, setRecommendations] = useState([]);

  const handleChipToggle = (paramId) => {
    setSelectedParamIds((prev) =>
      prev.includes(paramId)
        ? prev.filter((id) => id !== paramId)
        : [...prev, paramId]
    );
  };

  useEffect(() => {
    if (selectedParamIds.length === 0) {
      setCalculatedScores({});
      setCombinedGapScore(0);
      setAllocation(0);
      setRecommendations([]);
      return;
    }

    const currentRegionData = regionData;
    const newScores = {};
    let totalGap = 0;
    const weightPerParam = 1 / selectedParamIds.length;

    allParameters.forEach((param) => {
      if (selectedParamIds.includes(param.id)) {
        const score = param.scoreFunction(currentRegionData);
        newScores[param.id] = {
          label: param.label,
          rawValue: param.getValue(currentRegionData),
          score: score,
          gap: 1 - score,
          weight: weightPerParam,
        };
        totalGap += 1 - score;
      }
    });

    const currentCombinedGapScore = (totalGap / selectedParamIds.length) * 100; // Convert to 0-100 scale

    const calculatedAllocation =
      (currentCombinedGapScore / TOTAL_ALLOCATION_FACTOR) * TOTAL_BUDGET;

    const newRecommendations = getParameterRecommendations(
      currentRegionData,
      newScores,
      calculatedAllocation
    );

    setCalculatedScores(newScores);
    setCombinedGapScore(currentCombinedGapScore);
    setAllocation(calculatedAllocation);
    setRecommendations(newRecommendations);
  }, [selectedParamIds, regionData]);

  if (allocation === 0 && selectedParamIds.length > 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isCompact ? (
        <div className="">
          <div className=" mx-auto space-y-4">
            {selectedParamIds.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Gap Score - Prominent Display */}
                <div className="lg:col-span-1 flex items-center justify-center flex-col bg-gradient-to-br from-green-600 to-green-700 text-white border-2 border-green-800 rounded-xl p-4 text-center">
                  <h2 className="text-lg font-semibold mb-2">Gap Score</h2>
                  <div className="text-5xl font-bold mb-2">
                    {combinedGapScore.toFixed(1)}
                  </div>
                  <p className="text-sm opacity-90">
                    Tinggi = Butuh Dana Lebih
                  </p>
                </div>

                {/* Allocation Result */}
                <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6">
                  <div className="w-full flex justify-between">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Estimasi Alokasi Dana Pendidikan
                    </h3>
                    <div className="text-sm text-gray-500">
                      Kalkulasi dengan {selectedParamIds.length} parameter
                    </div>
                  </div>

                  <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-green-700 font-medium text-sm mb-1">
                      Rekomendasi untuk{" "}
                      {regionData.provinces.name.toUpperCase()}
                    </p>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(allocation)}
                    </div>
                  </div>

                  <div className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                    <span>Parameter dapat disesuaikan</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">
                  Pilih Parameter
                </h3>
                <p className="text-sm text-gray-500">
                  Klik parameter di atas untuk mulai kalkulasi
                </p>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Rekomendasi Alokasi Anggaran Pendidikan
                    </h3>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="bg-white/80 border border-gray-300 p-6 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {rec.parameter}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                rec.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : rec.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {rec.priority} Priority
                            </span>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {rec.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-blue-900 mb-2">
                                Alokasi Anggaran
                              </h5>
                              <p className="text-blue-800">
                                {formatCurrency(rec.cost)}
                              </p>
                              <p className="text-sm text-blue-600 mt-1">
                                {(rec.budgetUtilization * 0.15).toFixed(2)}%
                                dari total anggaran
                              </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-green-900 mb-2">
                                Target Pencapaian
                              </h5>
                              <div className="text-green-800 text-sm">
                                {rec.parameter === "Program Literasi" && (
                                  <p>
                                    Tingkat Literasi:{" "}
                                    {rec.affordable.achievableLiteracy}%
                                  </p>
                                )}
                                {rec.parameter === "Infrastruktur Sekolah" && (
                                  <p>
                                    Sekolah Baru: {rec.affordable.schools} unit
                                  </p>
                                )}
                                {rec.parameter === "Kebutuhan Guru" && (
                                  <p>
                                    Guru Baru: {rec.affordable.teachers} orang
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-3">
                              Rencana Aksi
                            </h5>
                            <ul className="space-y-2">
                              {rec.actions.map((action, actionIndex) => (
                                <li
                                  key={actionIndex}
                                  className="flex items-start gap-2"
                                >
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-gray-700 text-sm">
                                    {action}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {rec.gap && (
                            <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                              <h5 className="font-semibold text-orange-900 mb-2">
                                Gap yang Tersisa
                              </h5>
                              <div className="text-orange-800 text-sm">
                                {rec.parameter === "Program Literasi" && (
                                  <>
                                    <p>
                                      Tingkat literasi saat ini:{" "}
                                      {rec.gap.currentLiteracy}%
                                    </p>
                                    <p>
                                      Masih perlu ditingkatkan:{" "}
                                      {rec.gap.remainingGap}%
                                    </p>
                                  </>
                                )}
                                {rec.parameter === "Infrastruktur Sekolah" && (
                                  <>
                                    <p>
                                      Rasio siswa/sekolah saat ini: 1:
                                      {rec.gap.currentRatio}
                                    </p>
                                    <p>
                                      Sekolah yang belum terbangun:{" "}
                                      {rec.gap.unfundedSchools} unit
                                    </p>
                                  </>
                                )}
                                {rec.parameter === "Kebutuhan Guru" && (
                                  <>
                                    <p>
                                      Rasio siswa/guru saat ini:{" "}
                                      {rec.gap.currentRatio}
                                    </p>
                                    <p>
                                      Guru yang masih dibutuhkan:{" "}
                                      {rec.gap.unfundedTeachers} orang
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className=" mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Kalkulator Alokasi Dana Pendidikan
              </h1>
              <p className="text-gray-600 capitalize">
                {regionData.provinces.name.toUpperCase()}
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                  Parameter Evaluasi
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedParamIds.length > 0
                    ? `${selectedParamIds.length} parameter • ${(
                        100 / selectedParamIds.length
                      ).toFixed(1)}% per parameter`
                    : "Pilih parameter untuk kalkulasi"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {allParameters.map((param) => {
                  const isSelected = selectedParamIds.includes(param.id);
                  return (
                    <button
                      key={param.id}
                      onClick={() => handleChipToggle(param.id)}
                      className={`px-4 py-2 text-sm rounded-full border-2 font-medium transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600"
                      }`}
                    >
                      {param.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedParamIds.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gap Score - Prominent Display */}
                <div className="lg:col-span-1 flex items-center justify-center flex-col bg-gradient-to-br from-green-600 to-green-700 text-white border-2 border-green-800 rounded-xl p-6 text-center">
                  <h2 className="text-lg font-semibold mb-2">Gap Score</h2>
                  <div className="text-5xl font-bold mb-2">
                    {combinedGapScore.toFixed(1)}
                  </div>
                  <p className="text-sm opacity-90">
                    Tinggi = Butuh Dana Lebih
                  </p>
                </div>

                {/* Allocation Result */}
                <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Estimasi Alokasi Dana Pendidikan
                  </h3>

                  <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4 mb-4">
                    <p className="text-green-700 font-medium text-sm mb-1">
                      Rekomendasi untuk{" "}
                      {regionData.provinces.name.toUpperCase()}
                    </p>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(allocation)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Gap Score:</span>
                      <span className="font-bold">
                        {combinedGapScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Factor:</span>
                      <span className="font-bold">
                        {TOTAL_ALLOCATION_FACTOR}
                      </span>
                    </div>
                    <div className="col-span-2 text-xs text-gray-500 pt-2 border-t border-gray-200">
                      Formula: (Gap Score ÷ {TOTAL_ALLOCATION_FACTOR}) ×{" "}
                      {formatCurrency(TOTAL_BUDGET)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-1">
                  Pilih Parameter
                </h3>
                <p className="text-sm text-gray-500">
                  Klik parameter di atas untuk mulai kalkulasi
                </p>
              </div>
            )}

            {selectedParamIds.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Detail Parameter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(calculatedScores).map(([id, data]) => (
                    <div
                      key={id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800 text-sm leading-tight">
                          {data.label}
                        </h4>
                        <div
                          className={`px-2 py-1 text-xs font-bold rounded border ${
                            data.score > 0.7
                              ? "bg-green-50 text-green-700 border-green-200"
                              : data.score > 0.4
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {data.score.toFixed(3)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          <span className="font-medium">Raw:</span>{" "}
                          {typeof data.rawValue === "number"
                            ? data.rawValue.toFixed(2)
                            : data.rawValue.slice(0, 30) +
                              (data.rawValue.length > 30 ? "..." : "")}
                        </div>
                        <div>
                          <span className="font-medium">Gap:</span>{" "}
                          <span className="text-red-600 font-bold">
                            {data.gap.toFixed(3)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations Section */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Rekomendasi Alokasi Anggaran Pendidikan
                    </h3>
                    <div className="space-y-4">
                      {recommendations.map((rec, index) => (
                        <div
                          key={index}
                          className="bg-white/80 border border-gray-300 p-6 rounded-xl"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {rec.parameter}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                rec.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : rec.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {rec.priority} Priority
                            </span>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {rec.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-blue-900 mb-2">
                                Alokasi Anggaran
                              </h5>
                              <p className="text-blue-800">
                                {formatCurrency(rec.cost)}
                              </p>
                              <p className="text-sm text-blue-600 mt-1">
                                {(rec.budgetUtilization * 0.15).toFixed(2)}%
                                dari total anggaran
                              </p>
                            </div>

                            <div className="bg-green-50 p-4 rounded-lg">
                              <h5 className="font-semibold text-green-900 mb-2">
                                Target Pencapaian
                              </h5>
                              <div className="text-green-800 text-sm">
                                {rec.parameter === "Program Literasi" && (
                                  <p>
                                    Tingkat Literasi:{" "}
                                    {rec.affordable.achievableLiteracy}%
                                  </p>
                                )}
                                {rec.parameter === "Infrastruktur Sekolah" && (
                                  <p>
                                    Sekolah Baru: {rec.affordable.schools} unit
                                  </p>
                                )}
                                {rec.parameter === "Kebutuhan Guru" && (
                                  <p>
                                    Guru Baru: {rec.affordable.teachers} orang
                                  </p>
                                )}
                                {rec.parameter ===
                                  "Pencegahan Putus Sekolah" && (
                                  <p>
                                    Completion Rate:{" "}
                                    {rec.affordable.achievableCompletion}%
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-3">
                              Rencana Aksi
                            </h5>
                            <ul className="space-y-2">
                              {rec.actions.map((action, actionIndex) => (
                                <li
                                  key={actionIndex}
                                  className="flex items-start gap-2"
                                >
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-gray-700 text-sm">
                                    {action}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {rec.gap && (
                            <div className="mt-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                              <h5 className="font-semibold text-orange-900 mb-2">
                                Gap yang Tersisa
                              </h5>
                              <div className="text-orange-800 text-sm">
                                {rec.parameter === "Program Literasi" && (
                                  <>
                                    <p>
                                      Tingkat literasi saat ini:{" "}
                                      {rec.gap.currentLiteracy}%
                                    </p>
                                    <p>
                                      Masih perlu ditingkatkan:{" "}
                                      {rec.gap.remainingGap}%
                                    </p>
                                    <p>
                                      Orang yang belum terlayani:{" "}
                                      {rec.gap.remainingIlliterate.toLocaleString(
                                        "id-ID"
                                      )}
                                    </p>
                                  </>
                                )}
                                {rec.parameter === "Infrastruktur Sekolah" && (
                                  <>
                                    <p>
                                      Rasio siswa/sekolah saat ini: 1:
                                      {rec.gap.currentRatio}
                                    </p>
                                    <p>
                                      Sekolah yang belum terbangun:{" "}
                                      {rec.gap.unfundedSchools} unit
                                    </p>
                                  </>
                                )}
                                {rec.parameter === "Kebutuhan Guru" && (
                                  <>
                                    <p>
                                      Rasio siswa/guru saat ini:{" "}
                                      {rec.gap.currentRatio}
                                    </p>
                                    <p>
                                      Guru yang masih dibutuhkan:{" "}
                                      {rec.gap.unfundedTeachers} orang
                                    </p>
                                  </>
                                )}
                                {rec.parameter ===
                                  "Pencegahan Putus Sekolah" && (
                                  <>
                                    <p>
                                      Completion rate saat ini:{" "}
                                      {rec.gap.currentCompletion}%
                                    </p>
                                    <p>
                                      Siswa berisiko dropout yang belum
                                      tertangani:{" "}
                                      {rec.gap.remainingDropouts.toLocaleString(
                                        "id-ID"
                                      )}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EducationBudgetCalculator;
