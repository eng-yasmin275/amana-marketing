'use client';

import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';

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
  if (!data || data.length === 0) {
    return <div className="text-white text-center">No regional data available</div>;
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const maxSpend = Math.max(...data.map((d) => d.spend));
  const maxRadius = 40;

  // Hard-coded coordinates for cities
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
        center={[25, 45]} // Middle East / MENA approx
        zoom={5}
        className="w-full h-full rounded-md"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {data.map((point, i) => {
          const [lat, lng] = coordinates[point.region] ?? [25, 45];

          const revenueRadius = (point.revenue / maxRevenue) * maxRadius;
          const spendRadius = (point.spend / maxSpend) * maxRadius;

          // Dynamic offsets to prevent overlap
          const revenueOffset = 0.05 * i; // slightly shift each city’s revenue bubble
          const spendOffset = -0.05 * i; // slightly shift each city’s spend bubble

          return (
            <React.Fragment key={i}>
              {/* Revenue bubble - red */}
              <CircleMarker
                center={[lat + revenueOffset, lng + revenueOffset]}
                radius={revenueRadius}
                fillColor="red"
                fillOpacity={0.6}
                stroke={false}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                  <span>
                    <strong>{point.region}, {point.country}</strong><br />
                    Revenue: ${point.revenue.toLocaleString()}
                  </span>
                </Tooltip>
              </CircleMarker>

              {/* Spend bubble - blue */}
              <CircleMarker
                center={[lat + spendOffset, lng + spendOffset]}
                radius={spendRadius}
                fillColor="blue"
                fillOpacity={0.6}
                stroke={false}
              >
                <Tooltip direction="top" offset={[0, -2]} opacity={1}>
                  <span>
                    <strong>{point.region}, {point.country}</strong><br />
                    Spend: ${point.spend.toLocaleString()}
                  </span>
                </Tooltip>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Clear Simple HTML Legend */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-80 text-white p-3 rounded-md shadow-md">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-red-600 inline-block rounded-full"></span>
          <span>Revenue</span>
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span className="w-4 h-4 bg-blue-600 inline-block rounded-full"></span>
          <span>Spend</span>
        </div>
      </div>
    </div>
  );
}
