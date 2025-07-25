import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Users,
  School,
  GraduationCap,
  DollarSign,
} from "lucide-react";

interface ProvinceHeaderProps {
  provinceData: {
    name: string;
    gapScore: number;
    totalStudents: string;
    totalTeachers: string;
    totalSchools: string;
  };
  onBackClick: () => void;
}

const ProvinceHeader: React.FC<ProvinceHeaderProps> = ({
  provinceData,
  onBackClick,
}) => {
  return (
    <>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBackClick}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProvinceHeader;
