
import { useState, useEffect } from "react";
import { getAlerts, getProducts } from "../services/productService";
import AlertsList from "../components/alerts/AlertsList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

const Alerts = () => {
  const [alerts, setAlerts] = useState(getAlerts());
  const products = getProducts();
  
  useEffect(() => {
    // Uppdatera varningarna var 5e sekund
    const intervalId = setInterval(() => {
      setAlerts(getAlerts());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Filtrera aktiva och lösta varningar
  const activeAlerts = alerts.filter((alert) => alert.status !== "resolved");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "resolved");
  
  // Beräkna statistik
  const criticalProducts = products.filter(
    (product) => product.currentStock < product.minStock * 0.5
  ).length;
  
  const lowProducts = products.filter(
    (product) => 
      product.currentStock < product.minStock && 
      product.currentStock >= product.minStock * 0.5
  ).length;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Varningar</h1>
        <p className="text-muted-foreground mt-2">
          Övervaka och hantera varningar för låga lagernivåer
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva varningar</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lösta varningar</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedAlerts.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kritiskt lågt lager</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalProducts}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lågt lager</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowProducts}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold tracking-tight">Aktiva varningar</h2>
        <AlertsList />
        
        {resolvedAlerts.length > 0 && (
          <>
            <h2 className="text-xl font-semibold tracking-tight mt-8">Lösta varningar</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-success" /> Lösta varningar
                </CardTitle>
                <CardDescription>
                  Tidigare varningar som har åtgärdats
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resolvedAlerts.slice(0, 5).map((alert) => (
                    <div 
                      key={alert.id} 
                      className="p-4 border rounded-lg bg-muted/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{alert.productName}</h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lager: {alert.currentStock} st (minimum: {alert.minStock} st)
                      </p>
                    </div>
                  ))}
                  
                  {resolvedAlerts.length > 5 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Visar 5 av {resolvedAlerts.length} lösta varningar
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Alerts;
