"use client"

import {
  BarChart as ReChartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type DataPoint = {
  name: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  id: string
}

// Professional color palette
const COLORS = [
  "#ff7043", // coral
  "#26a69a", // teal
  "#5c6bc0", // indigo
  "#ffa726", // amber
  "#78909c", // blue-grey
  "#ec407a", // pink
  "#7cb342", // light-green
  "#8d6e63", // brown
]

export function BarChart({ data, id }: BarChartProps) {
  // Create config object for ChartContainer
  const config = data.reduce(
    (acc, item, index) => {
      acc[item.name.toLowerCase()] = {
        label: item.name,
        color: COLORS[index % COLORS.length],
      }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )

  // Transform data for the chart
  const chartData = data.map((item) => ({
    name: item.name,
    [item.name.toLowerCase()]: item.value,
  }))

  return (
    <div id={id} className="h-full w-full bg-white rounded-lg shadow-inner">
      <ChartContainer config={config} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsBar 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barGap={5}
            barSize={40}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={{ stroke: "#e0e0e0" }}
            />
            <YAxis 
              label={{ 
                value: "Percentage (%)", 
                angle: -90, 
                position: "insideLeft", 
                style: { textAnchor: 'middle', fontSize: 12, fill: "#666" },
                dy: -10
              }}
              tick={{ fontSize: 12, fill: "#666" }}
              axisLine={{ stroke: "#e0e0e0" }}
              tickLine={{ stroke: "#e0e0e0" }}
            />
            <Tooltip 
              content={<ChartTooltipContent />} 
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: 20, fontSize: 12 }}
              iconType="circle"
            />
            {data.map((entry, index) => (
              <Bar
                key={entry.name}
                dataKey={entry.name.toLowerCase()}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            ))}
          </ReChartsBar>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}