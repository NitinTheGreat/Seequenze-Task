import { type NextRequest, NextResponse } from "next/server"

// This is a simulated streaming API endpoint
export async function GET(request: NextRequest) {
  try {
    // Simulate a delay to mimic streaming data
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return some mock streaming data
    const streamingData = {
      timestamp: new Date().toISOString(),
      data: [
        { id: 1, name: "Stream 1", status: "active", viewers: 120 },
        { id: 2, name: "Stream 2", status: "active", viewers: 85 },
        { id: 3, name: "Stream 3", status: "inactive", viewers: 0 },
      ],
    }

    return NextResponse.json(streamingData)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch streaming data" }, { status: 500 })
  }
}

