"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea" // Changed from Input to Textarea
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart } from "@/components/visualizations/pie-chart"
import { BarChart } from "@/components/visualizations/bar-chart"
import { CustomProgressChart } from "@/components/visualizations/custom-progress-chart"
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
  const [activeTab, setActiveTab] = useState("custom") // Default to custom progress bars
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
    // First, normalize the input
    const normalizedInput = input
      .replace(/\n/g, ' ') // Replace line breaks with spaces
      .replace(/,/g, ' ') // Replace commas with spaces
      .trim();
    
    // This regex pattern looks for number + % + word pattern regardless of surrounding spaces
    const regex = /(\d+(?:\.\d+)?)%\s*([a-zA-Z0-9 ]+?)(?=\s+\d+%|\s*$)/g;
    
    const matches = [...normalizedInput.matchAll(regex)];
    
    if (matches.length === 0) {
      // If no matches with the regex, try a simpler approach
      // Split by spaces and look for alternating number/text patterns
      const parts = normalizedInput.split(/\s+/);
      const result: DataPoint[] = [];
      
      for (let i = 0; i < parts.length; i++) {
        // Check if this part is a percentage value
        if (parts[i].endsWith('%')) {
          const value = parseFloat(parts[i].replace('%', ''));
          // Get the next part as the name if available
          if (i + 1 < parts.length && isNaN(Number(parts[i + 1]))) {
            const name = parts[i + 1];
            if (!isNaN(value) && name) {
              result.push({ name: name.charAt(0).toUpperCase() + name.slice(1), value });
              i++; // Skip the name part in next iteration
            }
          }
        }
      }
      
      return result;
    }

    return matches.map((match) => ({
      name: match[2].trim().charAt(0).toUpperCase() + match[2].trim().slice(1),
      value: Number.parseFloat(match[1]),
    }));
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      // We'll focus on the custom chart for now
      const chartId = "custom-progress-chart";
      
      const chartElement = document.getElementById(chartId)
      
      if (!chartElement) {
        throw new Error("Chart element not found")
      }
      
      // Create a clone of the element to manipulate for download
      const clone = chartElement.cloneNode(true) as HTMLElement;
      const tempContainer = document.createElement('div');
      tempContainer.appendChild(clone);
      
      // Apply specific styling for export
      clone.style.width = "1200px";
      clone.style.height = "auto";
      clone.style.padding = "50px";
      
      // Ensure text and elements are properly centered
      const percentageCircles = clone.querySelectorAll('.rounded-full span');
      percentageCircles.forEach(circle => {
        const span = circle as HTMLElement;
        span.style.display = "flex";
        span.style.justifyContent = "center";
        span.style.alignItems = "center";
        span.style.width = "100%";
        span.style.height = "100%";
      });
      
      document.body.appendChild(tempContainer);
      
      // Improved quality settings for html2canvas
      const canvas = await html2canvas(clone, {
        backgroundColor: "white",
        scale: 3, // Higher resolution for better quality
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      // Remove the temporary element
      document.body.removeChild(tempContainer);
      
      // Create download link
      const link = document.createElement("a");
      link.download = `progress-chart.png`;
      link.href = canvas.toDataURL("image/png", 1.0); // Use highest quality
      link.click();
      
      toast({
        title: "Success",
        description: "Chart downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download chart",
        variant: "destructive",
      });
      console.error("Download error:", error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      
      <div className="space-y-4 max-w-2xl mx-auto">
        <Label htmlFor="input" className="text-base">Enter your data</Label>
        <div className="flex flex-col gap-2">
          <Textarea
            id="input"
            placeholder="e.g., 80% Category1&#10;65% Category2&#10;90% Category3&#10;85% Category4&#10;100% Category5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[100px]"
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !input.trim()} 
            className="bg-black hover:bg-gray-800 text-white self-start"
          >
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </div>
      </div>

      {data.length > 0 && (
        <Card className="p-6 mt-8 shadow-md border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <TabsList className="border rounded-md">
                <TabsTrigger value="pie" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Pie Chart
                </TabsTrigger>
                <TabsTrigger value="bar" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Bar Chart
                </TabsTrigger>
                <TabsTrigger value="custom" className="data-[state=active]:bg-black data-[state=active]:text-white">
                  Progress Bars
                </TabsTrigger>
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

            <TabsContent value="custom" className="mt-4 flex justify-center">
              <div className="min-h-[400px] w-full max-w-3xl mx-auto py-8">
                <CustomProgressChart id="custom-progress-chart" data={data} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  )
}