"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

interface InventoryItem {
  _id?: string;
  name: string;
  unit: string;
  unit_cost: number;
  quantity: number;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<InventoryItem>({
    name: "",
    unit: "",
    unit_cost: 0,
    quantity: 1,
  });
  const [showForm, setShowForm] = useState(false);

  const fetchInventory = async () => {
    try {
      const res = await axios.get("/api/inventory");
      setItems(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const updateQuantity = async (item: InventoryItem, newQty: number) => {
    const qty = Math.max(0, newQty);
    try {
      const res = await axios.patch("/api/inventory", { _id: item._id, quantity: qty });
      setItems(items.map((i) => (i._id === item._id ? res.data.data : i)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId?: string) => {
    if (!itemId) return;
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`/api/inventory?id=${itemId}`);
      setItems(items.filter((i) => i._id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.unit) {
      alert("Please fill in all required fields!");
      return;
    }
    try {
      const res = await axios.post("/api/inventory", newItem);
      setItems([...items, res.data.data]);
      setNewItem({ name: "", unit: "", unit_cost: 0, quantity: 1 });
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-600">Loading inventory...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Inventory</h1>

      {/* Toggle Add Form Button */}
      <div className="flex justify-center mb-6">
        <button
          className={`${
            showForm ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          } text-white px-5 py-2 rounded-lg font-medium transition`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Item"}
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Name"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Unit (e.g., pcs, kg)"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
            />
            <input
              type="number"
              placeholder="Unit Cost"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newItem.unit_cost}
              onChange={(e) =>
                setNewItem({ ...newItem, unit_cost: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Quantity"
              className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
              value={newItem.quantity}
              min={1}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition font-medium"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse shadow-lg rounded-xl overflow-hidden bg-white">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Name</th>
              <th className="text-left px-6 py-3 text-gray-700 font-semibold">Unit</th>
              <th className="text-right px-6 py-3 text-gray-700 font-semibold">Cost</th>
              <th className="text-center px-6 py-3 text-gray-700 font-semibold">Quantity</th>
              <th className="text-center px-6 py-3 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition border-b last:border-none"
              >
                <td className="px-6 py-3 text-gray-800">{item.name}</td>
                <td className="px-6 py-3 text-gray-600">{item.unit}</td>
                <td className="px-6 py-3 text-right text-gray-700">
                  ${item.unit_cost.toFixed(2)}
                </td>
                <td className="px-6 py-3 text-center">
                  <input
                    type="number"
                    className="w-24 text-center border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={item.quantity}
                    min={0}
                    onChange={(e) => updateQuantity(item, parseInt(e.target.value))}
                  />
                </td>
                <td className="px-6 py-3 text-center">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-gray-500 hover:text-red-600 transition"
                    title="Delete item"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="text-center text-gray-500 py-6 italic">No items in inventory.</p>
        )}
      </div>
    </div>
  );
}
