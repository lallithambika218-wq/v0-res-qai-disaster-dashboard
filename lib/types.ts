export interface InputData {
  area: string
  rainfall: number
  elevation: number
  population: number
  coastalDistance: number
  disasterIntensity: number
}

export interface ResourceItem {
  type: string
  quantity: number
  status: "Deployed" | "Standby" | "En Route"
}

export interface ShelterInfo {
  name: string
  capacity: number
  elevation: number
  safetyStatus: "Safe" | "At Risk"
  distance: string
}

export interface ZoneRisk {
  zone: string
  risk: number
  level: "Low" | "Medium" | "High"
}

export interface AnalysisResult {
  riskScore: number
  riskLevel: "Low" | "Medium" | "High"
  confidence: number
  resources: ResourceItem[]
  shelters: ShelterInfo[]
  zoneRisks: ZoneRisk[]
}

export const AREAS = [
  "Zone A - Coastal North",
  "Zone B - River Delta",
  "Zone C - Urban Center",
  "Zone D - Highland East",
  "Zone E - Lowland South",
  "Zone F - Industrial West",
] as const

export const DEFAULT_INPUT: InputData = {
  area: AREAS[0],
  rainfall: 150,
  elevation: 25,
  population: 5000,
  coastalDistance: 10,
  disasterIntensity: 0,
}
