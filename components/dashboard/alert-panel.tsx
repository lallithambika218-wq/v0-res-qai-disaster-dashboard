"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Bell, Send, X } from "lucide-react"
import { useTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

export interface AlertItem {
  id: string
  timestamp: string
  message: string
  severity: "info" | "warning" | "critical"
}

interface AlertPanelProps {
  alerts: AlertItem[]
  isOpen: boolean
  onClose: () => void
  onSendAlert: () => void
}

const severityStyles = {
  info: "border-accent/30 bg-accent/5",
  warning: "border-risk-medium/30 bg-risk-medium-bg",
  critical: "border-risk-high/30 bg-risk-high-bg",
}

const severityBadge = {
  info: "bg-accent/10 text-accent border-accent/30",
  warning: "bg-risk-medium-bg text-risk-medium border-risk-medium/30",
  critical: "bg-risk-high-bg text-risk-high border-risk-high/30",
}

export function AlertPanel({ alerts, isOpen, onClose, onSendAlert }: AlertPanelProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6" onClick={onClose}>
      <div
        className="w-full max-w-md animate-in slide-in-from-right-5 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-border shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-card-foreground">
              <Bell className="h-4 w-4 text-primary" />
              {t.alertsNotifications}
              {alerts.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {alerts.length}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ScrollArea className="max-h-80">
              {alerts.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t.noActiveAlerts}</p>
              ) : (
                <div className="flex flex-col gap-2 pr-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "rounded-lg border p-3 transition-colors",
                        severityStyles[alert.severity]
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            alert.severity === "critical"
                              ? "text-risk-high"
                              : alert.severity === "warning"
                              ? "text-risk-medium"
                              : "text-accent"
                          )}
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium text-card-foreground leading-snug">
                            {alert.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                            <Badge
                              variant="outline"
                              className={cn("text-[10px] uppercase tracking-wider", severityBadge[alert.severity])}
                            >
                              {alert.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <Button
              onClick={onSendAlert}
              variant="outline"
              className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5"
            >
              <Send className="h-4 w-4" />
              {t.sendAlertToField}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
