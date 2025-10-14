import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  unit: string;
  unit_cost: number;
  quantity: number;
}

const InventorySchema = new Schema<IInventory>({
  name: { type: String, required: true },
  unit: { type: String, required: true },
  unit_cost: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

export const Inventory: Model<IInventory> =
  mongoose.models.Inventory || mongoose.model<IInventory>('Inventory', InventorySchema);
