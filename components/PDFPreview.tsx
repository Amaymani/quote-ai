"use client";

import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { QuotePDFDocument } from "@/components/QuotePDFDocument";

// ✅ Import shared types
import type { Quote } from "@/types/quote";

interface PDFPreviewProps {
  quote: Quote;
  totalCost: number;
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ quote, totalCost }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient && quote && (
        <PDFDownloadLink
          // ✅ Pass totalCost if your QuotePDFDocument expects it
          document={<QuotePDFDocument quote={quote} totalCost={totalCost} />}
          fileName={`Quotation-${quote._id}.pdf`}
        >
          {({ loading: pdfLoading }) => (
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
