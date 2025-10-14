import  "@/lib/models/quotes";
import User from "@/lib/models/user";
import dbConnect from "@/config/mongo";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("user_email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email is required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: userEmail.toLowerCase() }).populate('quotes');
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { quotes: user.quotes },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user's quotes:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}