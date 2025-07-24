"use client";
import { MapPin } from "lucide-react";
import React from "react";
import dynamic from "next/dynamic";

// Dynamic import untuk MapComponent tanpa SSR
const MapComponent = dynamic(() => import("./mapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-500">Memuat peta...</p>
      </div>
    </div>
  ),
});

export default function MapSection() {
  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-300">
      <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mr-4 shadow-cyan-500/20">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        Peta Distribusi Infrastruktur Kesehatan Indonesia
      </h3>
      <p className="text-gray-500 mb-4">
        Klik provinsi untuk melihat detail data kesehatan di masing-masing
        provinsi
      </p>
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center h-96 border border-gray-200">
        <MapComponent />
      </div>
    </div>
  );
}
