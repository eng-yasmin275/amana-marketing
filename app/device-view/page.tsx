"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/src/components/ui/navbar";
import { Footer } from "@/src/components/ui/footer";
import { fetchMarketingData } from "@/src/lib/api";
import { MarketingData } from "@/src/types/marketing";
import { BarChart } from "@/src/components/ui/bar-chart";
import { CardMetric } from "@/src/components/ui/card-metric";
import { Table } from "@/src/components/ui/table";

export default function DeviceViewPage() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        console.error("Failed to fetch marketing data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold">Device View</h1>
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white text-xl font-semibold">Loading...</div>
          </div>
        ) : !marketingData ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white text-xl font-semibold">No data available</div>
          </div>
        ) : (
          <div className="flex-1 p-6 overflow-y-auto space-y-8">
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CardMetric
                title="Total Clicks (Mobile)"
                value={marketingData.campaigns.reduce(
                  (sum, c) =>
                    sum +
                    c.device_performance
                      .filter((d) => d.device === "Mobile")
                      .reduce((s, d) => s + d.clicks, 0),
                  0
                )}
              />
              <CardMetric
                title="Total Spend (Mobile)"
                value={marketingData.campaigns.reduce((sum, c) => {
                  const mobileClicks = c.device_performance
                    .filter((d) => d.device === "Mobile")
                    .reduce((s, d) => s + d.clicks, 0);
                  return sum + (c.clicks > 0 ? (c.spend / c.clicks) * mobileClicks : 0);
                }, 0).toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />
              <CardMetric
                title="Total Revenue (Mobile)"
                value={marketingData.campaigns.reduce((sum, c) => {
                  const mobileConversions = c.device_performance
                    .filter((d) => d.device === "Mobile")
                    .reduce((s, d) => s + d.conversions, 0);
                  return sum + (c.conversions > 0 ? (c.revenue / c.conversions) * mobileConversions : 0);
                }, 0).toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />

              <CardMetric
                title="Total Clicks (Desktop)"
                value={marketingData.campaigns.reduce(
                  (sum, c) =>
                    sum +
                    c.device_performance
                      .filter((d) => d.device === "Desktop")
                      .reduce((s, d) => s + d.clicks, 0),
                  0
                )}
              />
              <CardMetric
                title="Total Spend (Desktop)"
                value={marketingData.campaigns.reduce((sum, c) => {
                  const desktopClicks = c.device_performance
                    .filter((d) => d.device === "Desktop")
                    .reduce((s, d) => s + d.clicks, 0);
                  return sum + (c.clicks > 0 ? (c.spend / c.clicks) * desktopClicks : 0);
                }, 0).toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />
              <CardMetric
                title="Total Revenue (Desktop)"
                value={marketingData.campaigns.reduce((sum, c) => {
                  const desktopConversions = c.device_performance
                    .filter((d) => d.device === "Desktop")
                    .reduce((s, d) => s + d.conversions, 0);
                  return sum + (c.conversions > 0 ? (c.revenue / c.conversions) * desktopConversions : 0);
                }, 0).toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />

              {/* Tablet */}
  <CardMetric
    title="Total Clicks (Tablet)"
    value={marketingData.campaigns.reduce(
      (sum, c) =>
        sum +
        c.device_performance
          .filter((d) => d.device === "Tablet")
          .reduce((s, d) => s + d.clicks, 0),
      0
    )}
  />
  <CardMetric
    title="Total Spend (Tablet)"
    value={marketingData.campaigns
      .reduce((sum, c) => {
        const tabletClicks = c.device_performance
          .filter((d) => d.device === "Tablet")
          .reduce((s, d) => s + d.clicks, 0);
        return sum + (c.clicks > 0 ? (c.spend / c.clicks) * tabletClicks : 0);
      }, 0)
      .toLocaleString(undefined, { style: "currency", currency: "USD" })}
  />
  <CardMetric
    title="Total Revenue (Tablet)"
    value={marketingData.campaigns
      .reduce((sum, c) => {
        const tabletConversions = c.device_performance
          .filter((d) => d.device === "Tablet")
          .reduce((s, d) => s + d.conversions, 0);
        return sum + (c.conversions > 0 ? (c.revenue / c.conversions) * tabletConversions : 0);
      }, 0)
      .toLocaleString(undefined, { style: "currency", currency: "USD" })}
  />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart
                title="Spend by Device"
                data={Object.entries(
                  marketingData.campaigns.reduce((acc, c) => {
                    c.device_performance.forEach((d) => {
                      if (!acc[d.device]) acc[d.device] = { spend: 0 };
                      acc[d.device].spend += c.clicks > 0 ? (c.spend / c.clicks) * d.clicks : 0;
                    });
                    return acc;
                  }, {} as Record<string, { spend: number }>)
                ).map(([device, vals]) => ({
                  label: device,
                  value: vals.spend,
                }))}
              />

              <BarChart
                title="Revenue by Device"
                data={Object.entries(
                  marketingData.campaigns.reduce((acc, c) => {
                    c.device_performance.forEach((d) => {
                      if (!acc[d.device]) acc[d.device] = { revenue: 0 };
                      acc[d.device].revenue += c.conversions > 0 ? (c.revenue / c.conversions) * d.conversions : 0;
                    });
                    return acc;
                  }, {} as Record<string, { revenue: number }>)
                ).map(([device, vals]) => ({
                  label: device,
                  value: vals.revenue,
                }))}
              />
            </div>

            {/* Tables */}
            <div className="space-y-8">
              <Table
                title="Campaign Performance by Device"
                columns={[
                  { key: "campaign", header: "Campaign", sortable: true },
                  { key: "device", header: "Device", sortable: true },
                  { key: "impressions", header: "Impressions", sortable: true, sortType: "number", align: "right" },
                  { key: "clicks", header: "Clicks", sortable: true, sortType: "number", align: "right" },
                  { key: "conversions", header: "Conversions", sortable: true, sortType: "number", align: "right" },
                  { key: "ctr", header: "CTR", align: "right" },
                  { key: "conversion_rate", header: "Conversion Rate", align: "right" },
                ]}
                data={marketingData.campaigns.flatMap((campaign) =>
                  campaign.device_performance.map((d) => ({
                    campaign: campaign.name,
                    device: d.device,
                    impressions: d.impressions,
                    clicks: d.clicks,
                    conversions: d.conversions,
                    ctr:
                      d.impressions > 0
                        ? ((d.clicks / d.impressions) * 100).toFixed(2) + "%"
                        : "0%",
                    conversion_rate:
                      d.clicks > 0
                        ? ((d.conversions / d.clicks) * 100).toFixed(2) + "%"
                        : "0%",
                  }))
                )}
                showIndex
                maxHeight="500px"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
