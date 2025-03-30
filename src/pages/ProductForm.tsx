
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addProduct, getProduct, updateProduct } from "../services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = id !== "new";
  
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    currentStock: 0,
    minStock: 0,
  });
  
  const [errors, setErrors] = useState({
    name: "",
    sku: "",
    currentStock: "",
    minStock: "",
  });
  
  useEffect(() => {
    if (isEditing) {
      const product = getProduct(id!);
      if (product) {
        setFormData({
          name: product.name,
          sku: product.sku,
          currentStock: product.currentStock,
          minStock: product.minStock,
        });
      } else {
        toast.error("Produkt hittades inte");
        navigate("/products");
      }
    }
  }, [id, isEditing, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "currentStock" || name === "minStock" ? Number(value) : value,
    });
    
    // Rensa fel när användaren börjar skriva
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {
      name: "",
      sku: "",
      currentStock: "",
      minStock: "",
    };
    
    let isValid = true;
    
    if (!formData.name.trim()) {
      newErrors.name = "Produktnamn krävs";
      isValid = false;
    }
    
    if (!formData.sku.trim()) {
      newErrors.sku = "Artikelnummer krävs";
      isValid = false;
    }
    
    if (formData.currentStock < 0) {
      newErrors.currentStock = "Lagersaldo kan inte vara mindre än 0";
      isValid = false;
    }
    
    if (formData.minStock < 0) {
      newErrors.minStock = "Miniminivå kan inte vara mindre än 0";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      const product = getProduct(id!);
      if (product) {
        updateProduct({
          ...product,
          ...formData,
        });
        toast.success("Produkten har uppdaterats");
      }
    } else {
      addProduct(formData);
      toast.success("Produkten har lagts till");
    }
    
    navigate("/products");
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/products")} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Tillbaka till produkter
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Redigera produkt" : "Lägg till ny produkt"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Uppdatera information och lagernivåer för denna produkt" 
              : "Fyll i information för att lägga till en ny produkt i systemet"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Produktnamn</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">Artikelnummer</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className={errors.sku ? "border-destructive" : ""}
              />
              {errors.sku && (
                <p className="text-destructive text-sm">{errors.sku}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Aktuellt lagersaldo</Label>
                <Input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={handleChange}
                  className={errors.currentStock ? "border-destructive" : ""}
                />
                {errors.currentStock && (
                  <p className="text-destructive text-sm">{errors.currentStock}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minStock">Miniminivå</Label>
                <Input
                  id="minStock"
                  name="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={handleChange}
                  className={errors.minStock ? "border-destructive" : ""}
                />
                {errors.minStock && (
                  <p className="text-destructive text-sm">{errors.minStock}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? "Spara ändringar" : "Skapa produkt"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProductForm;
