"use client";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchAllProvinceJson } from "@/lib/utils";
import type { Feature, FeatureCollection } from "geojson";
import { redirect, useRouter } from "next/navigation";

interface ProvinceProperties {
  provinsi: string;
  [key: string]: any;
}

export default function MapComponent() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const [cityGeoJsonData, setCityGeoJsonData] =
    useState<FeatureCollection | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [isClickedDetail, setIsClickedDetail] = useState({
    state: false,
    data: null as Feature | null,
  });
  const [provinceGapScores, setProvinceGapScores] = useState<
    Record<string, number>
  >({});
  const [cityGapScores, setCityGapScores] = useState<Record<string, number>>(
    {}
  );
  const mapRef = useRef<any>(null);
  const router = useRouter();

  const gapScores = [
    0.25, 0.28, 0.32, 0.35, 0.9, 0.82, 0.45, 0.48, 0.52, 0.55, 0.58, 0.62, 0.65,
    0.68, 0.72, 0.75, 0.78, 0.82, 0.85, 0.88, 0.32, 0.35, 0.92, 0.42, 0.45,
    0.48, 0.52, 0.55, 0.58, 0.62, 0.65, 0.68, 0.72, 0.75, 0.78, 0.82, 0.85,
    0.88, 0.92, 0.95, 0.82, 0.42, 0.45, 0.48, 0.52, 0.55, 0.58, 0.62, 0.65,
    0.68,
  ];

  useEffect(() => {
    fetchAllProvinceJson()
      .then((data: FeatureCollection) => {
        const initialProvinceScores: Record<string, number> = {};
        data.features.forEach((feature: Feature, index: number) => {
          const properties = feature.properties as ProvinceProperties;
          if (properties?.provinsi) {
            const provinceName = properties.provinsi;

            initialProvinceScores[provinceName] =
              gapScores[index % gapScores.length];
          }
        });
        setProvinceGapScores(initialProvinceScores);

        setGeoJsonData(data);
        setMapLoading(false);
        
      })
      .catch((error) => {
        console.error("Error loading map data:", error);
        setMapLoading(false);
      });
  }, []);

  const getColorByGapScore = (gapScore: number) => {
    if (gapScore < 0.4) {
      return "#10B981";
    } else if (gapScore < 0.6) {
      return "#F59E0B";
    } else {
      return "#EF4444";
    }
  };

  const style = (feature?: Feature) => {
    if (!feature?.properties) {
      return {
        fillColor: "#cccccc",
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    }

    const properties = feature.properties as ProvinceProperties;
    const provinceName = properties.provinsi;
    const gapScore = provinceGapScores[provinceName] || 0.5;

    return {
      fillColor: getColorByGapScore(gapScore),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const onEachFeature = (feature: Feature, layer: any) => {
    const properties = feature.properties as ProvinceProperties;
    if (!properties?.provinsi) return;

    const provinceName = properties.provinsi;
    const gapScore = provinceGapScores[provinceName] || 0.5;

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;

        layer.bringToFront();

        layer.setStyle({
          weight: 3,
          color: "#ffffff",
          dashArray: "",
          fillOpacity: 0.9,
          fillColor: "#4f46e5",
        });

        e.originalEvent?.stopPropagation();
      },
      mouseout: (e: any) => {
        const layer = e.target;

        layer.setStyle(style(feature));

        e.originalEvent?.stopPropagation();
      },
      click: (e: any) => {
        const provinceName = properties.provinsi?.toLowerCase();
        const formattedProvinceName = provinceName
          .toLowerCase()
          .replace(" ", "-");

        redirect(`/province/${formattedProvinceName}`);
      },
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

  const onTapMapBack = () => {
    setCityGeoJsonData(null);
    setIsClickedDetail({
      state: false,
      data: null,
    });

    if (mapRef.current) {
      mapRef.current.setView([-2.5, 118], 5);
    }
  };

  return (
    <div className="w-full h-full relative">
      {isClickedDetail.state && (
        <button
          onClick={onTapMapBack}
          className="absolute top-4 right-4 z-[1000] bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Provinces</span>
        </button>
      )}
      {geoJsonData ? (
        <div className="h-full w-full bg-gray-300 min-h-96 rounded-xl border-2 border-blue-500/60 overflow-hidden">
          <MapContainer
            center={[-2.5, 118]}
            zoom={isClickedDetail.state ? 7 : 5}
            style={{ width: "100%", height: "100%", minHeight: "400px" }}
            scrollWheelZoom={true}
            className={`rounded-lg relative`}
            ref={mapRef}
            
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {!isClickedDetail.state && geoJsonData && (
              <GeoJSON
                key="provinces"
                data={geoJsonData}
                style={style}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Memuat peta...</p>
          </div>
        </div>
      )}
    </div>
  );
}
