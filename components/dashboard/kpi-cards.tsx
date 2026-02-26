"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, TrendingUp } from "lucide-react"
import { useTranslation, translateRiskLevel } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface KPICardsProps {
  riskScore: number
  riskLevel: "Low" | "Medium" | "High"
  confidence: number
}

export function KPICards({ riskScore, riskLevel, confidence }: KPICardsProps) {
  const { t } = useTranslation()

  const riskConfig = {
    Low: {
      color: "text-risk-low",
      bg: "bg-risk-low-bg",
      border: "border-risk-low/30",
      badge: "bg-risk-low text-[#fff]",
    },
    Medium: {
      color: "text-risk-medium",
      bg: "bg-risk-medium-bg",
      border: "border-risk-medium/30",
      badge: "bg-risk-medium text-[#1a1a1a]",
    },
    High: {
      color: "text-risk-high",
      bg: "bg-risk-high-bg",
      border: "border-risk-high/30",
      badge: "bg-risk-high text-[#fff]",
    },
  }

  const config = riskConfig[riskLevel]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Risk Score */}
      <Card className={cn("border-2 shadow-sm", config.border, config.bg)}>
        <CardContent className="flex items-center gap-4 p-5">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", config.badge)}>
            <Shield className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t.riskScore}</span>
            <span className={cn("text-3xl font-bold tracking-tight font-mono", config.color)}>
              {riskScore}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Risk Level */}
      <Card className={cn("border-2 shadow-sm", config.border, config.bg)}>
        <CardContent className="flex items-center gap-4 p-5">
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", config.badge)}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{t.riskLevel}</span>
            <span className={cn("inline-flex w-fit rounded-full px-3 py-0.5 text-sm font-semibold", config.badge)}>
              {translateRiskLevel(riskLevel, t)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Decision Confidence */}
      <Card className="border-2 border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{t.aiConfidence}</span>
            <span className="text-3xl font-bold tracking-tight font-mono text-primary">
              {confidence}%
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
