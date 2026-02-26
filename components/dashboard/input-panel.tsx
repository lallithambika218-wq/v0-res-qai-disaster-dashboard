"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  CloudRain,
  Mountain,
  Users,
  Waves,
  Activity,
  Search,
} from "lucide-react"
import type { InputData } from "@/lib/types"
import { AREAS } from "@/lib/types"

interface InputPanelProps {
  input: InputData
  onInputChange: (input: InputData) => void
  onAnalyze: () => void
  isLoading: boolean
}

export function InputPanel({ input, onInputChange, onAnalyze, isLoading }: InputPanelProps) {
  const updateField = <K extends keyof InputData>(field: K, value: InputData[K]) => {
    onInputChange({ ...input, [field]: value })
  }

  return (
    <Card className="border-border/60 bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
          <Activity className="h-5 w-5 text-primary" />
          Analysis Parameters
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {/* Area / Zone */}
        <div className="flex flex-col gap-2">
          <Label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            Area / Zone
          </Label>
          <Select value={input.area} onValueChange={(v) => updateField("area", v)}>
            <SelectTrigger className="bg-background text-foreground">
              <SelectValue placeholder="Select zone" />
            </SelectTrigger>
            <SelectContent>
              {AREAS.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Numeric Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
              <CloudRain className="h-3.5 w-3.5 text-primary" />
              Rainfall (mm)
            </Label>
            <Input
              type="number"
              min={0}
              max={1000}
              value={input.rainfall}
              onChange={(e) => updateField("rainfall", Number(e.target.value))}
              className="bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
              <Mountain className="h-3.5 w-3.5 text-primary" />
              Elevation (m)
            </Label>
            <Input
              type="number"
              min={0}
              max={500}
              value={input.elevation}
              onChange={(e) => updateField("elevation", Number(e.target.value))}
              className="bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              Population
            </Label>
            <Input
              type="number"
              min={0}
              max={100000}
              value={input.population}
              onChange={(e) => updateField("population", Number(e.target.value))}
              className="bg-background text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5 text-sm font-medium text-card-foreground">
              <Waves className="h-3.5 w-3.5 text-primary" />
              Coastal Dist. (km)
            </Label>
            <Input
              type="number"
              min={0}
              max={500}
              value={input.coastalDistance}
              onChange={(e) => updateField("coastalDistance", Number(e.target.value))}
              className="bg-background text-foreground"
            />
          </div>
        </div>

        <Separator />

        {/* What-If Slider */}
        <div className="flex flex-col gap-3">
          <Label className="flex items-center justify-between text-sm font-medium text-card-foreground">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Disaster Intensity
            </span>
            <span className="font-mono text-sm font-semibold text-primary">
              +{input.disasterIntensity}%
            </span>
          </Label>
          <Slider
            min={0}
            max={30}
            step={1}
            value={[input.disasterIntensity]}
            onValueChange={([v]) => updateField("disasterIntensity", v)}
            className="py-1"
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Simulate increased rainfall or disaster severity to recalculate risk projections.
          </p>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Analyze Risk
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
