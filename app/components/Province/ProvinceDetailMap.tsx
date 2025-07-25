import { fetchAllProvinceJson } from "@/lib/utils";
import { FeatureCollection, Feature } from "geojson";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Slider } from "@/app/components/ui/slider";
import { Calendar, TrendingDown, TrendingUp } from "lucide-react";
import L from "leaflet";
import "leaflet.heat";

declare global {
  namespace L {
    function heatLayer(points: [number, number, number][], options?: any): any;
  }
}

const calculateFeatureCenter = (feature: Feature): [number, number] => {
  if (feature.geometry.type === "Polygon") {
    const coordinates = feature.geometry.coordinates[0];
    let lat = 0,
      lng = 0;

    coordinates.forEach(([longitude, latitude]) => {
      lng += longitude;
      lat += latitude;
    });

    return [lat / coordinates.length, lng / coordinates.length];
  } else if (feature.geometry.type === "MultiPolygon") {
    const firstPolygon = feature.geometry.coordinates[0][0];
    let lat = 0,
      lng = 0;

    firstPolygon.forEach(([longitude, latitude]) => {
      lng += longitude;
      lat += latitude;
    });

    return [lat / firstPolygon.length, lng / firstPolygon.length];
  }

  return [-2.5, 118];
};

const isPointInPolygon = (
  point: [number, number],
  polygon: number[][]
): boolean => {
  const [lat, lng] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    if (
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }

  return inside;
};

// Monthly intensity calculation for 3 years (36 months)
const getMonthlyIntensityMultiplier = (
  month: number
): { base: number; variance: number } => {
  // Month 1 = January 2022 (start), Month 36 = December 2024 (end)
  // Create gradual improvement from high intensity (bad) to low intensity (good)

  // Linear decrease from 90 to 15 over 36 months
  const baseIntensity = Math.max(15, 90 - (month - 1) * (75 / 35));

  // Variance decreases as situation stabilizes
  const variance = Math.max(8, 20 - (month - 1) * (12 / 35));

  return {
    base: Math.round(baseIntensity),
    variance: Math.round(variance),
  };
};

// Generate consistent fixed locations for heatmap points
const generateFixedLocations = (
  feature: Feature,
  count: number = 45
): [number, number][] => {
  const locations: [number, number][] = [];

  if (!feature.geometry) return locations;

  // Get bounding box of the feature
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  const extractCoordinates = (coords: any) => {
    if (typeof coords[0] === "number") {
      const [lng, lat] = coords;
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    } else {
      coords.forEach(extractCoordinates);
    }
  };

  if (feature.geometry.type === "Polygon") {
    extractCoordinates(feature.geometry.coordinates[0]);
  } else if (feature.geometry.type === "MultiPolygon") {
    feature.geometry.coordinates.forEach((polygon) =>
      extractCoordinates(polygon[0])
    );
  }

  const seed = 12345;
  let seedValue = seed;

  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };

  let attempts = 0;
  const maxAttempts = count * 15;

  while (locations.length < count && attempts < maxAttempts) {
    const lat = minLat + seededRandom() * (maxLat - minLat);
    const lng = minLng + seededRandom() * (maxLng - minLng);

    let isInside = false;

    if (feature.geometry.type === "Polygon") {
      isInside = isPointInPolygon([lat, lng], feature.geometry.coordinates[0]);
    } else if (feature.geometry.type === "MultiPolygon") {
      isInside = feature.geometry.coordinates.some((polygon) =>
        isPointInPolygon([lat, lng], polygon[0])
      );
    }

    if (isInside) {
      locations.push([lat, lng]);
    }

    attempts++;
  }

  return locations;
};

