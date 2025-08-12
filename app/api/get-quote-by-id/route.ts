import Quote from "@/lib/models/quotes";
import dbConnect from "@/config/mongo";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quote_id");

    if (!quoteId) {
      return NextResponse.json(
        { error: "Quote ID is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const quote = await Quote.findOne({ _id: quoteId });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { quote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching quote by ID:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}