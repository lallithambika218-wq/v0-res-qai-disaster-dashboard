"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation, LANGUAGE_OPTIONS, type Language } from "@/lib/translations"
import { cn } from "@/lib/utils"

export function LanguageSelector() {
  const { language, setLanguage } = useTranslation()

  const currentLabel = LANGUAGE_OPTIONS.find((l) => l.value === language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Desktop: text button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs font-medium border-border/80 bg-card text-card-foreground hover:bg-secondary"
        >
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">{currentLabel?.nativeLabel}</span>
          <span className="sm:hidden">{currentLabel?.value.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGE_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => setLanguage(opt.value as Language)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              language === opt.value && "bg-primary/5 font-semibold"
            )}
          >
            <span>{opt.nativeLabel}</span>
            <span className="text-xs text-muted-foreground">{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
