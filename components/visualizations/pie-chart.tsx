"use client"

import { PieChart as ReChartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

type DataPoint = {
  name: string
  value: number
}

interface PieChartProps {
  data: DataPoint[]
  id: string
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
]

export function PieChart({ data, id }: PieChartProps) {
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
    <div id={id} className="h-full w-full bg-white">
      <ChartContainer config={config} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReChartsPie data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
          </ReChartsPie>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

