// components/pdf/QuotePDFDocument.tsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Define the shape of the quote data this component expects
interface EstimatedItem {
  item: string;
  quantity: number;
  unit?: string;
  description?: string;
  unit_price_usd: number;
  total_price_usd: number;
}
interface Quote {
  _id: string;
  client_name: string;
  project_title: string;
  project_type: string;
  project_description: string;
  estimated_area: number;
  ai_response?: {
    estimated_items: EstimatedItem[];
  };
  createdAt: string;
}

// NOTE: @react-pdf/renderer uses a CSS-in-JS approach.
// You define styles here, not with Tailwind classes.
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 60, // Space for the footer
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#888888',
  },
  value: {
    fontSize: 11,
  },
  description: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  table: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    alignItems: 'center',
    minHeight: 24,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontFamily: 'Helvetica-Bold',
  },
  colItem: { width: '40%', padding: 6 },
  colQty: { width: '15%', padding: 6, textAlign: 'right' },
  colPrice: { width: '22.5%', padding: 6, textAlign: 'right' },
  colTotal: { width: '22.5%', padding: 6, textAlign: 'right' },
  tableFooter: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#333333',
    marginTop: 5,
  },
  totalLabel: {
    width: '77.5%',
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  totalValue: {
    width: '22.5%',
    padding: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

// This is the component that defines the entire PDF structure
export const QuotePDFDocument = ({ quote }: { quote: Quote }) => {
  const totalCost = (quote.ai_response?.estimated_items ?? []).reduce(
    (acc, item) => acc + (item.total_price_usd ?? 0),
    0
  );

  return (
    <Document author="Your Company Name" title={`Quotation - ${quote.project_title}`}>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{quote.project_title}</Text>
          <Text style={styles.subtitle}>Quotation for: {quote.client_name}</Text>
        </View>

        {/* Project Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Summary</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}><Text style={styles.label}>Project Type</Text><Text style={styles.value}>{quote.project_type}</Text></View>
            <View style={styles.infoItem}><Text style={styles.label}>Estimated Area</Text><Text style={styles.value}>{`${(quote.estimated_area ?? 0).toLocaleString('en-IN')} sq ft`}</Text></View>
            <View style={styles.infoItem}><Text style={styles.label}>Quote ID</Text><Text style={styles.value}>{quote._id}</Text></View>
            <View style={styles.infoItem}><Text style={styles.label}>Date Created</Text><Text style={styles.value}>{format(new Date(quote.createdAt), "MMMM d, yyyy")}</Text></View>
          </View>
        </View>
        
        {/* Description Section */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Description</Text>
            <Text style={styles.description}>{quote.project_description}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cost Breakdown</Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]} fixed>
                    <Text style={styles.colItem}>Item Description</Text>
                    <Text style={styles.colQty}>Qty</Text>
                    <Text style={styles.colPrice}>Unit Price</Text>
                    <Text style={styles.colTotal}>Total</Text>
                </View>
                {/* Table Rows */}
                {(quote.ai_response?.estimated_items ?? []).map((item, index) => (
                    <View key={item.id || index} style={styles.tableRow} wrap={false}>
                        <Text style={styles.colItem}>{item.item}</Text>
                        <Text style={styles.colQty}>{`${item.quantity} ${item.unit || ''}`}</Text>
                        <Text style={styles.colPrice}>${(item.unit_price_usd ?? 0).toLocaleString()}</Text>
                        <Text style={styles.colTotal}>${(item.total_price_usd ?? 0).toLocaleString()}</Text>
                    </View>
                ))}
                {/* Table Footer */}
                <View style={styles.tableFooter}>
                    <Text style={styles.totalLabel}>Total Estimated Cost</Text>
                    <Text style={styles.totalValue}>${totalCost.toLocaleString()}</Text>
                </View>
            </View>
        </View>

        {/* Page numbers */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};