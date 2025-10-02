'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';

type RegionalPerformance = {
  region: string;
  country: string;
  spend: number;
  revenue: number;
};

type HeatMapProps = {
  data: RegionalPerformance[];
};

export default function HeatMap({ data }: HeatMapProps) {
  // State to ensure client-only rendering (avoids SSR errors)
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading map...</div>;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxSpend = Math.max(...data.map((d) => d.spend));
  const maxRadius = 40;

  // Hard-coded city coordinates (can extend later)
  const coordinates: Record<string, [number, number]> = {
    'Abu Dhabi': [24.4539, 54.3773],
    Dubai: [25.276987, 55.296249],
    Sharjah: [25.3463, 55.4209],
    Riyadh: [24.7136, 46.6753],
    Doha: [25.276987, 51.520008],
    'Kuwait City': [29.3759, 47.9774],
    Manama: [26.2235, 50.5876],
  };

  return (
    <div className="relative w-full h-[600px] rounded-md">
      <MapContainer
        center={[25, 45]}
        zoom={5}
        className="w-full h-full rounded-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {data.map((point, i) => {
          const coord = coordinates[point.region] ?? [25, 45];
          const radiusRevenue = (point.revenue / maxRevenue) * maxRadius;
          const radiusSpend = (point.spend / maxSpend) * maxRadius;

          return (
            <div key={i}>
              {/* Revenue bubble */}
              <CircleMarker
                center={coord}
                radius={radiusRevenue}
                fillColor="red"
                fillOpacity={0.6}
                stroke={false}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                  <span>
                    <strong>{point.region}, {point.country}</strong>
                    <br />
                    Revenue: ${point.revenue.toLocaleString()}
                  </span>
                </Tooltip>
              </CircleMarker>

              {/* Spend bubble */}
              <CircleMarker
                center={coord}
                radius={radiusSpend}
                fillColor="blue"
                fillOpacity={0.6}
                stroke={false}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                  <span>
                    Spend: ${point.spend.toLocaleString()}
                  </span>
                </Tooltip>
              </CircleMarker>
            </div>
          );
        })}
      </MapContainer>

      {/* Simple HTML legend */}
      <div className="absolute bottom-4 right-4 bg-white text-black p-2 rounded shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded-full"></div> Revenue
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-4 h-4 bg-blue-600 rounded-full"></div> Spend
        </div>
      </div>
    </div>
  );
}
