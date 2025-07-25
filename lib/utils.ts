import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as topoJson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";
import { ProvinceData } from "@/app/types/province";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTopoJSON = (
  topoData: Topology,
  attribute: string
): FeatureCollection => {
  const convertedData = topoJson.feature(topoData, topoData.objects[attribute]);

  if (convertedData && convertedData.type === "FeatureCollection") {
    return convertedData as FeatureCollection;
  } else if (convertedData && convertedData.type === "Feature") {
    return {
      type: "FeatureCollection",
      features: [convertedData],
    } as FeatureCollection;
  }

  return {
    type: "FeatureCollection",
    features: [],
  } as FeatureCollection;
};

export const fetchAllProvinceJson = async (): Promise<FeatureCollection> => {
  try {
    const response = await fetch("/indonesiaProvince-topo.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const topoData = await response.json();

    const convertedData = formatTopoJSON(topoData, "provinces");

    return convertedData;
  } catch (error) {
    console.error("Error fetching province data:", error);
    throw error;
  }
};

export const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};


export const calculateTeacherRequirements = (data: ProvinceData) => {
  const totalStudents = data.total.students;
  const totalTeachers = data.total.teachers;
  const currentRatio = Math.round(totalStudents / totalTeachers);
  const targetRatio = 16;
  const requiredTeachers = Math.ceil(totalStudents / targetRatio);
  const additionalTeachers = Math.max(0, requiredTeachers - totalTeachers);
  
  return {
    current: `1:${currentRatio}`,
    target: `1:${targetRatio}`,
    required: additionalTeachers,
    status: currentRatio <= targetRatio ? 'achieved' : 'needs_improvement'
  };
};

export const calculateSchoolRequirements = (data: ProvinceData) => {
  const totalStudents = data.total.students;
  const totalSchools = data.total.schools;
  const currentRatio = Math.round(totalStudents / totalSchools);
  const targetRatio = 500; 
  const requiredSchools = Math.ceil(totalStudents / targetRatio);
  const additionalSchools = Math.max(0, requiredSchools - totalSchools);
  
  return {
    current: `1:${currentRatio}`,
    target: `1:${targetRatio}`,
    required: additionalSchools,
    status: currentRatio <= targetRatio ? 'achieved' : 'needs_improvement'
  };
};
