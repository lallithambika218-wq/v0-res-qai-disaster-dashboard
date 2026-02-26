import type { InputData, AnalysisResult, ResourceItem, ShelterInfo, ZoneRisk } from "./types"

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function analyzeRisk(input: InputData): AnalysisResult {
  const intensityMultiplier = 1 + input.disasterIntensity / 100

  // Compute a raw risk score based on weighted factors
  const rainfallFactor = clamp((input.rainfall * intensityMultiplier) / 400, 0, 1) * 35
  const elevationFactor = clamp(1 - input.elevation / 200, 0, 1) * 20
  const populationFactor = clamp(input.population / 20000, 0, 1) * 20
  const coastalFactor = clamp(1 - input.coastalDistance / 100, 0, 1) * 25

  const rawScore = rainfallFactor + elevationFactor + populationFactor + coastalFactor

  // Add area-specific modifiers
  const areaModifiers: Record<string, number> = {
    "Zone A - Coastal North": 8,
    "Zone B - River Delta": 12,
    "Zone C - Urban Center": 3,
    "Zone D - Highland East": -5,
    "Zone E - Lowland South": 10,
    "Zone F - Industrial West": 2,
  }
  const areaMod = areaModifiers[input.area] ?? 0

  const riskScore = clamp(Math.round(rawScore + areaMod), 0, 100)

  const riskLevel: "Low" | "Medium" | "High" =
    riskScore >= 65 ? "High" : riskScore >= 35 ? "Medium" : "Low"

  // Deterministic confidence based on inputs (avoids hydration mismatch from Math.random)
  const inputHash = (input.rainfall * 7 + input.elevation * 3 + input.population * 0.01 + input.coastalDistance * 2 + input.disasterIntensity) % 18
  const confidence = clamp(
    Math.round(72 + inputHash + (input.rainfall > 100 ? 5 : 0)),
    60,
    99
  )

  // Resources scale with risk
  const resources: ResourceItem[] = computeResources(riskScore, riskLevel)
  const shelters: ShelterInfo[] = computeShelters(input.area, riskLevel)
  const zoneRisks: ZoneRisk[] = computeZoneRisks(input, intensityMultiplier)

  return { riskScore, riskLevel, confidence, resources, shelters, zoneRisks }
}

function computeResources(riskScore: number, riskLevel: string): ResourceItem[] {
  const scale = riskScore / 50
  return [
    {
      type: "Rescue Boats",
      quantity: Math.max(2, Math.round(8 * scale)),
      status: riskLevel === "High" ? "Deployed" : "Standby",
    },
    {
      type: "Ambulances",
      quantity: Math.max(3, Math.round(12 * scale)),
      status: riskLevel === "High" ? "Deployed" : riskLevel === "Medium" ? "En Route" : "Standby",
    },
    {
      type: "Food Kits",
      quantity: Math.max(100, Math.round(500 * scale)),
      status: riskLevel === "High" ? "En Route" : "Standby",
    },
    {
      type: "Medical Teams",
      quantity: Math.max(2, Math.round(6 * scale)),
      status: riskLevel === "High" ? "Deployed" : "Standby",
    },
    {
      type: "Emergency Shelters",
      quantity: Math.max(1, Math.round(4 * scale)),
      status: riskLevel === "High" ? "En Route" : "Standby",
    },
    {
      type: "Water Tankers",
      quantity: Math.max(1, Math.round(5 * scale)),
      status: riskLevel !== "Low" ? "Deployed" : "Standby",
    },
  ]
}

function computeShelters(area: string, riskLevel: string): ShelterInfo[] {
  const shelterDB: Record<string, ShelterInfo[]> = {
    "Zone A - Coastal North": [
      { name: "North Community Center", capacity: 500, elevation: 45, safetyStatus: "Safe", distance: "2.3 km" },
      { name: "Hillside School", capacity: 300, elevation: 60, safetyStatus: "Safe", distance: "4.1 km" },
      { name: "Coastal Church Hall", capacity: 150, elevation: 12, safetyStatus: riskLevel === "High" ? "At Risk" : "Safe", distance: "0.8 km" },
    ],
    "Zone B - River Delta": [
      { name: "Delta High School", capacity: 600, elevation: 35, safetyStatus: "Safe", distance: "3.5 km" },
      { name: "River View Hall", capacity: 200, elevation: 10, safetyStatus: "At Risk", distance: "1.2 km" },
      { name: "Municipal Stadium", capacity: 1000, elevation: 50, safetyStatus: "Safe", distance: "5.7 km" },
    ],
    "Zone C - Urban Center": [
      { name: "City Convention Center", capacity: 2000, elevation: 55, safetyStatus: "Safe", distance: "1.0 km" },
      { name: "Metro Sports Complex", capacity: 1500, elevation: 48, safetyStatus: "Safe", distance: "2.8 km" },
    ],
    "Zone D - Highland East": [
      { name: "Highland Community Hall", capacity: 400, elevation: 120, safetyStatus: "Safe", distance: "3.2 km" },
      { name: "East Ridge School", capacity: 350, elevation: 95, safetyStatus: "Safe", distance: "4.5 km" },
    ],
    "Zone E - Lowland South": [
      { name: "South District Hall", capacity: 450, elevation: 15, safetyStatus: riskLevel !== "Low" ? "At Risk" : "Safe", distance: "2.0 km" },
      { name: "Elevated Community Center", capacity: 600, elevation: 40, safetyStatus: "Safe", distance: "5.3 km" },
      { name: "Southern Arena", capacity: 800, elevation: 30, safetyStatus: riskLevel === "High" ? "At Risk" : "Safe", distance: "3.8 km" },
    ],
    "Zone F - Industrial West": [
      { name: "West Factory Hall", capacity: 350, elevation: 42, safetyStatus: "Safe", distance: "1.5 km" },
      { name: "Industrial Park Center", capacity: 500, elevation: 38, safetyStatus: "Safe", distance: "2.9 km" },
    ],
  }
  return shelterDB[area] ?? shelterDB["Zone A - Coastal North"]
}

function computeZoneRisks(input: InputData, multiplier: number): ZoneRisk[] {
  const baseRisks = [
    { zone: "Coastal North", base: 55 },
    { zone: "River Delta", base: 65 },
    { zone: "Urban Center", base: 30 },
    { zone: "Highland East", base: 15 },
    { zone: "Lowland South", base: 60 },
    { zone: "Industrial West", base: 25 },
  ]

  return baseRisks.map(({ zone, base }) => {
    const rainMod = (input.rainfall / 300) * 20
    const risk = clamp(Math.round((base + rainMod) * multiplier), 0, 100)
    const level: "Low" | "Medium" | "High" =
      risk >= 65 ? "High" : risk >= 35 ? "Medium" : "Low"
    return { zone, risk, level }
  })
}
