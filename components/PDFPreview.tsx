"use client";
import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuotePDFDocument } from "@/components/QuotePDFDocument";

interface EstimatedItem {
  item: string;
  quantity: number;
  unit: string;
  description: string;
  unit_price_usd: number;
  total_price_usd: number;
}

interface Quote {
  _id: string;
  ai_response: {
    estimated_items: EstimatedItem[];
  };
}

const PDFPreview: React.FC<{ quote: Quote; totalCost: number }> = ({
  quote,
  totalCost,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>

      {isClient && quote && (
        <PDFDownloadLink
          document={<QuotePDFDocument quote={quote} />}
          fileName={`Quotation-${quote._id}.pdf`}
        >
          {({ blob, url, loading: pdfLoading, error }) => (
            <button
              disabled={pdfLoading}
              className="flex items-center justify-center w-full px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition-colors hover:text-primary disabled:bg-indigo-300"
            >
              <Download className="w-5 h-5 mr-2" />
              {pdfLoading ? "Generating PDF..." : "Download PDF"}
            </button>
          )}
        </PDFDownloadLink>
      )}
    </div>
  );
};

export default PDFPreview;
