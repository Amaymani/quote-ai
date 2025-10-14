import { NextResponse } from 'next/server';
import dbConnect from '@/config/mongo';
import { Inventory } from '@/lib/models/inventory';

export async function GET() {
  await dbConnect();
  const items = await Inventory.find({});
  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  console.log("POST body:", body);

  const { name, unit, unit_cost, quantity } = body;

  if (!name || !unit)
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });

  const newItem = await Inventory.create({ name, unit, unit_cost, quantity });
  return NextResponse.json({ success: true, data: newItem });
}

export async function PATCH(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { _id, quantity } = body;

  if (!_id)
    return NextResponse.json({ success: false, message: "Missing _id" }, { status: 400 });

  const updated = await Inventory.findByIdAndUpdate(_id, { quantity }, { new: true });
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  const deleted = await Inventory.findByIdAndDelete(id);

  if (!deleted)
    return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });

  return NextResponse.json({ success: true, message: "Item deleted successfully" });
}