// Function to generate consistent heatmap points with time-varying intensity
const generateTimeSeriesHeatmapPoints = (
  feature: Feature,
  month: number,
  fixedLocations?: [number, number][]
): [number, number, number][] => {
  // Generate fixed locations if not provided
  const locations = fixedLocations || generateFixedLocations(feature, 45);

  // Get month-specific intensity parameters
  const { base, variance } = getMonthlyIntensityMultiplier(month);

  // Apply time-varying intensity to fixed locations
  return locations.map(([lat, lng], index) => {
    // Calculate intensity that decreases by 200 each month, starting from 5000
    const baseIntensity = 5000 - (month - 1) * 200;

    // Add some location-specific variation (±50) for visual variety
    const locationSeed = 12345 + index * 67;
    let seedValue = locationSeed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    const locationVariance = (seededRandom() - 0.5) * 100; // ±50 variation
    const intensity = Math.max(100, baseIntensity + locationVariance); // Minimum 100

    console.log(intensity)
    return [lat, lng, intensity] as [number, number, number];
  });
};

// Custom Hook for Time-Series Heatmap with Province Boundary Clipping
const useTimeSeriesHeatmap = (
  mapRef: React.RefObject<any>,
  provinceData: FeatureCollection | null,
  isMapReady: boolean,
  currentMonth: number
) => {
  const heatLayerRef = useRef<any>(null);
  const fixedLocationsRef = useRef<[number, number][] | null>(null);

  useEffect(() => {
    if (
      !mapRef.current ||
      !provinceData ||
      !isMapReady ||
      provinceData.features.length === 0
    ) {
      return;
    }

    const map = mapRef.current;
    const provinceFeature = provinceData.features[0];

    // Generate fixed locations only once per province
    if (!fixedLocationsRef.current) {
      fixedLocationsRef.current = generateFixedLocations(provinceFeature, 45);
    }

    // Remove existing heatmap
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (e) {
        console.log("Heatmap layer already removed");
      }
    }

    // Generate time-series points with consistent locations but varying intensity
    const heatmapPoints = generateTimeSeriesHeatmapPoints(
      provinceFeature,
      currentMonth,
      fixedLocationsRef.current
    );

    if (heatmapPoints.length === 0) {
      console.log("No valid heatmap points generated");
      return;
    }

    // Debug: Log intensity values for current month
    const intensities = heatmapPoints.map((point) => point[2]);
    const avgIntensity =
      intensities.reduce((sum, i) => sum + i, 0) / intensities.length;
    const minIntensity = Math.min(...intensities);
    const maxIntensity = Math.max(...intensities);

    console.log(
      `Month ${currentMonth}: Avg=${avgIntensity.toFixed(
        0
      )}, Min=${minIntensity.toFixed(0)}, Max=${maxIntensity.toFixed(0)}`
    );
    console.log(
      `Expected base for month ${currentMonth}: ${
        5000 - (currentMonth - 1) * 200
      }`
    );

    // Create heatmap layer with proper gradient (lower intensity = better = green)
    const heatmapOptions = {
      radius: 40,
      blur: 30,
      maxZoom: 17,
      max: 5100, // Adjusted to match our new intensity range (5000 + variance)
      gradient: {
        0.0: "#00ff00", // Green (Low intensity = Excellent)
        0.2: "#66ff00", // Light Green
        0.3: "#ccff00", // Yellow-Green
        0.4: "#ffff00", // Yellow (Medium)
        0.5: "#ffcc00", // Orange-Yellow
        0.6: "#ff9900", // Orange
        0.7: "#ff6600", // Dark Orange
        0.8: "#ff3300", // Red-Orange
        0.9: "#ff1100", // Dark Red
        1.0: "#ff0000", // Red (Needs Attention)
      },
      minOpacity: 0.4,
    };

    try {
      heatLayerRef.current = L.heatLayer(heatmapPoints, heatmapOptions);
      heatLayerRef.current.addTo(map);

      console.log(
        `Time-series heatmap created with ${heatmapPoints.length} points for month ${currentMonth}`
      );
    } catch (error) {
      console.error("Error creating heatmap:", error);
    }

    return () => {
      if (heatLayerRef.current && map) {
        try {
          map.removeLayer(heatLayerRef.current);
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }
    };
  }, [mapRef, provinceData, isMapReady, currentMonth]);

  return heatLayerRef.current;
};

