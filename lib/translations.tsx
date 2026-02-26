"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// ---------- Supported languages ----------
export type Language = "en" | "ta" | "hi"

export const LANGUAGE_OPTIONS: { value: Language; label: string; nativeLabel: string }[] = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
  { value: "hi", label: "Hindi", nativeLabel: "हிन्दी" },
]

// ---------- Translation keys ----------
export interface TranslationDict {
  // Header
  appName: string
  tagline: string
  lastAnalyzed: string
  online: string
  offline: string
  offlineBanner: string

  // Input panel
  analysisParameters: string
  areaZone: string
  selectZone: string
  rainfall: string
  elevation: string
  population: string
  coastalDist: string
  disasterIntensity: string
  whatIfHint: string
  analyzeRisk: string
  analyzing: string

  // KPI
  riskScore: string
  riskLevel: string
  aiConfidence: string

  // Risk levels
  low: string
  medium: string
  high: string

  // Risk viz
  riskVisByZone: string
  riskHeatmap: string
  heatmapSubtitle: string

  // Resource allocation
  resourceAllocation: string
  resourceType: string
  quantity: string
  status: string
  rescueBoats: string
  ambulances: string
  foodKits: string
  medicalTeams: string
  emergencyShelters: string
  waterTankers: string
  deployed: string
  enRoute: string
  standby: string

  // Shelter
  shelterRecommendation: string
  capacity: string
  safe: string
  atRisk: string

  // Alerts
  alertsNotifications: string
  sendAlertToField: string
  noActiveAlerts: string
  alertDispatched: string

  // History
  analysisHistory: string
  noHistory: string
  restore: string
  restored: string

  // Heatmap legend
  legendLow: string
  legendMedium: string
  legendHigh: string

  // Home page
  openDashboard: string
  homeDescription: string
  sdgAlignment: string
  offlineCapable: string
  aiPowered: string
}

// ---------- English ----------
const en: TranslationDict = {
  appName: "ResQAI",
  tagline: "Disaster Response AI Dashboard",
  lastAnalyzed: "Last analyzed",
  online: "Online",
  offline: "Offline",
  offlineBanner: "You are in Offline Mode. Data shown is from local cache.",

  analysisParameters: "Analysis Parameters",
  areaZone: "Area / Zone",
  selectZone: "Select zone",
  rainfall: "Rainfall (mm)",
  elevation: "Elevation (m)",
  population: "Population",
  coastalDist: "Coastal Dist. (km)",
  disasterIntensity: "Disaster Intensity",
  whatIfHint: "Simulate increased rainfall or disaster severity to recalculate risk projections.",
  analyzeRisk: "Analyze Risk",
  analyzing: "Analyzing...",

  riskScore: "Risk Score",
  riskLevel: "Risk Level",
  aiConfidence: "AI Confidence",

  low: "Low",
  medium: "Medium",
  high: "High",

  riskVisByZone: "Risk Visualization by Zone",
  riskHeatmap: "Risk Heatmap",
  heatmapSubtitle: "Color intensity represents flood risk severity across zones",

  resourceAllocation: "Resource Allocation",
  resourceType: "Resource Type",
  quantity: "Quantity",
  status: "Status",
  rescueBoats: "Rescue Boats",
  ambulances: "Ambulances",
  foodKits: "Food Kits",
  medicalTeams: "Medical Teams",
  emergencyShelters: "Emergency Shelters",
  waterTankers: "Water Tankers",
  deployed: "Deployed",
  enRoute: "En Route",
  standby: "Standby",

  shelterRecommendation: "Shelter Recommendation",
  capacity: "Capacity",
  safe: "Safe",
  atRisk: "At Risk",

  alertsNotifications: "Alerts & Notifications",
  sendAlertToField: "Send Alert to Field Teams",
  noActiveAlerts: "No active alerts",
  alertDispatched: "Alert dispatched to all field teams in the active zone.",

  analysisHistory: "Analysis History",
  noHistory: "No analysis history yet. Run an analysis to get started.",
  restore: "Restore",
  restored: "Restored analysis for",

  legendLow: "Low Risk",
  legendMedium: "Medium Risk",
  legendHigh: "High Risk",

  openDashboard: "Open Dashboard",
  homeDescription: "AI-powered, offline-capable disaster management platform for real-time flood risk analysis, resource allocation, and shelter recommendations.",
  sdgAlignment: "SDG 13 & 11",
  offlineCapable: "Offline-Capable",
  aiPowered: "AI-Powered",
}

