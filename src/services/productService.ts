
import { Product, StockAlert } from "../types";
import { toast } from "sonner";

// Simulerad produktdata
const initialProducts: Product[] = [
  {
    id: "1",
    name: "Produkt A",
    sku: "PROD-001",
    currentStock: 15,
    minStock: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Produkt B",
    sku: "PROD-002",
    currentStock: 8,
    minStock: 10,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Produkt C",
    sku: "PROD-003",
    currentStock: 25,
    minStock: 15,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Produkt D",
    sku: "PROD-004",
    currentStock: 5,
    minStock: 20,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Produkt E",
    sku: "PROD-005",
    currentStock: 30,
    minStock: 10,
    lastUpdated: new Date().toISOString(),
  },
];

// Använd localStorage för att spara data
const PRODUCTS_KEY = "inventory_products";
const ALERTS_KEY = "inventory_alerts";

// Hjälpfunktion för att ladda produkter från localStorage
const loadProducts = (): Product[] => {
  const storedProducts = localStorage.getItem(PRODUCTS_KEY);
  if (storedProducts) {
    return JSON.parse(storedProducts);
  }
  // Spara initial data om inget finns
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  return initialProducts;
};

// Hjälpfunktion för att ladda varningar från localStorage
const loadAlerts = (): StockAlert[] => {
  const storedAlerts = localStorage.getItem(ALERTS_KEY);
  if (storedAlerts) {
    return JSON.parse(storedAlerts);
  }
  return [];
};

// Exporterade funktioner för att hantera produkter
export const getProducts = (): Product[] => {
  return loadProducts();
};

export const getProduct = (id: string): Product | undefined => {
  const products = loadProducts();
  return products.find((product) => product.id === id);
};

export const updateProduct = (updatedProduct: Product): void => {
  const products = loadProducts();
  const index = products.findIndex((p) => p.id === updatedProduct.id);
  
  if (index !== -1) {
    products[index] = {
      ...updatedProduct,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }
};

export const addProduct = (product: Omit<Product, "id" | "lastUpdated">): void => {
  const products = loadProducts();
  const newProduct: Product = {
    ...product,
    id: Math.random().toString(36).substring(2, 9),
    lastUpdated: new Date().toISOString(),
  };
  
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  toast.success(`Produkt ${newProduct.name} har lagts till`);
};

export const deleteProduct = (id: string): void => {
  const products = loadProducts();
  const filteredProducts = products.filter((product) => product.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filteredProducts));
  
  // Ta även bort relaterade varningar
  const alerts = loadAlerts();
  const filteredAlerts = alerts.filter((alert) => alert.productId !== id);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(filteredAlerts));
};

// Exporterade funktioner för att hantera varningar
export const getAlerts = (): StockAlert[] => {
  return loadAlerts();
};

export const addAlert = (productId: string): void => {
  const product = getProduct(productId);
  if (!product) return;
  
  const alerts = loadAlerts();
  
  // Kontrollera om det redan finns en aktiv varning för denna produkt
  const existingAlertIndex = alerts.findIndex(
    (a) => a.productId === productId && a.status !== 'resolved'
  );
  
  if (existingAlertIndex !== -1) {
    // Uppdatera bara den befintliga varningen
    alerts[existingAlertIndex].currentStock = product.currentStock;
    alerts[existingAlertIndex].timestamp = new Date().toISOString();
  } else {
    // Skapa en ny varning
    const newAlert: StockAlert = {
      id: Math.random().toString(36).substring(2, 9),
      productId,
      productName: product.name,
      currentStock: product.currentStock,
      minStock: product.minStock,
      timestamp: new Date().toISOString(),
      status: 'new',
    };
    
    alerts.push(newAlert);
    
    // Visa en toast-notifikation för nya varningar
    toast.error(`Varning: ${product.name} har lågt lager (${product.currentStock}/${product.minStock})`, {
      duration: 5000,
    });
  }
  
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
};

export const updateAlertStatus = (alertId: string, status: 'acknowledged' | 'resolved'): void => {
  const alerts = loadAlerts();
  const index = alerts.findIndex((a) => a.id === alertId);
  
  if (index !== -1) {
    alerts[index].status = status;
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  }
};

// Funktion för att köra lagerkontrollen (som körs var 5:e minut)
export const checkStockLevels = (): void => {
  const products = loadProducts();
  let lowStockCount = 0;
  
  products.forEach((product) => {
    if (product.currentStock < product.minStock) {
      addAlert(product.id);
      lowStockCount++;
    }
  });
  
  // Uppdatera produkternas lastUpdated
  const updatedProducts = products.map((product) => ({
    ...product,
    lastUpdated: new Date().toISOString(),
  }));
  
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  
  if (lowStockCount === 0) {
    console.log("Lagerkontroll genomförd: Alla produkter har tillräckligt lager");
  } else {
    console.log(`Lagerkontroll genomförd: ${lowStockCount} produkter har lågt lager`);
  }
};
