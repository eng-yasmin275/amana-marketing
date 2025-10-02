"use client";

import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface LineProps {
  dataKey: string;
  label: string;
  color: string;
}

interface LineChartProps {
  data: { name: string; [key: string]: number | string }[];
  lines: LineProps[];
}

export const LineChart = ({ data, lines }: LineChartProps) => {
  return (
    <div className="w-full h-96 bg-gray-800 p-4 rounded-md">
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="#444" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};
