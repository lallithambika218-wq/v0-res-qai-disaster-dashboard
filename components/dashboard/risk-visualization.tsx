"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import type { ZoneRisk } from "@/lib/types"
import { useTranslation, translateRiskLevel } from "@/lib/translations"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface RiskVisualizationProps {
  zoneRisks: ZoneRisk[]
}

const riskColors: Record<string, string> = {
  Low: "oklch(0.6 0.18 155)",
  Medium: "oklch(0.78 0.16 85)",
  High: "oklch(0.55 0.22 28)",
}

const riskBadge: Record<string, string> = {
  Low: "bg-risk-low-bg text-risk-low border-risk-low/30",
  Medium: "bg-risk-medium-bg text-risk-medium border-risk-medium/30",
  High: "bg-risk-high-bg text-risk-high border-risk-high/30",
}

export function RiskVisualization({ zoneRisks }: RiskVisualizationProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          {t.riskVisByZone}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zoneRisks} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="zone"
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 240)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "oklch(0.5 0.01 240)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(1 0 0)",
                  border: "1px solid oklch(0.9 0.01 240)",
                  borderRadius: "8px",
                  fontSize: "13px",
                }}
                formatter={(value: number) => [`${value}%`, "Risk"]}
              />
              <Bar dataKey="risk" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {zoneRisks.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={riskColors[entry.level]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Zone legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {zoneRisks.map((zone) => (
            <div
              key={zone.zone}
              className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/50 px-3 py-2"
            >
              <span className="text-sm font-medium text-card-foreground truncate">{zone.zone}</span>
              <Badge variant="outline" className={cn("ml-2 shrink-0 text-xs font-semibold", riskBadge[zone.level])}>
                {zone.risk}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
