import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Shield, Radio, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Subtle background grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"
      />

      {/* Soft radial glow behind logo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[32rem] w-[32rem] rounded-full bg-primary/8"
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* Logo */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-full bg-primary/5 blur-xl"
          />
          <Image
            src="/images/resqai-logo.png"
            alt="ResQAI Logo"
            width={160}
            height={160}
            priority
            className="relative h-32 w-32 rounded-2xl object-contain sm:h-40 sm:w-40"
          />
        </div>

        {/* Name & tagline */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Res<span className="text-primary">Q</span>AI
          </h1>
          <p className="text-lg font-medium tracking-wide text-muted-foreground sm:text-xl">
            Disaster Response AI
          </p>
        </div>

        {/* Brief description */}
        <p className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground/80">
          AI-powered, offline-capable disaster management platform for real-time
          flood risk analysis, resource allocation, and shelter recommendations.
        </p>

        {/* CTA */}
        <Link href="/dashboard">
          <Button
            size="lg"
            className="group gap-2 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Shield className="h-3.5 w-3.5 text-primary" />
            SDG 13 &amp; 11
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Radio className="h-3.5 w-3.5 text-primary" />
            Offline-Capable
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Activity className="h-3.5 w-3.5 text-primary" />
            AI-Powered
          </span>
        </div>
      </div>
    </main>
  )
}
