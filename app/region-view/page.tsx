'use client';

<<<<<<< HEAD
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
=======
import dynamic from 'next/dynamic';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { fetchMarketingDataClient } from '../../src/lib/api';
import { useEffect, useState } from 'react';

const HeatMap = dynamic(
  () => import('../../src/components/ui/HeatMap'),
  { ssr: false }
);

export default function RegionView() {
  const [marketingData, setMarketingData] = useState<any>(null);

  useEffect(() => {
    fetchMarketingDataClient()
      .then((data) => setMarketingData(data))
      .catch((err) => console.error(err));
  }, []);

  const regionalData = marketingData?.campaigns?.[0]?.regional_performance || [];

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Region View</h1>
          </div>
        </section>

        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {regionalData.length > 0 ? (
            <HeatMap data={regionalData} />
          ) : (
            <p className="text-white text-center">No regional data available</p>
          )}
        </div>

        <Footer />
>>>>>>> 8e26861 (back to code worked locally region view)
      </div>
    </div>
  );
}
