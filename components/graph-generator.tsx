"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "@/components/visualizations/pie-chart"
import { BarChart } from "@/components/visualizations/bar-chart"
import { Download } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import html2canvas from "html2canvas"

type DataPoint = {
  name: string
  value: number
}

export function GraphGenerator() {
  const [input, setInput] = useState("")
  const [data, setData] = useState<DataPoint[]>([])
  const [activeTab, setActiveTab] = useState("pie")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = () => {
    setIsGenerating(true)

    // Parse the input string to extract percentages and categories
    const parsedData = parseInput(input)

    // Simulate AI processing delay
    setTimeout(() => {
      setData(parsedData)
      setIsGenerating(false)
    }, 500)
  }

  const parseInput = (input: string): DataPoint[] => {
    // Simple regex to match patterns like "50% residence"
    const regex = /(\d+(?:\.\d+)?)%\s*([a-zA-Z]+)/g
    const matches = [...input.matchAll(regex)]

    if (matches.length === 0) {
      // Fallback to comma or space separated values
      const parts = input.split(/[,\s]+/)
      const result: DataPoint[] = []

      for (let i = 0; i < parts.length - 1; i += 2) {
        const value = Number.parseFloat(parts[i])
        const name = parts[i + 1]
        if (!isNaN(value) && name) {
          result.push({ name, value })
        }
      }

      return result
    }

    return matches.map((match) => ({
      name: match[2].charAt(0).toUpperCase() + match[2].slice(1),
      value: Number.parseFloat(match[1]),
    }))
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const chartId = activeTab === "pie" ? "pie-chart" : "bar-chart"
      const chartElement = document.getElementById(chartId)
      
      if (!chartElement) {
        throw new Error("Chart element not found")
      }
      
      const canvas = await html2canvas(chartElement, {
        backgroundColor: "white",
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
      })
      
      // Create download link
      const link = document.createElement("a")
      link.download = `${activeTab}-chart.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
      
      toast({
        title: "Success",
        description: "Chart downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download chart",
        variant: "destructive",
      })
      console.error("Download error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      
      <div className="space-y-4 max-w-2xl mx-auto">
        <Label htmlFor="input" className="text-base">Enter your data</Label>
        <div className="flex gap-2">
          <Input
            id="input"
            placeholder="e.g., 50% residence, 10% commercial, 10% institutional, 20% industrial"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !input.trim()} 
            className="bg-black hover:bg-gray-800 text-white"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <Card className="p-6 mt-8 shadow-md border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList className="border rounded-md">
                <TabsTrigger value="pie" className="rounded-l-md data-[state=active]:bg-black data-[state=active]:text-white">Pie Chart</TabsTrigger>
                <TabsTrigger value="bar" className="rounded-r-md data-[state=active]:bg-black data-[state=active]:text-white">Bar Chart</TabsTrigger>
              </TabsList>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload} 
                disabled={isDownloading} 
                className="border-gray-300"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </div>

            <TabsContent value="pie" className="mt-4 flex justify-center">
              <div className="h-[400px] w-full max-w-3xl mx-auto">
                <PieChart id="pie-chart" data={data} />
              </div>
            </TabsContent>

            <TabsContent value="bar" className="mt-4 flex justify-center">
              <div className="h-[400px] w-full max-w-3xl mx-auto">
                <BarChart id="bar-chart" data={data} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}