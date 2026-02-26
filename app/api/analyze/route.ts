import { NextResponse } from "next/server"
import { analyzeRisk } from "@/lib/analysis-engine"
import type { InputData } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InputData

    // Validate required fields
    if (!body.area || body.rainfall == null || body.elevation == null) {
      return NextResponse.json(
        { error: "Missing required input fields" },
        { status: 400 }
      )
    }

    // Simulate slight processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 600))

    const result = analyzeRisk(body)

    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: "Failed to analyze risk data" },
      { status: 500 }
    )
  }
}
