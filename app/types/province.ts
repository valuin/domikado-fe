// Base education level structure for schools and students
interface EducationLevelBase {
  total: number;
  public: number;
  private: number;
  special_needs: number;
}

// Higher education has 'official' instead of 'special_needs'
interface HigherEducationLevel {
  total: number;
  public: number;
  private: number;
  official: number;
}

// Infrastructure data structure
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

// Workers data structure
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

// Social indicators structure
interface SocialIndicators {
  literacy_rate: number;
  poverty_index: number;
  human_development_index: number;
  education_completion_rate: number;
  school_participation_rate: number;
}

// Province info structure
interface ProvinceInfo {
  id: string;
  name: string;
}

// Total summary interface
interface TotalSummary {
  students: number;
  schools: number;
  teachers: number;
}

// Main province data structure
export interface ProvinceData {
  province_id: string;
  infrastructure: Infrastructure;
  workers: Workers;
  funding: number;
  social: SocialIndicators;
  provinces: ProvinceInfo;
  total: TotalSummary;
}

// Raw province data (what API actually returns)
export interface RawProvinceData {
  province_id: string;
  infrastructure: Infrastructure;
  workers: Workers;
  funding: number;
  social: SocialIndicators;
  provinces: ProvinceInfo;
}

// API response wrapper
export interface ProvinceResponse {
  data: RawProvinceData;
}

// Legacy Province interface for backward compatibility
export interface Province {
  id: string;
  name: string;
  [key: string]: any;
}
