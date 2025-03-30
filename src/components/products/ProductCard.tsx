
import { Product } from "../../types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, name, sku, currentStock, minStock } = product;
  
  // Bestäm status baserat på lager
  let statusClass = "status-good";
  if (currentStock < minStock * 0.5) {
    statusClass = "status-low";
  } else if (currentStock < minStock) {
    statusClass = "status-medium";
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{name}</CardTitle>
          <div className={`status-badge ${statusClass}`}>
            {currentStock} st
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{sku}</p>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center">
          <Package className="mr-2 h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            Min nivå: <span className="font-medium">{minStock} st</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                currentStock < minStock * 0.5 
                  ? "bg-destructive" 
                  : currentStock < minStock 
                    ? "bg-warning" 
                    : "bg-success"
              }`}
              style={{ width: `${Math.min((currentStock / (minStock * 2)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/products/${id}`} className="w-full">
          <Button variant="outline" className="w-full">Visa detaljer</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
