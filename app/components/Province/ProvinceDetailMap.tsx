import { fetchAllProvinceJson } from "@/lib/utils";
import { FeatureCollection, Feature } from "geojson";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { useProvinceStore } from "@/app/store/provinceStore";

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

// Quarterly intensity calculation for 5 years (20 quarters)
const getQuarterlyIntensityMultiplier = (
  quarter: number
): { base: number; variance: number } => {
  // Quarter 1 = Q2 2025 (start), Quarter 21 = Q2 2030 (end)
  // Create gradual improvement from high intensity (bad) to low intensity (good)

  // Linear decrease from 100 (bad) to 10 (good) over 20 quarters
  const baseIntensity = Math.max(10, 100 - (quarter - 1) * (90 / 20));

  // Variance decreases as situation stabilizes
  const variance = Math.max(5, 25 - (quarter - 1) * (20 / 20));

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
  quarter: number,
  fixedLocations?: [number, number][]
): [number, number, number][] => {
  // Generate fixed locations if not provided
  const locations = fixedLocations || generateFixedLocations(feature, 45);

  // Get quarter-specific intensity parameters
  const { base, variance } = getQuarterlyIntensityMultiplier(quarter);

  // Apply time-varying intensity to fixed locations
  return locations.map(([lat, lng], index) => {
    // Use a seeded random to ensure consistent variation for each point
    const locationSeed = 12345 + index * 67;
    let seedValue = locationSeed;
    const seededRandom = () => {
      seedValue = (seedValue * 9301 + 49297) % 233280;
      return seedValue / 233280;
    };

    // Calculate intensity with some random variation
    const randomFactor = (seededRandom() - 0.5) * variance;
    const intensity = Math.max(10, base + randomFactor);

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

    // Generate fixed locations only once
    if (!fixedLocationsRef.current) {
      fixedLocationsRef.current = generateFixedLocations(provinceFeature, 45);
    }

    // Create and add the heatmap layer only once
    if (!heatLayerRef.current && fixedLocationsRef.current) {
      const initialHeatmapPoints = generateTimeSeriesHeatmapPoints(
        provinceFeature,
        currentMonth,
        fixedLocationsRef.current
      );

      const heatmapOptions = {
        radius: 40,
        blur: 30,
        maxZoom: 17,
        max: 125,
        gradient: {
          0.1: "#2dc937", // green
          0.4: "#ffdd00", // yellow
          0.7: "#ff8c00", // dark orange
          1.0: "#ff4500", // orange red
        },
        minOpacity: 0.4,
      };

      heatLayerRef.current = L.heatLayer(initialHeatmapPoints, heatmapOptions).addTo(map);
    }

    // Cleanup function to remove the layer when the component unmounts
    return () => {
      if (heatLayerRef.current && map) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [mapRef, provinceData, isMapReady]); // Removed currentMonth from dependencies

  // This effect will run only when `currentMonth` changes
  useEffect(() => {
    if (
      !heatLayerRef.current ||
      !provinceData ||
      provinceData.features.length === 0 ||
      !fixedLocationsRef.current
    ) {
      return;
    }

    // 1. Generate new points with updated intensity for the current month
    const provinceFeature = provinceData.features[0];
    const heatmapPoints = generateTimeSeriesHeatmapPoints(
      provinceFeature,
      currentMonth,
      fixedLocationsRef.current
    );
    // 2. Update the heatmap layer with the new data points
    (heatLayerRef.current as any).setLatLngs(heatmapPoints);

    // 3. Calculate new opacity to make the layer fade over time
    // Opacity will range from 0.7 (start) to 0.2 (end)
    const maxMonth = 21;
    const minMonth = 1;
    const startOpacity = 0.7;
    const endOpacity = 0.2;

    const newOpacity =
      startOpacity -
      ((currentMonth - minMonth) / (maxMonth - minMonth)) *
        (startOpacity - endOpacity);

    // 4. Update the heatmap layer's options with the new opacity
    (heatLayerRef.current as any).setOptions({ minOpacity: newOpacity });

  }, [currentMonth, provinceData]);

  return heatLayerRef.current;
};


interface ProvinceProperties {
  provinsi: string;
  [key: string]: any;
}

interface ProvinceDetailMapProps {
  provinceName: string;
}

const ProvinceDetailMap = ({ provinceName }: ProvinceDetailMapProps) => {
  const { currentMonth, isMapReady, setIsMapReady } = useProvinceStore();
  const [provinceGapScores, setProvinceGapScores] = useState<
    Record<string, number>
  >({});
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const [mapLoading, setMapLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-2.5, 118]);
  const [mapZoom, setMapZoom] = useState<number>(7);
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
          setMapZoom(11);
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

  return (
    <>
      {geoJsonData && (
        <div className="space-y-6">
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
                setIsMapReady(true);
              }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <GeoJSON
                key={`provinces-${currentMonth}`}
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