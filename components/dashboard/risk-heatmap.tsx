"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Grid3x3 } from "lucide-react"
import type { ZoneRisk } from "@/lib/types"
import { useTranslation, translateRiskLevel } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface RiskHeatmapProps {
  zoneRisks: ZoneRisk[]
}

function getRiskColor(level: string): string {
  switch (level) {
    case "High":
      return "bg-risk-high"
    case "Medium":
      return "bg-risk-medium"
    default:
      return "bg-risk-low"
  }
}

function getRiskBgIntensity(risk: number, level: string): string {
  if (level === "High") {
    return risk >= 80
      ? "bg-risk-high/30 border-risk-high/50"
      : "bg-risk-high/20 border-risk-high/40"
  }
  if (level === "Medium") {
    return risk >= 50
      ? "bg-risk-medium/30 border-risk-medium/50"
      : "bg-risk-medium/20 border-risk-medium/40"
  }
  return "bg-risk-low/20 border-risk-low/40"
}

function getRiskTextColor(level: string): string {
  switch (level) {
    case "High":
      return "text-risk-high"
    case "Medium":
      return "text-risk-medium"
    default:
      return "text-risk-low"
  }
}

export function RiskHeatmap({ zoneRisks }: RiskHeatmapProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Grid3x3 className="h-5 w-5 text-primary" />
          {t.riskHeatmap}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{t.heatmapSubtitle}</p>
      </CardHeader>
      <CardContent>
        {/* Desktop grid heatmap */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-3">
          {zoneRisks.map((zone) => (
            <div
              key={zone.zone}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all hover:scale-[1.02]",
                getRiskBgIntensity(zone.risk, zone.level)
              )}
            >
              {/* Intensity indicator bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl overflow-hidden">
                <div
                  className={cn("w-full transition-all duration-500", getRiskColor(zone.level))}
                  style={{ height: `${zone.risk}%`, marginTop: "auto" }}
                />
              </div>

              <span className="text-sm font-semibold text-card-foreground text-center">{zone.zone}</span>
              <span className={cn("text-3xl font-bold font-mono", getRiskTextColor(zone.level))}>
                {zone.risk}%
              </span>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold",
                  zone.level === "High"
                    ? "bg-risk-high-bg text-risk-high border-risk-high/30"
                    : zone.level === "Medium"
                    ? "bg-risk-medium-bg text-risk-medium border-risk-medium/30"
                    : "bg-risk-low-bg text-risk-low border-risk-low/30"
                )}
              >
                {translateRiskLevel(zone.level, t)}
              </Badge>
            </div>
          ))}
        </div>

        {/* Mobile stacked cards */}
        <div className="flex flex-col gap-2 sm:hidden">
          {zoneRisks.map((zone) => (
            <div
              key={zone.zone}
              className={cn(
                "flex items-center justify-between rounded-lg border-2 p-3 transition-colors",
                getRiskBgIntensity(zone.risk, zone.level)
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-10 w-1.5 rounded-full", getRiskColor(zone.level))} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-card-foreground">{zone.zone}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "w-fit text-[10px] font-semibold",
                      zone.level === "High"
                        ? "bg-risk-high-bg text-risk-high border-risk-high/30"
                        : zone.level === "Medium"
                        ? "bg-risk-medium-bg text-risk-medium border-risk-medium/30"
                        : "bg-risk-low-bg text-risk-low border-risk-low/30"
                    )}
                  >
                    {translateRiskLevel(zone.level, t)}
                  </Badge>
                </div>
              </div>
              <span className={cn("text-2xl font-bold font-mono", getRiskTextColor(zone.level))}>
                {zone.risk}%
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-5 rounded-lg border border-border/60 bg-secondary/30 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-risk-low" />
            <span className="text-xs font-medium text-muted-foreground">{t.legendLow}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-risk-medium" />
            <span className="text-xs font-medium text-muted-foreground">{t.legendMedium}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-sm bg-risk-high" />
            <span className="text-xs font-medium text-muted-foreground">{t.legendHigh}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
