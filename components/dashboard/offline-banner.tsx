"use client"

import { WifiOff } from "lucide-react"
import { useTranslation } from "@/lib/translations"

interface OfflineBannerProps {
  isOnline: boolean
}

export function OfflineBanner({ isOnline }: OfflineBannerProps) {
  const { t } = useTranslation()

  if (isOnline) return null

  return (
    <div className="flex items-center justify-center gap-2 bg-risk-high px-4 py-2 text-sm font-medium text-[#fff]">
      <WifiOff className="h-4 w-4" />
      <span>{t.offlineBanner}</span>
    </div>
  )
}
