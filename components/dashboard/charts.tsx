"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Contribution } from "@/lib/types";
import { money } from "@/lib/utils";
import { EmptyState } from "@/components/common/ui";
export function AnalyticsChart({
  rows,
  kind = "timeline",
  days = 30,
}: {
  rows: Contribution[];
  kind?: "timeline" | "methods" | "distribution" | "activity";
  days?: number;
}) {
  const verified = rows.filter((c) => c.status === "Verified");
  const maxDate = Math.max(
    new Date("2026-11-11").getTime(),
    ...rows.map((c) => new Date(c.date).getTime()),
  );
  const endDay =
    new Date(new Date(maxDate).toISOString().slice(0, 10)).getTime() + 86400000;
  const filtered = verified.filter((c) => {
    const time = new Date(c.date).getTime();
    return time >= endDay - days * 86400000 && time < endDay;
  });
  const timeline = Array.from({ length: days === 7 ? 7 : 10 }, (_, i) => {
    const d = new Date(maxDate - (days === 7 ? 6 - i : 27 - i * 3) * 86400000);
    const end = new Date(d.toISOString().slice(0, 10)).getTime() + 86400000;
    const start = end - (days === 7 ? 1 : 3) * 86400000;
    const rs = filtered.filter((c) => {
      const time = new Date(c.date).getTime();
      return time >= start && time < end;
    });
    return {
      name: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      digital: rs
        .filter((c) => c.method !== "Cash")
        .reduce((s, c) => s + c.amount, 0),
      cash: rs
        .filter((c) => c.method === "Cash")
        .reduce((s, c) => s + c.amount, 0),
      count: rs.length,
    };
  });
  const methods = [
    {
      name: "Digital",
      value: filtered
        .filter((c) => c.method !== "Cash")
        .reduce((s, c) => s + c.amount, 0),
    },
    {
      name: "Cash",
      value: filtered
        .filter((c) => c.method === "Cash")
        .reduce((s, c) => s + c.amount, 0),
    },
  ];
  const bins = [
    { name: "Under 200", value: filtered.filter((c) => c.amount < 200).length },
    {
      name: "200–500",
      value: filtered.filter((c) => c.amount >= 200 && c.amount <= 500).length,
    },
    {
      name: "501–1,000",
      value: filtered.filter((c) => c.amount > 500 && c.amount <= 1000).length,
    },
    {
      name: "Over 1,000",
      value: filtered.filter((c) => c.amount > 1000).length,
    },
  ];
  if (!filtered.length)
    return (
      <EmptyState
        title="Waiting for the first gesture"
        description={`Verified contributions from the selected ${days} days will appear here.`}
      />
    );
  return (
    <div className="chart-wrap">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        minHeight={150}
      >
        {kind === "methods" ? (
          <PieChart>
            <Pie
              data={methods}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={5}
            >
              {methods.map((_, i) => (
                <Cell key={i} fill={i ? "#e0bd72" : "#17130f"} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => money(Number(v))} />
          </PieChart>
        ) : kind === "distribution" ? (
          <BarChart data={bins}>
            <CartesianGrid stroke="#eee2cc" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#766958" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#8b7b68" }}
              allowDecimals={false}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              name="Contributions"
              fill="#c79a43"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        ) : kind === "activity" ? (
          <BarChart data={timeline}>
            <CartesianGrid stroke="#eee2cc" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#766958" }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 8 }}
            />
            <Tooltip />
            <Bar
              dataKey="count"
              name="Contributions"
              fill="#c79a43"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={timeline}
            margin={{ top: 10, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="digital-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#c79a43" stopOpacity={0.32} />
                <stop offset="1" stopColor="#c79a43" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#eee2cc" vertical={false} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#766958" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#8b7b68" }}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : v)}
            />
            <Tooltip
              formatter={(v) => money(Number(v))}
              contentStyle={{
                fontSize: 10,
                borderColor: "#e7dcc7",
                borderRadius: 5,
              }}
            />
            <Area
              type="monotone"
              dataKey="digital"
              name="Digital"
              stroke="#17130f"
              fill="url(#digital-fill)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="cash"
              name="Cash"
              stroke="#c79a43"
              fill="transparent"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
