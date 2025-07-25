import { apiRequest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ProvinceResponse } from "../types/province";

// Province data types
interface EducationLevelBase {
  total: number;
  public: number;
  private: number;
  special_needs: number;
}

interface HigherEducationLevel {
  total: number;
  public: number;
  private: number;
  official: number;
}

interface Infrastructure {
  ratios: {
    student_to_school_elementary: string;
    student_to_school_junior_high: string;
    student_to_school_higher_education: string;
    student_to_school_senior_high_vocational: string;
  };
  schools: {
    elementary: EducationLevelBase;
    junior_high: EducationLevelBase;
    senior_high: EducationLevelBase;
    higher_education: HigherEducationLevel;
  };
  students: {
    elementary: EducationLevelBase;
    junior_high: EducationLevelBase;
    senior_high: EducationLevelBase;
    higher_education: HigherEducationLevel;
  };
}

interface Workers {
  ratios: {
    student_to_teacher_elementary: string;
    student_to_teacher_junior_high: string;
    student_to_teacher_higher_education: string;
    student_to_teacher_senior_high_vocational: string;
  };
  teachers: {
    elementary: EducationLevelBase;
    junior_high: EducationLevelBase;
    senior_high: EducationLevelBase;
    higher_education: EducationLevelBase;
  };
}

interface SocialIndicators {
  literacy_rate: number;
  poverty_index: number;
  human_development_index: number;
  education_completion_rate: number;
  school_participation_rate: number;
}

interface ProvinceInfo {
  id: string;
  name: string;
}

interface TotalSummary {
  students: number;
  schools: number;
  teachers: number;
}

export interface ProvinceData {
  province_id: string;
  infrastructure: Infrastructure;
  workers: Workers;
  funding: number;
  social: SocialIndicators;
  provinces: ProvinceInfo;
  total: TotalSummary;
}

// Raw API response (without calculated totals)
interface RawProvinceData {
  province_id: string;
  infrastructure: Infrastructure;
  workers: Workers;
  funding: number;
  social: SocialIndicators;
  provinces: ProvinceInfo;
}

interface UseProvinceParams {
  provinceName?: string;
  provinceId?: string;
}

export const useProvince = ({
  provinceName,
  provinceId,
}: UseProvinceParams) => {
  const {
    data: rawData,
    isLoading,
    error,
  } = useQuery<ProvinceResponse>({
    queryKey: ["province", provinceName || provinceId],
    queryFn: () => {
      let endpoint = "/education-statistics";
      if (provinceName && provinceName.trim()) {
        endpoint += `/${encodeURIComponent(provinceName)}`;
      } else if (provinceId && provinceId.trim()) {
        endpoint += `/${encodeURIComponent(provinceId)}`;
      }

      return apiRequest<ProvinceResponse>(endpoint);
    },
    enabled: !!(provinceName?.trim() || provinceId?.trim()),
  });

  // Calculate totals and enhance data
  const provinceData: ProvinceData | undefined = rawData?.data
    ? {
        ...rawData.data,
        total: {
          students:
            rawData.data.infrastructure.students.elementary.total +
            rawData.data.infrastructure.students.junior_high.total +
            rawData.data.infrastructure.students.senior_high.total +
            rawData.data.infrastructure.students.higher_education.total,
          schools:
            rawData.data.infrastructure.schools.elementary.total +
            rawData.data.infrastructure.schools.junior_high.total +
            rawData.data.infrastructure.schools.senior_high.total +
            rawData.data.infrastructure.schools.higher_education.total,
          teachers:
            rawData.data.workers.teachers.elementary.total +
            rawData.data.workers.teachers.junior_high.total +
            rawData.data.workers.teachers.senior_high.total +
            rawData.data.workers.teachers.higher_education.total,
        },
      }
    : undefined;

  return {
    data: provinceData,
    rawData,
    isLoading,
    error,
  };
};
