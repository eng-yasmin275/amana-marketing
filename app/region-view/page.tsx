'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { fetchMarketingData } from '../../src/lib/api';
import { MarketingData } from '../../src/types/marketing';
import dynamic from 'next/dynamic';

// Dynamically import HeatMap to prevent SSR
const HeatMap = dynamic(() => import('../../src/components/ui/HeatMap'), { ssr: false });

export default function RegionView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        console.error('Failed to fetch marketing data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const regionalDataArray = marketingData
    ? Object.values(
        marketingData.campaigns
          .flatMap(c => c.regional_performance ?? [])
          .reduce<Record<string, { region: string; country: string; spend: number; revenue: number }>>((acc, curr) => {
            if (acc[curr.region]) {
              acc[curr.region].spend += curr.spend;
              acc[curr.region].revenue += curr.revenue;
            } else {
              acc[curr.region] = { ...curr };
            }
            return acc;
          }, {})
      )
    : [];

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
          {loading ? (
            <div className="text-white text-xl font-semibold text-center">Loading...</div>
          ) : regionalDataArray.length === 0 ? (
            <div className="text-white text-xl font-semibold text-center">
              No regional data available
            </div>
          ) : (
            <div className="w-full h-[600px]">
              <HeatMap data={regionalDataArray} />
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
