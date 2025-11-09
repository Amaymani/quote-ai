export interface EstimatedItem {
  id: string;
  item: string;
  quantity: number;
  unit_price_usd: number;
  total_price_usd: number;
  description?: string;
  unit?: string; // keep it optional if that's accurate
}

export interface AIResponse {
  estimated_items: EstimatedItem[];
}

export interface Quote {
  _id: string;
  client_name: string;
  project_title: string;
  project_type: string;
  project_description: string;
  estimated_area: number;
  ai_response: AIResponse;
  createdAt: string;
}
