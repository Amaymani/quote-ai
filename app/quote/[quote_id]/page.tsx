"use client";

import axios from "axios";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Building2,
  LandPlot,
  Calendar,
  FileText,
  Download,
  Share2,
  Sparkles,
  Trash,
  PlusCircle,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import PDFPreview from "@/components/PDFPreview";

// ✅ import shared types
import type { Quote, EstimatedItem } from "@/types/quote";

type UnwrappedParams = {
  quote_id: string;
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-start">
    <Icon className="w-5 h-5 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {value}
      </p>
    </div>
  </div>
);

const Page = ({ params }: { params: Promise<UnwrappedParams> }) => {
  const { data: session, status } = useSession();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const unwrappedParams = use(params);
  const { quote_id } = unwrappedParams;
  const router = useRouter();

  const [newItem, setNewItem] = useState<EstimatedItem>({
    id: "",
    item: "",
    quantity: 0,
    unit_price_usd: 0,
    total_price_usd: 0,
    description: "",
    unit: "",
  });

  useEffect(() => {
    const fetchQuote = async () => {
      if (!session?.user?.email) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get("/api/get-quote-by-id", {
          params: { quote_id: quote_id, user_email: session.user.email },
        });
        setQuote(res.data.quote);
        console.log("Fetched quote:", res.data.quote);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
        setError("We couldn't load the quote. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") fetchQuote();
  }, [session, status, quote_id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!quote)
    return (
      <div className="text-center text-gray-500 p-12">Quote not found.</div>
    );

  const totalCost = (quote.ai_response?.estimated_items ?? []).reduce(
    (acc, item) => acc + (item.total_price_usd ?? 0),
    0
  );

  const deleteItem = async (quoteId: string, index: number) => {
    if (!session?.user?.email) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.delete("/api/delete-quote-item", {
        params: {
          quote_id: quoteId,
          item_index: index,
          user_email: session.user.email,
        },
      });
      console.log("Item deleted successfully:", res.data);
      setQuote(res.data.updatedQuote);
    } catch (err) {
      console.error("Failed to delete item:", err);
      setError("We couldn't delete the item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user?.email || !quote) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post("/api/add-quote-item", {
        quote_id: quote._id,
        new_item: newItem,
        user_email: session.user.email,
      });
      if (res.status === 200) {
        console.log("Item added successfully:", res.data);
        setQuote(res.data.quote);
        setNewItem({
          id: "",
          item: "",
          quantity: 0,
          unit_price_usd: 0,
          total_price_usd: 0,
          description: "",
          unit: "",
        });
      }
    } catch (err) {
      console.error("Failed to add item:", err);
      setError("We couldn't add the item. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            Quote Details
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {quote.project_title}
          </h1>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
            Quote ID:{" "}
            <span className="font-mono text-sm bg-gray-200 dark:bg-gray-700 p-1 rounded-md">
              {quote._id}
            </span>
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Project Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <InfoItem icon={User} label="Client Name" value={quote.client_name} />
                <InfoItem icon={Building2} label="Project Type" value={quote.project_type} />
                <InfoItem
                  icon={LandPlot}
                  label="Estimated Area"
                  value={`${quote.estimated_area.toLocaleString("en-IN")} sq ft`}
                />
                <InfoItem
                  icon={Calendar}
                  label="Date Created"
                  value={format(new Date(quote.createdAt), "MMMM d, yyyy")}
                />
              </div>
              <div className="mt-8">
                <InfoItem
                  icon={FileText}
                  label="Project Description"
                  value={quote.project_description}
                />
              </div>
            </div>

            {/* AI Breakdown */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-6">
                <Sparkles className="w-7 h-7 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Generated Breakdown
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-4 text-gray-700 dark:text-gray-200">Item</th>
                      <th className="p-4 text-gray-700 dark:text-gray-200 text-right">Quantity</th>
                      <th className="p-4 text-gray-700 dark:text-gray-200 text-right">Price per Unit</th>
                      <th className="p-4 text-gray-700 dark:text-gray-200 text-right">Estimated Cost</th>
                      <th className="p-4 text-gray-700 dark:text-gray-200 text-right">Delete</th>
                    </tr>
                  </thead>

                  <tbody>
                    {quote.ai_response.estimated_items.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="p-4 text-gray-800 dark:text-gray-200">{item.item}</td>
                        <td className="p-4 text-right text-gray-800 dark:text-gray-200 font-mono">
                          {item.quantity} {item.unit && item.unit}
                          {item.description && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="w-4 ml-2 inline" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-sm text-gray-100 dark:text-gray-400">
                                  {item.description}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </td>
                        <td className="p-4 text-right text-gray-800 dark:text-gray-200 font-mono">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "USD",
                          }).format(item.unit_price_usd)}
                        </td>
                        <td className="p-4 text-right text-gray-800 dark:text-gray-200 font-mono">
                          {new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "USD",
                          }).format(item.total_price_usd)}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteItem(quote_id, index)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot className="font-bold">
                    <tr>
                      <td className="p-4 text-gray-900 dark:text-white">Total Estimated Cost</td>
                      <td className="p-4 text-xl text-right font-mono" colSpan={4}>
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "USD",
                        }).format(totalCost)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Add Item Dialog */}
                <AlertDialog>
                  <div className="flex justify-center m-2">
                    <AlertDialogTrigger>
                      <div className="flex bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        <PlusCircle /> &nbsp; Add an item
                      </div>
                    </AlertDialogTrigger>
                  </div>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Enter Details to Add a New Item</AlertDialogTitle>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Please provide details for the new item.
                      </div>

                      <form onSubmit={addItem} id="addItemForm" className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Item Name
                          </label>
                          <input
                            value={newItem.item}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                item: e.target.value,
                                id: crypto.randomUUID(),
                              })
                            }
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter item name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Quantity
                          </label>
                          <input
                            value={newItem.quantity}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                quantity: parseFloat(e.target.value),
                              })
                            }
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter quantity"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Price per Unit (USD)
                          </label>
                          <input
                            value={newItem.unit_price_usd}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                unit_price_usd: parseFloat(e.target.value),
                                total_price_usd:
                                  parseFloat(e.target.value) * newItem.quantity,
                              })
                            }
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter price per unit"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description (optional)
                          </label>
                          <textarea
                            value={newItem.description}
                            onChange={(e) =>
                              setNewItem({
                                ...newItem,
                                description: e.target.value,
                              })
                            }
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter item description"
                          />
                        </div>
                      </form>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction type="submit" form="addItemForm">
                        Add
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Actions
              </h3>
              <div className="flex flex-col space-y-3">
                <Dialog>
                  <DialogTrigger className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors">
                    <Download className="w-5 h-5 mr-2" />
                    Download PDF
                  </DialogTrigger>
                  <DialogContent className="w-[100vb]">
                    <DialogHeader>
                      <DialogTitle>Click below to download</DialogTitle>
                    </DialogHeader>
                    <div>
                      <PDFPreview quote={quote} totalCost={totalCost} />
                    </div>
                  </DialogContent>
                </Dialog>

                <button className="flex items-center justify-center w-full px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
