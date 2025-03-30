
export interface Product {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  lastUpdated: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  timestamp: string;
  status: 'new' | 'acknowledged' | 'resolved';
}

export interface DatabaseTable {
  name: string;
  description: string;
  fields: { name: string; type: string }[];
}
