"use client"

import React from "react"

type DataPoint = {
  name: string
  value: number
}

interface CustomProgressChartProps {
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

export function CustomProgressChart({ data, id }: CustomProgressChartProps) {
  return (
    <div id={id} className="w-full h-full bg-white p-4 flex flex-col justify-center">
      <div className="space-y-8 w-full max-w-3xl mx-auto">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            {/* Number bubble */}
            <div 
              className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-md"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            >
              {index + 1}
            </div>
            
            {/* Progress bar container */}
            <div className="flex-grow relative">
              {/* Label text above bar */}
              <div className="absolute -top-6 left-0 right-0">
                <div className="text-sm font-medium text-gray-800">
                  {item.name}
                </div>
              </div>
              
              {/* Background bar */}
              <div className="h-8 md:h-10 bg-gray-200 rounded-full relative">
                {/* Foreground progress */}
                <div 
                  className="h-full rounded-full flex items-center justify-between transition-all duration-500 relative"
                  style={{ 
                    width: `${item.value}%`, 
                    backgroundColor: COLORS[index % COLORS.length],
                    maxWidth: '100%'
                  }}
                >
                  {/* White circle at the end of the bar */}
                  <div className="absolute right-0 top-0 bottom-0 flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <span className="text-gray-800 font-bold text-center">{item.value}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}