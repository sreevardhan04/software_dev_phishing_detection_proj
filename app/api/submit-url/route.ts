import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Url from "@/models/Url";

function isValidUrl(value: string): boolean {
  try {
   
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body.url !== "string") {
      return NextResponse.json(
        { success: false, message: "Request body must include a 'url' string." },
        { status: 400 }
      );
    }

    const url = body.url.trim();

    if (!url) {
      return NextResponse.json(
        { success: false, message: "URL cannot be empty." },
        { status: 400 }
      );
    }

    if (!isValidUrl(url)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid URL." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await Url.create({ url });

    return NextResponse.json(
      { success: true, message: "URL stored successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/submit-url:", errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while saving the URL.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


