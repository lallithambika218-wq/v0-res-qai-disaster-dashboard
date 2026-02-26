"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, RotateCcw, X } from "lucide-react"
import { useTranslation, translateRiskLevel } from "@/lib/translations"
import { cn } from "@/lib/utils"

export interface HistoryEntry {
  id: string
  timestamp: string
  area: string
  riskLevel: "Low" | "Medium" | "High"
  riskScore: number
}

interface HistoryPanelProps {
  entries: HistoryEntry[]
  isOpen: boolean
  onClose: () => void
  onRestore: (id: string) => void
}

const levelBadge = {
  Low: "bg-risk-low-bg text-risk-low border-risk-low/30",
  Medium: "bg-risk-medium-bg text-risk-medium border-risk-medium/30",
  High: "bg-risk-high-bg text-risk-high border-risk-high/30",
}

export function HistoryPanel({ entries, isOpen, onClose, onRestore }: HistoryPanelProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-foreground/20" onClick={onClose} />

      {/* Panel */}
      <div
        className={cn(
          "fixed z-50 flex flex-col bg-card shadow-xl border-border",
          "sm:right-0 sm:top-0 sm:h-full sm:w-96 sm:border-l sm:animate-in sm:slide-in-from-right",
          "inset-x-0 bottom-0 max-h-[75vh] rounded-t-2xl border-t sm:rounded-none sm:inset-x-auto"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
            <History className="h-4 w-4 text-primary" />
            {t.analysisHistory}
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          {entries.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {t.noHistory}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-secondary/30 p-3 transition-colors hover:bg-secondary/60"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-sm font-medium text-card-foreground truncate">
                      {entry.area}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-semibold", levelBadge[entry.riskLevel])}
                      >
                        {translateRiskLevel(entry.riskLevel, t)} ({entry.riskScore})
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRestore(entry.id)}
                    className="shrink-0 gap-1 text-xs text-primary hover:text-primary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t.restore}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  )
}
