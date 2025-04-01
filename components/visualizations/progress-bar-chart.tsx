"use client"

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type DataPoint = {
  name: string
  value: number
}

interface ProgressBarChartProps {
  data: DataPoint[]
  id: string
}

// Vibrant color palette matching the image
const COLORS = [
  "#F39C12", // orange
  "#E91E63", // pink
  "#3F51B5", // blue
  "#00BCD4", // teal
  "#8BC34A", // green
]

export function ProgressBarChart({ data, id }: ProgressBarChartProps) {
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
  const chartData = data.map((item, index) => ({
    name: item.name,
    value: item.value,
    index: index + 1,
    color: COLORS[index % COLORS.length],
    // Add a maxValue of 100 for reference (since these are percentages)
    maxValue: 100
  }))

  return (
    <div id={id} className="h-full w-full bg-white rounded-lg p-2">
      <ChartContainer config={config} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 50, left: 70, bottom: 20 }}
          >
            {/* Background bars representing 100% */}
            <Bar
              dataKey="maxValue"
              radius={[0, 20, 20, 0]}
              fill="#EEEEEE"
              isAnimationActive={false}
            />
            
            {/* Actual progress bars */}
            <Bar
              dataKey="value"
              radius={[0, 20, 20, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                formatter={(value: number) => `${value}%`}
                style={{ 
                  fill: "#FFFFFF", 
                  fontSize: 18, 
                  fontWeight: "bold",
                  textAnchor: "end",
                  dominantBaseline: "middle",
                  transform: "translateX(-15px)"
                }}
              />
            </Bar>
            
            <XAxis 
              type="number" 
              hide={true}
              domain={[0, 100]}
            />
            
            <YAxis
              type="category"
              dataKey="name"
              tick={false}
              axisLine={false}
              width={60}
            />
            
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

// Custom tooltip component for the chart
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white shadow-lg rounded-md p-3 border border-gray-200">
        <div className="flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: data.color }}
          >
            {data.index}
          </div>
          <div>
            <p className="font-semibold">{data.name}</p>
            <p className="text-lg font-bold">{data.value}%</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};