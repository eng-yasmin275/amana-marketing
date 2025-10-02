"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/src/components/ui/navbar";
import { Footer } from "@/src/components/ui/footer";
import { fetchMarketingData } from "@/src/lib/api";
import { MarketingData } from "@/src/types/marketing";
import { BarChart } from "@/src/components/ui/bar-chart";
import { CardMetric } from "@/src/components/ui/card-metric";
import { Table } from "@/src/components/ui/table";

export default function DemographyPage() {
  const [marketingData, setMarketingData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true); // ✅ added loading state

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMarketingData();
        setMarketingData(data);
      } catch (err) {
        console.error("Failed to fetch marketing data", err);
      } finally {
        setLoading(false); // ✅ stop loading whether success or error
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
            <h1 className="text-3xl md:text-5xl font-bold">Demographic View</h1>
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
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Male Metrics */}
              <CardMetric
                title="Total Clicks by Males"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      c.demographic_breakdown
                        .filter((d) => d.gender === "Male")
                        .reduce((s, d) => s + d.performance.clicks, 0),
                    0
                  )
                  .toLocaleString()}
              />
              <CardMetric
                title="Total Spend by Males"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.spend / c.clicks) *
                        c.demographic_breakdown
                          .filter((d) => d.gender === "Male")
                          .reduce((s, d) => s + d.performance.clicks, 0),
                    0
                  )
                  .toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />
              <CardMetric
                title="Total Revenue by Males"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.revenue / c.conversions) *
                        c.demographic_breakdown
                          .filter((d) => d.gender === "Male")
                          .reduce((s, d) => s + d.performance.conversions, 0),
                    0
                  )
                  .toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />

              {/* Female Metrics */}
              <CardMetric
                title="Total Clicks by Females"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      c.demographic_breakdown
                        .filter((d) => d.gender === "Female")
                        .reduce((s, d) => s + d.performance.clicks, 0),
                    0
                  )
                  .toLocaleString()}
              />
              <CardMetric
                title="Total Spend by Females"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.spend / c.clicks) *
                        c.demographic_breakdown
                          .filter((d) => d.gender === "Female")
                          .reduce((s, d) => s + d.performance.clicks, 0),
                    0
                  )
                  .toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />
              <CardMetric
                title="Total Revenue by Females"
                value={marketingData.campaigns
                  .reduce(
                    (sum, c) =>
                      sum +
                      (c.revenue / c.conversions) *
                        c.demographic_breakdown
                          .filter((d) => d.gender === "Female")
                          .reduce((s, d) => s + d.performance.conversions, 0),
                    0
                  )
                  .toLocaleString(undefined, { style: "currency", currency: "USD" })}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart
                title="Total Spend by Age Group"
                data={Object.entries(
                  marketingData.campaigns.reduce((acc, campaign) => {
                    campaign.demographic_breakdown.forEach((demo) => {
                      const key = demo.age_group;
                      if (!acc[key]) acc[key] = { spend: 0 };
                      if (campaign.clicks > 0) {
                        acc[key].spend += (campaign.spend / campaign.clicks) * demo.performance.clicks;
                      }
                    });
                    return acc;
                  }, {} as Record<string, { spend: number }>)
                ).map(([ageGroup, vals]) => ({
                  label: ageGroup,
                  value: vals.spend,
                }))}
              />

              <BarChart
                title="Total Revenue by Age Group"
                data={Object.entries(
                  marketingData.campaigns.reduce((acc, campaign) => {
                    campaign.demographic_breakdown.forEach((demo) => {
                      const key = demo.age_group;
                      if (!acc[key]) acc[key] = { revenue: 0 };
                      if (campaign.conversions > 0) {
                        acc[key].revenue += (campaign.revenue / campaign.conversions) * demo.performance.conversions;
                      }
                    });
                    return acc;
                  }, {} as Record<string, { revenue: number }>)
                ).map(([ageGroup, vals]) => ({
                  label: ageGroup,
                  value: vals.revenue,
                }))}
              />
            </div>

            {/* Tables */}
            <div className="space-y-8">
              <Table
                title="Campaign Performance by Male Age Groups"
                columns={[
                  { key: "campaign", header: "Campaign", sortable: true },
                  { key: "age_group", header: "Age Group", sortable: true },
                  { key: "impressions", header: "Impressions", sortable: true, sortType: "number", align: "right" },
                  { key: "clicks", header: "Clicks", sortable: true, sortType: "number", align: "right" },
                  { key: "conversions", header: "Conversions", sortable: true, sortType: "number", align: "right" },
                  { key: "ctr", header: "CTR", align: "right" },
                  { key: "conversion_rate", header: "Conversion Rate", align: "right" },
                ]}
                data={marketingData.campaigns.flatMap((campaign) =>
                  campaign.demographic_breakdown
                    .filter((demo) => demo.gender === "Male")
                    .map((demo) => ({
                      campaign: campaign.name,
                      age_group: demo.age_group,
                      impressions: demo.performance.impressions,
                      clicks: demo.performance.clicks,
                      conversions: demo.performance.conversions,
                      ctr:
                        demo.performance.impressions > 0
                          ? ((demo.performance.clicks / demo.performance.impressions) * 100).toFixed(2) + "%"
                          : "0%",
                      conversion_rate:
                        demo.performance.clicks > 0
                          ? ((demo.performance.conversions / demo.performance.clicks) * 100).toFixed(2) + "%"
                          : "0%",
                    }))
                )}
                showIndex
                maxHeight="500px"
              />

              <Table
                title="Campaign Performance by Female Age Groups"
                columns={[
                  { key: "campaign", header: "Campaign", sortable: true },
                  { key: "age_group", header: "Age Group", sortable: true },
                  { key: "impressions", header: "Impressions", sortable: true, sortType: "number", align: "right" },
                  { key: "clicks", header: "Clicks", sortable: true, sortType: "number", align: "right" },
                  { key: "conversions", header: "Conversions", sortable: true, sortType: "number", align: "right" },
                  { key: "ctr", header: "CTR", align: "right" },
                  { key: "conversion_rate", header: "Conversion Rate", align: "right" },
                ]}
                data={marketingData.campaigns.flatMap((campaign) =>
                  campaign.demographic_breakdown
                    .filter((demo) => demo.gender === "Female")
                    .map((demo) => ({
                      campaign: campaign.name,
                      age_group: demo.age_group,
                      impressions: demo.performance.impressions,
                      clicks: demo.performance.clicks,
                      conversions: demo.performance.conversions,
                      ctr:
                        demo.performance.impressions > 0
                          ? ((demo.performance.clicks / demo.performance.impressions) * 100).toFixed(2) + "%"
                          : "0%",
                      conversion_rate:
                        demo.performance.clicks > 0
                          ? ((demo.performance.conversions / demo.performance.clicks) * 100).toFixed(2) + "%"
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
