"use client"

import { useState, useCallback } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { InputPanel } from "@/components/dashboard/input-panel"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RiskVisualization } from "@/components/dashboard/risk-visualization"
import { ResourceAllocation } from "@/components/dashboard/resource-allocation"
import { ShelterRecommendation } from "@/components/dashboard/shelter-recommendation"
import { analyzeRisk } from "@/lib/analysis-engine"
import { DEFAULT_INPUT } from "@/lib/types"
import type { InputData, AnalysisResult } from "@/lib/types"

function getInitialResult(): AnalysisResult {
  return analyzeRisk(DEFAULT_INPUT)
}

export default function DashboardPage() {
  const [input, setInput] = useState<InputData>(DEFAULT_INPUT)
  const [result, setResult] = useState<AnalysisResult>(getInitialResult)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!response.ok) throw new Error("Analysis failed")
      const data: AnalysisResult = await response.json()
      setResult(data)
      setLastAnalyzed(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    } catch {
      // Fallback to local computation
      const fallback = analyzeRisk(input)
      setResult(fallback)
      setLastAnalyzed(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )
    } finally {
      setIsLoading(false)
    }
  }, [input])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader lastAnalyzed={lastAnalyzed} />

      <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
        {/* Left sidebar - Input Panel */}
        <aside className="w-full shrink-0 lg:w-80 xl:w-96">
          <div className="sticky top-6">
            <InputPanel
              input={input}
              onInputChange={setInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex flex-1 flex-col gap-6">
          {/* KPI Cards */}
          <section aria-label="Key performance indicators">
            <KPICards
              riskScore={result.riskScore}
              riskLevel={result.riskLevel}
              confidence={result.confidence}
            />
          </section>

          {/* Risk Visualization */}
          <section aria-label="Risk visualization">
            <RiskVisualization zoneRisks={result.zoneRisks} />
          </section>

          {/* Resource Allocation and Shelter */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section aria-label="Resource allocation">
              <ResourceAllocation resources={result.resources} />
            </section>
            <section aria-label="Shelter recommendations">
              <ShelterRecommendation shelters={result.shelters} />
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
