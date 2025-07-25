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

const getYearlyIntensityMultiplier = (
  year: number
): { base: number; variance: number } => {
  const yearData = {
    2020: { base: 85, variance: 15 },
    2021: { base: 70, variance: 20 },
    2022: { base: 55, variance: 20 },
    2023: { base: 40, variance: 15 },
    2024: { base: 1, variance: 1 },
  };
  return yearData[year as keyof typeof yearData] || yearData[2024];
};

// Function to generate time-aware dummy heatmap points within province boundary
const generateTimeSeriesHeatmapPoints = (
  feature: Feature,
  year: number,
  count: number = 40
): [number, number, number][] => {
  const points: [number, number, number][] = [];

  if (!feature.geometry) return points;

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

  // Get year-specific intensity parameters
  const { base, variance } = getYearlyIntensityMultiplier(year);

  // Generate random points within bounding box and check if they're inside the polygon
  let attempts = 0;
  const maxAttempts = count * 10;

  while (points.length < count && attempts < maxAttempts) {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);

    // Check if point is inside the province boundary
    let isInside = false;

    if (feature.geometry.type === "Polygon") {
      isInside = isPointInPolygon([lat, lng], feature.geometry.coordinates[0]);
    } else if (feature.geometry.type === "MultiPolygon") {
      // Check against all polygons in MultiPolygon
      isInside = feature.geometry.coordinates.some((polygon) =>
        isPointInPolygon([lat, lng], polygon[0])
      );
    }

    if (isInside) {
      // Generate year-appropriate intensity (improvement over time)
      const randomVariance = (Math.random() - 0.5) * variance;
      const intensity = Math.max(10, Math.min(100, base + randomVariance));
      points.push([lat, lng, intensity]);
    }

    attempts++;
  }

  return points;
};

// Custom Hook for Time-Series Heatmap with Province Boundary Clipping
const useTimeSeriesHeatmap = (
  mapRef: React.RefObject<any>,
  provinceData: FeatureCollection | null,
  isMapReady: boolean,
  currentYear: number
) => {
  const heatLayerRef = useRef<any>(null);

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

    // Remove existing heatmap
    if (heatLayerRef.current) {
      try {
        map.removeLayer(heatLayerRef.current);
      } catch (e) {
        console.log("Heatmap layer already removed");
      }
    }

    // Generate time-series points within province boundary
    const heatmapPoints = generateTimeSeriesHeatmapPoints(
      provinceFeature,
      currentYear,
      40
    );

    if (heatmapPoints.length === 0) {
      console.log("No valid heatmap points generated");
      return;
    }

    // Create heatmap layer with reversed gradient (lower intensity = better = green)
    const heatmapOptions = {
      radius: 50,
      blur: 25,
      maxZoom: 17,
      max: 100,
      gradient: {
        0.0: "#00ff00", // Green (Low intensity = Good)
        0.25: "#80ff00", // Light Green
        0.4: "#ffff00", // Yellow
        0.6: "#ff8000", // Orange
        0.8: "#ff4000", // Red-Orange
        1.0: "#ff0000", // Red (High intensity = Bad)
      },
      minOpacity: 0.5,
    };

    try {
      heatLayerRef.current = L.heatLayer(heatmapPoints, heatmapOptions);
      heatLayerRef.current.addTo(map);

      console.log(
        `Time-series heatmap created with ${heatmapPoints.length} points for year ${currentYear}`
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
  }, [mapRef, provinceData, isMapReady, currentYear]);

  return heatLayerRef.current;
};

interface ProvinceProperties {
  provinsi: string;
  [key: string]: any;
}

// Yearly narration data
const getYearlyNarration = (
  year: number
): { title: string; description: string; trend: "up" | "down" } => {
  const narrations = {
    2020: {
      title: "Baseline Assessment - Critical Situation",
      description:
        "Initial implementation of educational intervention shows high intensity areas indicating significant gaps. Many regions show critical levels requiring immediate attention. The red zones represent areas with the highest educational disparities and urgent need for comprehensive support.",
      trend: "down" as const,
    },
    2021: {
      title: "Early Intervention Response",
      description:
        "First year of targeted interventions begins showing modest improvements. Teacher training programs and infrastructure development start addressing critical gaps. Some regions show early positive responses, though significant challenges remain in remote areas.",
      trend: "up" as const,
    },
    2022: {
      title: "Accelerated Progress",
      description:
        "Comprehensive educational reforms gain momentum with notable improvements across multiple districts. Digital learning initiatives and community engagement programs show positive impact. Yellow zones indicate transitioning areas moving towards better outcomes.",
      trend: "up" as const,
    },
    2023: {
      title: "Sustained Improvement",
      description:
        "Continued investment in education yields significant results with most regions showing marked improvement. Green zones expand as educational quality improves. Collaborative efforts between government, educators, and communities create lasting positive change.",
      trend: "up" as const,
    },
    2024: {
      title: "Transformed Educational Landscape",
      description:
        "The province demonstrates remarkable transformation with predominantly green zones indicating successful intervention outcomes. Sustained improvement in educational quality, accessibility, and equity shows the long-term impact of targeted recommendations and community commitment.",
      trend: "up" as const,
    },
  };
  return narrations[year as keyof typeof narrations] || narrations[2024];
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
  const [currentYear, setCurrentYear] = useState<number>(2024);
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
          setMapZoom(8);
        }
      }

      setGeoJsonData(filteredGeoJson);
      setMapLoading(false);
    });
  }, [provinceName]);

  // Use the time-series heatmap hook
  useTimeSeriesHeatmap(mapRef, geoJsonData, isMapReady, currentYear);

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

  const currentNarration = getYearlyNarration(currentYear);

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
                  Analysis Year: {currentYear}
                </label>
                <div className="text-sm text-gray-600">
                  {currentYear === 2020
                    ? "Baseline"
                    : `${currentYear - 2020} years after intervention`}
                </div>
              </div>

              <Slider
                value={[currentYear]}
                onValueChange={(value) => setCurrentYear(value[0])}
                min={2020}
                max={2024}
                step={1}
                className="w-full"
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
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
                  {currentYear}: {currentNarration.title}
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