interface ProvinceProperties {
  provinsi: string;
  [key: string]: any;
}

// Monthly narration data for 3 years (36 months)
const getMonthlyNarration = (
  month: number
): {
  title: string;
  description: string;
  trend: "up" | "down";
  year: number;
  monthName: string;
} => {
  const year = Math.floor((month - 1) / 12) + 2022;
  const monthIndex = (month - 1) % 12;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthName = monthNames[monthIndex];

  // Create quarterly milestones for better narrative flow
  const quarter = Math.floor((month - 1) / 3) + 1;

  type PhaseData = {
    phase: "baseline" | "planning" | "early" | "accelerated" | "transformation";
    title: string;
    trend: "up" | "down";
  };

  const narrativePhases: Record<number, PhaseData> = {
    // Months 1-6: Critical baseline period
    1: {
      phase: "baseline",
      title: "Baseline Assessment - Critical Situation",
      trend: "down",
    },
    2: {
      phase: "baseline",
      title: "Initial Data Collection",
      trend: "down",
    },
    3: {
      phase: "baseline",
      title: "Problem Identification",
      trend: "down",
    },
    4: {
      phase: "planning",
      title: "Intervention Planning Phase",
      trend: "down",
    },
    5: {
      phase: "planning",
      title: "Resource Allocation",
      trend: "down",
    },
    6: {
      phase: "planning",
      title: "Early Implementation Preparation",
      trend: "up",
    },

    // Months 7-18: Early intervention
    7: {
      phase: "early",
      title: "Initial Intervention Deployment",
      trend: "up",
    },
    12: {
      phase: "early",
      title: "First Quarter Results",
      trend: "up",
    },
    18: {
      phase: "early",
      title: "Early Positive Indicators",
      trend: "up",
    },

    // Months 19-30: Accelerated progress
    24: {
      phase: "accelerated",
      title: "Significant Improvement Phase",
      trend: "up",
    },
    30: {
      phase: "accelerated",
      title: "Sustained Positive Trends",
      trend: "up",
    },

    // Months 31-36: Transformation
    33: {
      phase: "transformation",
      title: "Educational Transformation",
      trend: "up",
    },
    36: {
      phase: "transformation",
      title: "Comprehensive Success",
      trend: "up",
    },
  };

  // Find the closest narrative phase
  let selectedPhase: PhaseData = narrativePhases[1];
  for (const [phaseMonth, phase] of Object.entries(narrativePhases)) {
    if (month >= parseInt(phaseMonth)) {
      selectedPhase = phase;
    }
  }

  const descriptions = {
    baseline:
      "High-intensity red zones dominate the landscape, indicating critical educational gaps requiring immediate intervention. Assessment reveals significant disparities in educational quality, infrastructure, and access across the province.",
    planning:
      "Strategic planning and resource mobilization phase shows continued challenges while preparing comprehensive intervention strategies. Initial groundwork being laid for systematic educational improvements.",
    early:
      "First signs of improvement emerge as targeted interventions begin implementation. Orange and yellow zones start appearing, indicating early positive responses to educational reforms and infrastructure development.",
    accelerated:
      "Notable progress accelerates across multiple districts with expanding yellow and light green zones. Community engagement programs and digital learning initiatives show measurable positive impact on educational outcomes.",
    transformation:
      "Remarkable transformation with predominantly green zones indicating successful intervention outcomes. Comprehensive improvements in educational quality, accessibility, and equity demonstrate the lasting impact of sustained reform efforts.",
  };

  return {
    title: selectedPhase.title,
    description: descriptions[selectedPhase.phase as keyof typeof descriptions],
    trend: selectedPhase.trend,
    year,
    monthName,
  };
};

