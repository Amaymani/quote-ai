import Quote from "@/lib/models/quotes";
import User from "@/lib/models/user";
import dbConnect from "@/config/mongo";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { quote_id, new_item } = await request.json();

    if (!quote_id || !new_item) {
      return NextResponse.json(
        { error: "quote_id and new_item are required." },
        { status: 400 }
      );
    }

    if (
      typeof new_item.item !== "string" ||
      typeof new_item.quantity !== "number" ||
      typeof new_item.unit_price_usd !== "number" ||
      typeof new_item.total_price_usd !== "number"
    ) {
      return NextResponse.json(
        { message: "New item feild types is not valid" },
        { status: 400 }
      );
    }

    const updatedQuote = await Quote.findByIdAndUpdate(
      quote_id,
      {
        $push: { "ai_response.estimated_items": new_item },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    

    if (!updatedQuote) {
      return NextResponse.json(
        { message: "Quote not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        message: "Quote item added successfully.",
        quote: updatedQuote,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding quote item:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the quote item." },
      { status: 500 }
    );
  }
}
