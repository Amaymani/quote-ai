import Quote from "@/lib/models/quotes";
import dbConnect from "@/config/mongo";
import { NextResponse, type NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("quote_id");
    const itemIndexStr = searchParams.get("item_index");
    const itemIndex =  Number(itemIndexStr);
    console.log("Deleting item at index:", itemIndex, "from quote ID:", quoteId, isNaN(itemIndex));
    if (!quoteId || itemIndex === null || isNaN(itemIndex)) {
      return NextResponse.json(
        { error: "Quote ID and valid item index are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const unsetUpdate = await Quote.updateOne(
      { _id: quoteId },
      { $unset: { [`ai_response.estimated_items.${itemIndex}`]: 1 } }
    );

    if (unsetUpdate.modifiedCount === 0) {
        return NextResponse.json({ error: "Quote not found or item index is out of bounds." }, { status: 404 });
    }
    const pullUpdate = await Quote.updateOne(
        { _id: quoteId },
        { $pull: { "ai_response.estimated_items": null } }
    );
    const updatedQuote = await Quote.findById(quoteId);

    return NextResponse.json(
      { updatedQuote: updatedQuote },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting quote item:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}