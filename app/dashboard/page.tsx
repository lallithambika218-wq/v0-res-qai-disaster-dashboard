"use client"

import { useState, useCallback, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { OfflineBanner } from "@/components/dashboard/offline-banner"
import { InputPanel } from "@/components/dashboard/input-panel"
import { KPICards } from "@/components/dashboard/kpi-cards"
import { RiskVisualization } from "@/components/dashboard/risk-visualization"
import { ResourceAllocation } from "@/components/dashboard/resource-allocation"
import { ShelterRecommendation } from "@/components/dashboard/shelter-recommendation"
import { AlertPanel } from "@/components/dashboard/alert-panel"
import type { AlertItem } from "@/components/dashboard/alert-panel"
import { HistoryPanel } from "@/components/dashboard/history-panel"
import type { HistoryEntry } from "@/components/dashboard/history-panel"
import { analyzeRisk } from "@/lib/analysis-engine"
import { DEFAULT_INPUT } from "@/lib/types"
import type { InputData, AnalysisResult } from "@/lib/types"
import { cn } from "@/lib/utils"

const INITIAL_RESULT: AnalysisResult = analyzeRisk(DEFAULT_INPUT)

export default function DashboardPage() {
  const [input, setInput] = useState<InputData>(DEFAULT_INPUT)
  const [result, setResult] = useState<AnalysisResult>(INITIAL_RESULT)
  const [isLoading, setIsLoading] = useState(false)
  const [lastAnalyzed, setLastAnalyzed] = useState<string | null>(null)

  // Online / offline
  const [isOnline, setIsOnline] = useState(true)
  useEffect(() => {
    setIsOnline(navigator.onLine)
    const goOnline = () => setIsOnline(true)
    const goOffline = () => setIsOnline(false)
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  // Panels
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "initial-1",
      timestamp: "System Init",
      message: "ResQAI system initialized. Ready for risk analysis.",
      severity: "info",
    },
  ])

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [savedResults, setSavedResults] = useState<Record<string, { input: InputData; result: AnalysisResult }>>({})

  const getTimestamp = () =>
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

  const addAlert = useCallback((message: string, severity: AlertItem["severity"]) => {
    setAlerts((prev) => [
      {
        id: `alert-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        message,
        severity,
      },
      ...prev,
    ])
  }, [])

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

      const ts = getTimestamp()
      setLastAnalyzed(ts)

      // Save to history
      const entryId = `h-${Date.now()}`
      setHistory((prev) => [
        {
          id: entryId,
          timestamp: ts,
          area: input.area,
          riskLevel: data.riskLevel,
          riskScore: data.riskScore,
        },
        ...prev,
      ])
      setSavedResults((prev) => ({ ...prev, [entryId]: { input: { ...input }, result: data } }))

      // Generate alerts based on risk level
      if (data.riskLevel === "High") {
        addAlert(
          `High Flood Risk Detected in ${input.area}. Immediate Action Required.`,
          "critical"
        )
      } else if (data.riskLevel === "Medium") {
        addAlert(
          `Elevated risk detected in ${input.area}. Monitor closely.`,
          "warning"
        )
      }
    } catch {
      const fallback = analyzeRisk(input)
      setResult(fallback)

      const ts = getTimestamp()
      setLastAnalyzed(ts)

      const entryId = `h-${Date.now()}`
      setHistory((prev) => [
        {
          id: entryId,
          timestamp: ts,
          area: input.area,
          riskLevel: fallback.riskLevel,
          riskScore: fallback.riskScore,
        },
        ...prev,
      ])
      setSavedResults((prev) => ({ ...prev, [entryId]: { input: { ...input }, result: fallback } }))

      if (fallback.riskLevel === "High") {
        addAlert(
          `High Flood Risk Detected in ${input.area}. Immediate Action Required.`,
          "critical"
        )
      }
    } finally {
      setIsLoading(false)
    }
  }, [input, addAlert])

  const handleRestore = useCallback(
    (id: string) => {
      const saved = savedResults[id]
      if (saved) {
        setInput(saved.input)
        setResult(saved.result)
        setLastAnalyzed(getTimestamp())
        setHistoryOpen(false)
        addAlert(`Restored analysis for ${saved.input.area}.`, "info")
      }
    },
    [savedResults, addAlert]
  )

  const handleSendAlert = useCallback(() => {
    addAlert("Alert dispatched to all field teams in the active zone.", "info")
  }, [addAlert])

  const criticalCount = alerts.filter((a) => a.severity === "critical").length

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardHeader
        lastAnalyzed={lastAnalyzed}
        isOnline={isOnline}
        alertCount={criticalCount}
        onToggleAlerts={() => setAlertsOpen((o) => !o)}
        onToggleHistory={() => setHistoryOpen((o) => !o)}
        onToggleMobileSidebar={() => setMobileSidebarOpen((o) => !o)}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <OfflineBanner isOnline={isOnline} />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Left sidebar - Input Panel */}
        <aside
          className={cn(
            "shrink-0 border-r border-border bg-card",
            // Desktop: always visible
            "hidden lg:block lg:w-80 xl:w-[22rem]",
            // Mobile: slide-in overlay
            mobileSidebarOpen &&
              "fixed inset-y-0 left-0 z-30 block w-80 animate-in slide-in-from-left shadow-xl lg:static lg:shadow-none lg:animate-none"
          )}
        >
          <div className="h-full overflow-y-auto p-4 lg:sticky lg:top-14 lg:max-h-[calc(100vh-3.5rem)] lg:p-5">
            <InputPanel
              input={input}
              onInputChange={setInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Mobile: inline input (only when sidebar closed) */}
        <div className={cn("p-4 lg:hidden", mobileSidebarOpen && "hidden")}>
          <InputPanel
            input={input}
            onInputChange={setInput}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        {/* Main content */}
        <main className="flex flex-1 flex-col gap-5 p-4 sm:p-5 lg:p-6">
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
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <section aria-label="Resource allocation">
              <ResourceAllocation resources={result.resources} />
            </section>
            <section aria-label="Shelter recommendations">
              <ShelterRecommendation shelters={result.shelters} />
            </section>
          </div>
        </main>
      </div>

      {/* Overlay panels */}
      <AlertPanel
        alerts={alerts}
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        onSendAlert={handleSendAlert}
      />
      <HistoryPanel
        entries={history}
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestore}
      />
    </div>
  )
}
