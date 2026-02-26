"use client"

import Image from "next/image"
import { Bell, Radio } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  lastAnalyzed: string | null
}

export function DashboardHeader({ lastAnalyzed }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <Image
          src="/images/resqai-logo.png"
          alt="ResQAI Logo"
          width={48}
          height={48}
          className="rounded-lg"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">
            ResQAI
          </h1>
          <p className="text-xs text-muted-foreground">
            Disaster Response AI Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {lastAnalyzed && (
          <span className="hidden text-xs text-muted-foreground sm:inline-flex items-center gap-1">
            Last analyzed: {lastAnalyzed}
          </span>
        )}
        <Badge variant="outline" className="gap-1.5 border-risk-low/40 bg-risk-low-bg text-risk-low text-xs">
          <Radio className="h-3 w-3" />
          System Online
        </Badge>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-card-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-risk-high" />
        </button>
      </div>
    </header>
  )
}
