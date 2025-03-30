
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts, getAlerts } from "../services/productService";
import JobScheduler from "../components/system/JobScheduler";
import AlertsList from "../components/alerts/AlertsList";
import { Link } from "react-router-dom";
import { Package, AlertTriangle, Database, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const products = getProducts();
  const alerts = getAlerts().filter(alert => alert.status !== 'resolved');
  
  // Beräkna låga lager
  const lowStockProducts = products.filter(
    (product) => product.currentStock < product.minStock
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Översikt över systemet och lagerstatus
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totalt antal produkter</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {lowStockProducts.length} produkter med lågt lager
            </p>
            <Link to="/products" className="mt-3 inline-block">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                Se alla produkter
                <ArrowRightCircle className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktiva varningar</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {alerts.filter(a => a.status === 'new').length} nya varningar
            </p>
            <Link to="/alerts" className="mt-3 inline-block">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                Se alla varningar
                <ArrowRightCircle className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Databas</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Tabeller</div>
            <p className="text-xs text-muted-foreground mt-1">
              Produkter &amp; Varningar
            </p>
            <Link to="/database" className="mt-3 inline-block">
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                Se databas
                <ArrowRightCircle className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <JobScheduler />
        <AlertsList />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Systemöversikt</CardTitle>
          <CardDescription>
            Såhär fungerar vårt lagerkontrollsystem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <img 
              src="/lovable-uploads/804ad705-8aaf-4955-8a99-8cb802c93de6.png" 
              alt="System Flowchart" 
              className="max-w-full h-auto border rounded-lg shadow-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
