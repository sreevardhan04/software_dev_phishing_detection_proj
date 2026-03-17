import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Email from "@/models/Email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, message: "Request body must include an 'email' string." },
        { status: 400 }
      );
    }

    const email = body.email.trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email content cannot be empty." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    await Email.create({ email });

    return NextResponse.json(
      { success: true, message: "Email stored successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/submit-email:", errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while saving the email.",
        error: process.env.NODE_ENV === "development" ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}