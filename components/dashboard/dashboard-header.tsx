"use client"

import Image from "next/image"
import { Bell, Radio, WifiOff, Menu, X, History } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/dashboard/language-selector"
import { useTranslation } from "@/lib/translations"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  lastAnalyzed: string | null
  isOnline: boolean
  alertCount: number
  onToggleAlerts: () => void
  onToggleHistory: () => void
  onToggleMobileSidebar: () => void
  mobileSidebarOpen: boolean
}

export function DashboardHeader({
  lastAnalyzed,
  isOnline,
  alertCount,
  onToggleAlerts,
  onToggleHistory,
  onToggleMobileSidebar,
  mobileSidebarOpen,
}: DashboardHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-2.5 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-muted-foreground"
          onClick={onToggleMobileSidebar}
          aria-label={mobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <Image
          src="/images/resqai-logo.png"
          alt="ResQAI Logo"
          width={36}
          height={36}
          priority
          className="h-9 w-9 rounded-lg object-contain"
        />
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight text-card-foreground leading-tight">
            {t.appName}
          </h1>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {t.tagline}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {lastAnalyzed && (
          <span className="hidden text-xs text-muted-foreground lg:inline-flex items-center gap-1">
            {t.lastAnalyzed}: {lastAnalyzed}
          </span>
        )}

        {/* Online / Offline indicator */}
        <Badge
          variant="outline"
          className={cn(
            "gap-1.5 text-xs hidden sm:inline-flex",
            isOnline
              ? "border-risk-low/40 bg-risk-low-bg text-risk-low"
              : "border-risk-high/40 bg-risk-high-bg text-risk-high"
          )}
        >
          {isOnline ? (
            <Radio className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isOnline ? t.online : t.offline}
        </Badge>

        {/* Language selector */}
        <LanguageSelector />

        {/* History button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-card-foreground"
          onClick={onToggleHistory}
          aria-label={t.analysisHistory}
        >
          <History className="h-4 w-4" />
        </Button>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:text-card-foreground"
          onClick={onToggleAlerts}
          aria-label={t.alertsNotifications}
        >
          <Bell className="h-4 w-4" />
          {alertCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-risk-high text-[10px] font-bold text-[#fff]">
              {alertCount > 9 ? "9+" : alertCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