// ---------- Tamil ----------
const ta: TranslationDict = {
  appName: "ResQAI",
  tagline: "பேரிடர் மீட்பு AI டாஷ்போர்டு",
  lastAnalyzed: "கடைசியாக பகுப்பாய்வு",
  online: "ஆன்லைன்",
  offline: "ஆஃப்லைன்",
  offlineBanner: "நீங்கள் ஆஃப்லைன் பயன்முறையில் உள்ளீர்கள். உள்ளூர் தரவு காட்டப்படுகிறது.",

  analysisParameters: "பகுப்பாய்வு அளவுருக்கள்",
  areaZone: "பகுதி / மண்டலம்",
  selectZone: "மண்டலத்தைத் தேர்ந்தெடுக்கவும்",
  rainfall: "மழைப்பொழிவு (மி.மீ)",
  elevation: "உயரம் (மீ)",
  population: "மக்கள்தொகை",
  coastalDist: "கடற்கரை தூரம் (கி.மீ)",
  disasterIntensity: "பேரிடர் தீவிரம்",
  whatIfHint: "ஆபத்து கணிப்புகளை மறுகணக்கிட மழைப்பொழிவு அல்லது பேரிடர் தீவிரத்தை உருவகப்படுத்தவும்.",
  analyzeRisk: "ஆபத்தை பகுப்பாய்வு செய்",
  analyzing: "பகுப்பாய்வு செய்கிறது...",

  riskScore: "ஆபத்து மதிப்பெண்",
  riskLevel: "ஆபத்து நிலை",
  aiConfidence: "AI நம்பிக்கை",

  low: "குறைவு",
  medium: "நடுத்தரம்",
  high: "அதிகம்",

  riskVisByZone: "மண்டல வாரியான ஆபத்து காட்சிப்படுத்தல்",
  riskHeatmap: "ஆபத்து வெப்ப வரைபடம்",
  heatmapSubtitle: "நிற தீவிரம் மண்டலங்கள் முழுவதும் வெள்ள ஆபத்து தீவிரத்தை குறிக்கிறது",

  resourceAllocation: "வள ஒதுக்கீடு",
  resourceType: "வள வகை",
  quantity: "அளவு",
  status: "நிலை",
  rescueBoats: "மீட்புப் படகுகள்",
  ambulances: "ஆம்புலன்ஸ்கள்",
  foodKits: "உணவு தொகுப்புகள்",
  medicalTeams: "மருத்துவ குழுக்கள்",
  emergencyShelters: "அவசர தங்குமிடங்கள்",
  waterTankers: "நீர் டேங்கர்கள்",
  deployed: "பயன்படுத்தப்பட்டது",
  enRoute: "வழியில்",
  standby: "தயார் நிலை",

  shelterRecommendation: "தங்குமிட பரிந்துரை",
  capacity: "கொள்ளளவு",
  safe: "பாதுகாப்பானது",
  atRisk: "ஆபத்தில்",

  alertsNotifications: "எச்சரிக்கைகள் & அறிவிப்புகள்",
  sendAlertToField: "களப் பணியாளர்களுக்கு எச்சரிக்கை அனுப்பு",
  noActiveAlerts: "செயலில் எச்சரிக்கைகள் இல்லை",
  alertDispatched: "அனைத்து களப் பணியாளர்களுக்கும் எச்சரிக்கை அனுப்பப்பட்டது.",

  analysisHistory: "பகுப்பாய்வு வரலாறு",
  noHistory: "இதுவரை பகுப்பாய்வு வரலாறு இல்லை. தொடங்க ஒரு பகுப்பாய்வை இயக்கவும்.",
  restore: "மீட்டமை",
  restored: "பகுப்பாய்வு மீட்டமைக்கப்பட்டது",

  legendLow: "குறைந்த ஆபத்து",
  legendMedium: "நடுத்தர ஆபத்து",
  legendHigh: "அதிக ஆபத்து",

  openDashboard: "டாஷ்போர்டை திற",
  homeDescription: "நிகழ்நேர வெள்ள ஆபத்து பகுப்பாய்வு, வள ஒதுக்கீடு மற்றும் தங்குமிட பரிந்துரைகளுக்கான AI-இயக்கப்படும் பேரிடர் மேலாண்மை தளம்.",
  sdgAlignment: "SDG 13 & 11",
  offlineCapable: "ஆஃப்லைன் திறன்",
  aiPowered: "AI-இயக்கம்",
}

