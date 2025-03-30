
import { useState, useEffect } from "react";
import { StockAlert } from "../../types";
import { getAlerts, updateAlertStatus } from "../../services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AlertsList = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  
  useEffect(() => {
    // Ladda varningar från vår service
    setAlerts(getAlerts());
    
    // Uppdatera när det kommer nya varningar
    const intervalId = setInterval(() => {
      setAlerts(getAlerts());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Hjälpfunktion för att formatera datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  // Hantera klick på knapparna
  const handleStatusUpdate = (alertId: string, status: 'acknowledged' | 'resolved') => {
    updateAlertStatus(alertId, status);
    // Uppdatera listan
    setAlerts(getAlerts());
  };
  
  // Returnera meddelande om det inte finns några varningar
  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-success" /> Inga varningar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Alla produkter har tillräckligt lager.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Sortera varningar: nya först, sedan bekräftade, sedan lösta
  const sortedAlerts = [...alerts].sort((a, b) => {
    const statusPriority: Record<string, number> = {
      new: 0,
      acknowledged: 1,
      resolved: 2,
    };
    
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Om samma status, sortera efter datum (nyaste först)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5 text-destructive" /> Lagervarningar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 border rounded-lg ${
                alert.status === 'new' 
                  ? 'bg-destructive/10 border-destructive/50' 
                  : alert.status === 'acknowledged' 
                    ? 'bg-warning/10 border-warning/50' 
                    : 'bg-muted border-muted-foreground/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{alert.productName}</h3>
                <Badge variant={
                  alert.status === 'new' 
                    ? 'destructive' 
                    : alert.status === 'acknowledged' 
                      ? 'default' 
                      : 'outline'
                }>
                  {alert.status === 'new' ? 'Ny' : alert.status === 'acknowledged' ? 'Bekräftad' : 'Löst'}
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mb-3">
                <p>Lager: <span className="font-medium">{alert.currentStock} st</span> (minimum: {alert.minStock} st)</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(alert.timestamp)}</span>
                </div>
              </div>
              
              {alert.status !== 'resolved' && (
                <div className="flex space-x-2 mt-2">
                  {alert.status === 'new' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleStatusUpdate(alert.id, 'acknowledged')}
                    >
                      Bekräfta
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    variant={alert.status === 'new' ? 'default' : 'outline'}
                    onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                  >
                    Markera som löst
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsList;
