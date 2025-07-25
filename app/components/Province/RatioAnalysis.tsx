import React from "react";
import { Users, School, Target, Calculator } from "lucide-react";
import { ProvinceData } from "@/app/types/province";

const calculateRatioAnalysis = (provinceData: ProvinceData) => {
  const targetTeacherStudentRatio = 16;
  const targetStudentSchoolRatio = 500;

  const currentTeacherStudentRatio = Math.round(
    provinceData.total.students / provinceData.total.teachers
  );
  const currentStudentSchoolRatio = Math.round(
    provinceData.total.students / provinceData.total.schools
  );

  const requiredTeachers = Math.ceil(
    provinceData.total.students / targetTeacherStudentRatio
  );
  const teacherShortage = Math.max(
    0,
    requiredTeachers - provinceData.total.teachers
  );

  const requiredSchools = Math.ceil(
    provinceData.total.students / targetStudentSchoolRatio
  );
  const schoolShortage = Math.max(
    0,
    requiredSchools - provinceData.total.schools
  );

  return {
    current: {
      teacherStudentRatio: currentTeacherStudentRatio,
      studentSchoolRatio: currentStudentSchoolRatio,
    },
    target: {
      teacherStudentRatio: targetTeacherStudentRatio,
      studentSchoolRatio: targetStudentSchoolRatio,
    },
    requirements: {
      teachers: {
        current: provinceData.total.teachers,
        required: requiredTeachers,
        shortage: teacherShortage,
        percentage: ((teacherShortage / requiredTeachers) * 100).toFixed(1),
      },
      schools: {
        current: provinceData.total.schools,
        required: requiredSchools,
        shortage: schoolShortage,
        percentage: ((schoolShortage / requiredSchools) * 100).toFixed(1),
      },
    },
    status: {
      teacherRatio:
        currentTeacherStudentRatio <= targetTeacherStudentRatio
          ? "good"
          : "needs_improvement",
      schoolRatio:
        currentStudentSchoolRatio <= targetStudentSchoolRatio
          ? "good"
          : "needs_improvement",
    },
  };
};

interface RatioAnalysisProps {
  provinceData: ProvinceData;
}

const RatioAnalysis: React.FC<RatioAnalysisProps> = ({ provinceData }) => {
  const ratioAnalysis = calculateRatioAnalysis(provinceData);

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-5 h-5 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Analisis Rasio & Target
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Ratios & Targets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Rasio Saat Ini vs Target
            </h4>
          </div>

          {/* Teacher-Student Ratio */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Rasio Guru : Siswa
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  ratioAnalysis.status.teacherRatio === "good"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ratioAnalysis.status.teacherRatio === "good"
                  ? "Baik"
                  : "Perlu Perbaikan"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  1:{ratioAnalysis.current.teacherStudentRatio}
                </div>
                <div className="text-xs text-gray-600">Saat Ini</div>
              </div>
              <div className="text-gray-400">vs</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  1:{ratioAnalysis.target.teacherStudentRatio}
                </div>
                <div className="text-xs text-gray-600">Target UNESCO</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Rasio Siswa : Sekolah
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  ratioAnalysis.status.schoolRatio === "good"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {ratioAnalysis.status.schoolRatio === "good"
                  ? "Baik"
                  : "Perlu Perbaikan"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  1:{ratioAnalysis.current.studentSchoolRatio}
                </div>
                <div className="text-xs text-gray-600">Saat Ini</div>
              </div>
              <div className="text-gray-400">vs</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  1:{ratioAnalysis.target.studentSchoolRatio}
                </div>
                <div className="text-xs text-gray-600">Target Ideal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements to Reach Target */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calculator className="w-4 h-4 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800">
              Kebutuhan untuk Mencapai Target
            </h4>
          </div>

          {/* Teacher Requirements */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-800">
                Kebutuhan Guru
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Guru Saat Ini:</span>
                <span className="font-semibold">
                  {ratioAnalysis.requirements.teachers.current.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Guru Dibutuhkan:</span>
                <span className="font-semibold">
                  {ratioAnalysis.requirements.teachers.required.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-orange-700">
                  Kekurangan:
                </span>
                <div className="text-right">
                  <span className="font-bold text-orange-800">
                    {ratioAnalysis.requirements.teachers.shortage.toLocaleString()}{" "}
                    guru
                  </span>
                  <div className="text-xs text-orange-600">
                    ({ratioAnalysis.requirements.teachers.percentage}% dari
                    target)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School Requirements */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <School className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">
                Kebutuhan Sekolah
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Sekolah Saat Ini:</span>
                <span className="font-semibold">
                  {ratioAnalysis.requirements.schools.current.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Sekolah Dibutuhkan:
                </span>
                <span className="font-semibold">
                  {ratioAnalysis.requirements.schools.required.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium text-blue-700">
                  Kekurangan:
                </span>
                <div className="text-right">
                  <span className="font-bold text-blue-800">
                    {ratioAnalysis.requirements.schools.shortage.toLocaleString()}{" "}
                    sekolah
                  </span>
                  <div className="text-xs text-blue-600">
                    ({ratioAnalysis.requirements.schools.percentage}% dari
                    target)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatioAnalysis;
