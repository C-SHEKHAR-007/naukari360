"use client";

import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

type DailyView = {
  date: string;
  views: number;
};

export default function AnalyticsChart({ data }: { data: DailyView[] }) {
  const { theme, resolvedTheme } = useTheme();
  
  // Use resolvedTheme if available, fallback to theme, then "light"
  const currentTheme = resolvedTheme || theme || "light";
  
  const textColor = currentTheme === "dark" ? "#94a3b8" : "#64748b";
  const gridColor = currentTheme === "dark" ? "#1e293b" : "#e2e8f0";
  const primaryColor = "#ff6b00"; // Naukari360 brand color
  const tooltipBg = currentTheme === "dark" ? "#0f1629" : "#ffffff";
  const tooltipBorder = currentTheme === "dark" ? "#1e293b" : "#e2e8f0";
  const tooltipTextColor = currentTheme === "dark" ? "#f1f5f9" : "#0f172a";

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border border-border bg-surface/50">
        <p className="text-sm text-muted">No view data available yet.</p>
      </div>
    );
  }

  // Format dates for display
  const formattedData = data.map((d) => {
    const dateObj = new Date(d.date);
    return {
      ...d,
      displayDate: dateObj.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    };
  });

  return (
    <div className="h-[350px] w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis 
            dataKey="displayDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }} 
            dy={10}
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: textColor, fontSize: 12 }} 
            tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorder,
              borderRadius: "8px",
              color: tooltipTextColor,
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
            }}
            itemStyle={{ color: primaryColor, fontWeight: "bold" }}
          />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke={primaryColor} 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorViews)" 
            activeDot={{ r: 6, fill: primaryColor, stroke: tooltipBg, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