const ProvinceDetailMap = ({ provinceName }: { provinceName: string }) => {
  const [provinceGapScores, setProvinceGapScores] = useState<
    Record<string, number>
  >({});
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const [mapLoading, setMapLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5, 118]);
  const [mapZoom, setMapZoom] = useState<number>(7);
  const [isMapReady, setIsMapReady] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number>(36); // Start at month 36 (Dec 2024)
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetchAllProvinceJson().then((data) => {
      const filteredData = data.features.filter(
        (feature) => feature.properties?.provinsi == provinceName
      );

      const filteredGeoJson = {
        ...data,
        features: filteredData,
      };

      if (filteredData.length > 0) {
        const center = calculateFeatureCenter(filteredData[0]);
        setMapCenter(center);

        if (filteredData[0].properties?.provinsi == provinceName) {
          setMapZoom(10);
        } else {
          setMapZoom(5);
        }
      }

      setGeoJsonData(filteredGeoJson);
      setMapLoading(false);
    });
  }, [provinceName]);

  // Use the time-series heatmap hook
  useTimeSeriesHeatmap(mapRef, geoJsonData, isMapReady, currentMonth);

  const onEachFeature = (feature: Feature, layer: any) => {
    const properties = feature.properties as ProvinceProperties;
    if (!properties?.provinsi) return;

    const provinceName = properties.provinsi;
    const gapScore = provinceGapScores[provinceName] || 0.5;

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;

        layer.bringToFront();

        e.originalEvent?.stopPropagation();
      },
      mouseout: (e: any) => {
        const layer = e.target;

        e.originalEvent?.stopPropagation();
      },
      click: (e: any) => {},
    });

    layer.bindTooltip(
      `<strong>${provinceName}</strong><br/>Gap Score: ${gapScore.toFixed(2)}`,
      {
        permanent: false,
        direction: "center",
        className: "custom-tooltip",
      }
    );
  };

  const currentNarration = getMonthlyNarration(currentMonth);

  return (
    <>
      {geoJsonData && (
        <div className="space-y-6">
          {/* Time Series Controls */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Educational Intervention Timeline: {provinceName}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">
                  Timeline: {currentNarration.monthName} {currentNarration.year}
                </label>
                <div className="text-sm text-gray-600">
                  {currentMonth === 1
                    ? "Baseline"
                    : `Month ${currentMonth} of intervention`}
                </div>
              </div>

              <Slider
                value={[currentMonth]}
                onValueChange={(value) => setCurrentMonth(value[0])}
                min={1}
                max={36}
                step={1}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>Jan 2022</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
                <span>Dec 2024</span>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative">
            {/* Heatmap Legend */}
            <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md border">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Intervention Response Intensity
              </h4>
              <Legend />
              <div className="mt-2 text-xs text-gray-500">
                Green = Better outcomes
              </div>
            </div>

            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ width: "100%", height: "100%", minHeight: "400px" }}
              scrollWheelZoom={true}
              className={`rounded-lg relative`}
              ref={mapRef}
              whenReady={() => {
                console.log("Map is ready for heatmap");
                setIsMapReady(true);
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <GeoJSON
                key="provinces"
                data={geoJsonData}
                style={{
                  fillColor: "rgb(0,0,0)",
                  weight: 3,
                  opacity: 1,
                  color: "#000000",
                  dashArray: "7",
                  fillOpacity: 0,
                }}
                onEachFeature={onEachFeature}
              />
            </MapContainer>
          </div>

          {/* Yearly Narration */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-start gap-4">
              <div
                className={`p-2 rounded-lg ${
                  currentNarration.trend === "up"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {currentNarration.trend === "up" ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-3">
                  {currentNarration.monthName} {currentNarration.year}:{" "}
                  {currentNarration.title}
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  {currentNarration.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProvinceDetailMap;

const Legend = () => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Excellent</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Fair</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Needs Attention</span>
        </div>
      </div>
    </div>
  );
};