// ---------- Hindi ----------
const hi: TranslationDict = {
  appName: "ResQAI",
  tagline: "आपदा प्रतिक्रिया AI डैशबोर्ड",
  lastAnalyzed: "अंतिम विश्लेषण",
  online: "ऑनलाइन",
  offline: "ऑफ़लाइन",
  offlineBanner: "आप ऑफ़लाइन मोड में हैं। स्थानीय कैश से डेटा दिखाया जा रहा है।",

  analysisParameters: "विश्लेषण मापदंड",
  areaZone: "क्षेत्र / ज़ोन",
  selectZone: "ज़ोन चुनें",
  rainfall: "वर्षा (मि.मी.)",
  elevation: "ऊँचाई (मी.)",
  population: "जनसंख्या",
  coastalDist: "तटीय दूरी (कि.मी.)",
  disasterIntensity: "आपदा तीव्रता",
  whatIfHint: "जोखिम अनुमानों की पुनर्गणना के लिए वर्षा या आपदा की गंभीरता बढ़ाएं।",
  analyzeRisk: "जोखिम विश्लेषण",
  analyzing: "विश्लेषण हो रहा है...",

  riskScore: "जोखिम स्कोर",
  riskLevel: "जोखिम स्तर",
  aiConfidence: "AI विश्वसनीयता",

  low: "कम",
  medium: "मध्यम",
  high: "उच्च",

  riskVisByZone: "ज़ोन के अनुसार जोखिम विज़ुअलाइज़ेशन",
  riskHeatmap: "जोखिम हीटमैप",
  heatmapSubtitle: "रंग की तीव्रता ज़ोन में बाढ़ जोखिम की गंभीरता दर्शाती है",

  resourceAllocation: "संसाधन आवंटन",
  resourceType: "संसाधन प्रकार",
  quantity: "मात्रा",
  status: "स्थिति",
  rescueBoats: "बचाव नावें",
  ambulances: "एम्बुलेंस",
  foodKits: "खाद्य किट",
  medicalTeams: "चिकित्सा दल",
  emergencyShelters: "आपातकालीन आश्रय",
  waterTankers: "पानी के टैंकर",
  deployed: "तैनात",
  enRoute: "रास्ते में",
  standby: "तैयार",

  shelterRecommendation: "आश्रय अनुशंसा",
  capacity: "क्षमता",
  safe: "सुरक्षित",
  atRisk: "खतरे में",

  alertsNotifications: "चेतावनी और सूचनाएं",
  sendAlertToField: "क्षेत्र टीमों को चेतावनी भेजें",
  noActiveAlerts: "कोई सक्रिय चेतावनी नहीं",
  alertDispatched: "सभी क्षेत्र टीमों को चेतावनी भेजी गई।",

  analysisHistory: "विश्लेषण इतिहास",
  noHistory: "अभी तक कोई विश्लेषण इतिहास नहीं। शुरू करने के लिए विश्लेषण चलाएं।",
  restore: "पुनर्स्थापित",
  restored: "विश्लेषण पुनर्स्थापित किया गया",

  legendLow: "कम जोखिम",
  legendMedium: "मध्यम जोखिम",
  legendHigh: "उच्च जोखिम",

  openDashboard: "डैशबोर्ड खोलें",
  homeDescription: "वास्तविक समय बाढ़ जोखिम विश्लेषण, संसाधन आवंटन और आश्रय अनुशंसाओं के लिए AI-संचालित आपदा प्रबंधन मंच।",
  sdgAlignment: "SDG 13 और 11",
  offlineCapable: "ऑफ़लाइन-सक्षम",
  aiPowered: "AI-संचालित",
}

// ---------- Dictionary map ----------
const translations: Record<Language, TranslationDict> = { en, ta, hi }

// ---------- Context ----------
interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationDict
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}

// ---------- Translate risk level ----------
export function translateRiskLevel(level: "Low" | "Medium" | "High", t: TranslationDict): string {
  const map: Record<string, string> = { Low: t.low, Medium: t.medium, High: t.high }
  return map[level] ?? level
}

// ---------- Translate resource type ----------
export function translateResourceType(type: string, t: TranslationDict): string {
  const map: Record<string, string> = {
    "Rescue Boats": t.rescueBoats,
    "Ambulances": t.ambulances,
    "Food Kits": t.foodKits,
    "Medical Teams": t.medicalTeams,
    "Emergency Shelters": t.emergencyShelters,
    "Water Tankers": t.waterTankers,
  }
  return map[type] ?? type
}

// ---------- Translate status ----------
export function translateStatus(status: string, t: TranslationDict): string {
  const map: Record<string, string> = {
    "Deployed": t.deployed,
    "En Route": t.enRoute,
    "Standby": t.standby,
  }
  return map[status] ?? status
}

// ---------- Translate safety status ----------
export function translateSafety(status: string, t: TranslationDict): string {
  const map: Record<string, string> = {
    "Safe": t.safe,
    "At Risk": t.atRisk,
  }
  return map[status] ?? status
}
