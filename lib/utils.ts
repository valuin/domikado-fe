import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as topoJson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { FeatureCollection } from "geojson";

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
