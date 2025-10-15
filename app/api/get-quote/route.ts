import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, type NextRequest } from "next/server";
import { laborRates } from "@/lib/defaults";
import dbConnect from "@/config/mongo";
import Quote from "@/lib/models/quotes";
import User from "@/lib/models/user";
import {Inventory} from "@/lib/models/inventory";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Environment is not laoding at server.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3,
  },
});

export async function POST(request: NextRequest) {
  try {
    const {
      client_name,
      project_title,
      project_type,
      project_description,
      estimated_area,
      user_email
    } = await request.json();

    if (!user_email){
      return NextResponse.json(
        { error: "Session email cant be fetched." },
        { status: 400 }
      );
    }

    if (
      !client_name ||
      !project_title ||
      !project_type ||
      !project_description ||
      !estimated_area
    ) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: user_email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    const materialInventory = await Inventory.find({}, { name: 1, unit: 1, unit_cost: 1, _id:0 }).lean();
    if (materialInventory.length === 0) {
      return NextResponse.json(
        { error: "No inventory items found. Please add items to inventory first." },
        { status: 404 }
      );
    }

    console.log("Material Inventory:", materialInventory);

    const prompt = `You are a construction specialist. You have to prepare the estimated list of items which is needed to complete the construction. Include the approximate labour charges too. Your given data would be used to create the quotation. Give your response only in JSON format without any formatting or extra text.

    Use the following guidelines:
1. Use only the materials from the inventory list which are relevant to the project type and description.
2. Calculate the quantity of each material based on the estimated area and project description.

Project Information:
Client Name: "${client_name}"
Project Title: "${project_title}"
Project Type: "${project_type}"
Estimated Area in sq ft: "${estimated_area}"
Project Description: "${project_description}"

The inventory is as follow:
Materials(Use only those what is needed for the project):
${JSON.stringify(materialInventory)}

Labor Rates:
${JSON.stringify(laborRates)}



Expected response (Dont include anything else except estimated_items):
{"estimated_items": [
{
"item": string,
"id": "mat-006",
"description": (string and keep it short, only include the calculation part),
"unit": "sq ft",
"quantity": number,
"unit_price_usd": number,
"total_price_usd": number
  }]}`;

  const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    let jsonData;
  
    try {
        jsonData = JSON.parse(text);
    } catch(parseError) {
        console.error("Error parsing JSON from Gemini:", text);
        throw new Error("AI returned an invalid response format.");
    }

    const newQuote = new Quote({
      client_name,
      project_title,
      project_type,
      project_description,
      estimated_area,
      ai_response: jsonData, 
      user_email: user_email,
    });
    

    await newQuote.save();
    user.quotes.push(newQuote._id as typeof user.quotes[0]);
    await user.save();

    console.log("Quote saved successfully with ID:", newQuote._id);

    return NextResponse.json({quote_id:newQuote._id}, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/quote:", error);

    return NextResponse.json(
      {
        error: "An internal server error occurred while generating the quote.",
      },
      { status: 500 }
    );
  }
}