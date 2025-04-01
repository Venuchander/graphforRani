import { GraphGenerator } from "@/components/graph-generator"

export default function Home() {
  return (
    <main className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Graph Generator</h1>
        <p className="text-gray-600 mb-8">
          Enter data in natural language (e.g., "50% residence, 10% commercial, 10% institutional, 20% industrial") and
          generate visualizations.
        </p>
        <GraphGenerator />
      </div>
    </main>
  )
}

