import { useState } from "react";
import { Card } from "@/app/components/ui/card";


interface Province {
  id: string;
  name: string;
  score: number;
  x: number; // Percentage position
  y: number; // Percentage position
}

// Sample province data with approximate positions on Indonesia map
const provinces: Province[] = [
  { id: "jkt", name: "DKI Jakarta", score: 85, x: 52, y: 60 },
  { id: "jbt", name: "Jawa Barat", score: 78, x: 50, y: 62 },
  { id: "jti", name: "Jawa Timur", score: 74, x: 58, y: 65 },
  { id: "jtn", name: "Jawa Tengah", score: 71, x: 54, y: 63 },
  { id: "bali", name: "Bali", score: 80, x: 62, y: 68 },
  { id: "sumut", name: "Sumatera Utara", score: 68, x: 42, y: 35 },
  { id: "sumbar", name: "Sumatera Barat", score: 65, x: 40, y: 45 },
  { id: "sumsel", name: "Sumatera Selatan", score: 63, x: 44, y: 52 },
  { id: "kalbar", name: "Kalimantan Barat", score: 61, x: 48, y: 45 },
  { id: "kaltim", name: "Kalimantan Timur", score: 67, x: 62, y: 42 },
  { id: "sulsel", name: "Sulawesi Selatan", score: 64, x: 70, y: 52 },
  { id: "sulut", name: "Sulawesi Utara", score: 66, x: 72, y: 35 },
  { id: "pabar", name: "Papua Barat", score: 45, x: 85, y: 48 },
  { id: "papua", name: "Papua", score: 42, x: 90, y: 50 },
  { id: "ntb", name: "Nusa Tenggara Barat", score: 59, x: 64, y: 70 },
  { id: "ntt", name: "Nusa Tenggara Timur", score: 56, x: 68, y: 72 },
];

interface IndonesiaMapProps {
  selectedIndex: string;
  onProvinceClick?: (province: Province) => void;
}

export const IndonesiaMap = ({
  selectedIndex,
  onProvinceClick,
}: IndonesiaMapProps) => {
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-data-green";
    if (score >= 70) return "bg-data-blue";
    if (score >= 60) return "bg-data-orange";
    return "bg-data-red";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <Card className="bg-gradient-dashboard shadow-map overflow-hidden">
      <div className="relative p-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Indonesia Education Index Map
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedIndex} - Click provinces for detailed view
          </p>
        </div>

        <div
          className="relative mx-auto max-w-4xl"
          onMouseMove={handleMouseMove}
        >
          {/* Map background */}
          {/* <img
            src={indonesiaMap}
            alt="Indonesia Map"
            className="w-full h-auto rounded-lg shadow-sm"
          /> */}

          {/* Province markers */}
          {provinces.map((province) => (
            <button
              key={province.id}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-all duration-200 cursor-pointer ${getScoreColor(
                province.score
              )}`}
              style={{
                left: `${province.x}%`,
                top: `${province.y}%`,
              }}
              onMouseEnter={() => setHoveredProvince(province)}
              onMouseLeave={() => setHoveredProvince(null)}
              onClick={() => onProvinceClick?.(province)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center mt-6 space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-data-green"></div>
            <span>Excellent (80+)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-data-blue"></div>
            <span>Good (70-79)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-data-orange"></div>
            <span>Fair (60-69)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-data-red"></div>
            <span>Needs Improvement (&lt;60)</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredProvince && (
        <div
          className="fixed z-50 bg-card border border-border rounded-lg p-3 shadow-elevated pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
          }}
        >
          <div className="text-sm font-medium">{hoveredProvince.name}</div>
          <div className="text-xs text-muted-foreground">
            Score:{" "}
            <span className="font-semibold">{hoveredProvince.score}/100</span>
          </div>
        </div>
      )}
    </Card>
  );
};
