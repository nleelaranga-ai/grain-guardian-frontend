"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    date: string;
    ghi: number;
  }[];
}

export default function AnalyticsCharts({
  data,
}: Props) {
  return (
    <div className="bg-slate-900 rounded-3xl p-8">

      <h2 className="text-xl font-bold mb-8">
        GHI Trend
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1e293b" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="ghi"
              stroke="#00FF9D"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}
