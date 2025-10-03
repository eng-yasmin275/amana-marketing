'use client';

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
            <p className="text-white text-center">loading .... </p>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
