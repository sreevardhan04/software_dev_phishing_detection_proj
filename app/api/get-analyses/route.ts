import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Analysis from "@/models/Analysis";

export async function GET() {
  try {
    await connectToDatabase();
    const analyses = await Analysis.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, analyses },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/get-analyses:", errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while fetching analyses.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
