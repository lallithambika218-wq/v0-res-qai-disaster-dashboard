"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, MapPin, ArrowUpRight, Users } from "lucide-react"
import type { ShelterInfo } from "@/lib/types"
import { useTranslation, translateSafety } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface ShelterRecommendationProps {
  shelters: ShelterInfo[]
}

export function ShelterRecommendation({ shelters }: ShelterRecommendationProps) {
  const { t } = useTranslation()

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Home className="h-5 w-5 text-primary" />
          {t.shelterRecommendation}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {shelters.map((shelter) => (
            <div
              key={shelter.name}
              className={cn(
                "rounded-lg border p-4 transition-colors",
                shelter.safetyStatus === "Safe"
                  ? "border-risk-low/30 bg-risk-low-bg/50"
                  : "border-risk-high/30 bg-risk-high-bg/50"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-card-foreground">{shelter.name}</span>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {shelter.capacity.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {shelter.elevation}m
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {shelter.distance}
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs font-semibold",
                    shelter.safetyStatus === "Safe"
                      ? "bg-risk-low-bg text-risk-low border-risk-low/30"
                      : "bg-risk-high-bg text-risk-high border-risk-high/30"
                  )}
                >
                  {translateSafety(shelter.safetyStatus, t)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
