"use client";

import { useState, useEffect } from "react";
import { Navbar } from "../../src/components/ui/navbar";
import { Footer } from "../../src/components/ui/footer";
import { LineChart } from "../../src/components/ui/line-chart";
import { fetchMarketingData } from "../../src/lib/api";
import { MarketingData, WeeklyPerformance } from "../../src/types/marketing";

export default function WeeklyView() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        console.error("Failed to fetch marketing data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">
            Loading weekly data...
          </div>
        </div>
      </div>
    );
  }

  if (!marketingData || marketingData.campaigns.length === 0) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white text-xl font-semibold">
            No weekly data available
          </div>
        </div>
      </div>
    );
  }

  // Collect all weekly performance
  const allWeekly: WeeklyPerformance[] = marketingData.campaigns.flatMap(
    (c) => c.weekly_performance || []
  );

  // Chart data
  const spendByWeek = allWeekly.map((w) => ({
    name: w.week_start,
    value: w.spend,
  }));

  const revenueByWeek = allWeekly.map((w) => ({
    name: w.week_start,
    value: w.revenue,
  }));

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">Weekly View</h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-6 space-y-8 overflow-y-auto">
          <LineChart
            data={spendByWeek}
            lines={[
              { dataKey: "value", label: "Spend by Week", color: "#60A5FA" },
            ]}
          />
          <LineChart
            data={revenueByWeek}
            lines={[
              { dataKey: "value", label: "Revenue by Week", color: "#34D399" },
            ]}
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}
