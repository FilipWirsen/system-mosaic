
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { deleteProduct, getProduct } from "../services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Edit, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ReturnType<typeof getProduct>>(null);
  
  useEffect(() => {
    if (id) {
      const productData = getProduct(id);
      if (productData) {
        setProduct(productData);
      } else {
        toast.error("Produkt hittades inte");
        navigate("/products");
      }
    }
  }, [id, navigate]);
  
  const handleDelete = () => {
    if (id) {
      deleteProduct(id);
      toast.success("Produkten har tagits bort");
      navigate("/products");
    }
  };
  
  if (!product) {
    return <div>Laddar...</div>;
  }
  
  // Bestäm status baserat på lager
  let stockStatus = "Bra";
  let statusClass = "status-good";
  
  if (product.currentStock < product.minStock * 0.5) {
    stockStatus = "Kritiskt lågt";
    statusClass = "status-low";
  } else if (product.currentStock < product.minStock) {
    stockStatus = "Lågt";
    statusClass = "status-medium";
  }
  
  // Formatera datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/products")} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till produkter
      </Button>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{product.name}</CardTitle>
                <CardDescription>Artikelnummer: {product.sku}</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Link to={`/products/edit/${product.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" /> Redigera
                  </Button>
                </Link>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Ta bort
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Detta kommer att permanent ta bort produkten "{product.name}". 
                        Denna åtgärd kan inte ångras.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Avbryt</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Ta bort
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Lagerinformation</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Aktuellt lagersaldo</span>
                      <span className={`status-badge ${statusClass}`}>
                        {product.currentStock} st
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium">Miniminivå</span>
                      <span>{product.minStock} st</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Status</span>
                        <span>{stockStatus}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            product.currentStock < product.minStock * 0.5 
                              ? "bg-destructive" 
                              : product.currentStock < product.minStock 
                                ? "bg-warning" 
                                : "bg-success"
                          }`}
                          style={{ width: `${Math.min((product.currentStock / (product.minStock * 2)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Senast uppdaterad</h3>
                  <p>{formatDate(product.lastUpdated)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto text-primary/50 mb-4" />
                  <h3 className="text-lg font-medium mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Detta är en visualisering av produkten i systemet. I en fullständig 
                    implementation kan en produktbild visas här.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetail;
