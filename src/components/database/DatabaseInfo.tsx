
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatabaseTable } from "../../types";
import { Database } from "lucide-react";

const DatabaseInfo = () => {
  const tables: DatabaseTable[] = [
    {
      name: "products",
      description: "Lagrar alla produkter och deras lagernivåer",
      fields: [
        { name: "id", type: "string" },
        { name: "name", type: "string" },
        { name: "sku", type: "string" },
        { name: "currentStock", type: "number" },
        { name: "minStock", type: "number" },
        { name: "lastUpdated", type: "timestamp" },
      ],
    },
    {
      name: "alerts",
      description: "Lagrar varningar för låga lagernivåer",
      fields: [
        { name: "id", type: "string" },
        { name: "productId", type: "string" },
        { name: "productName", type: "string" },
        { name: "currentStock", type: "number" },
        { name: "minStock", type: "number" },
        { name: "timestamp", type: "timestamp" },
        { name: "status", type: "enum('new', 'acknowledged', 'resolved')" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="mr-2 h-5 w-5" /> Databasöversikt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Detta system använder browser localStorage som databas i demo-syfte. 
            I en produktionsmiljö skulle systemet använda en riktig databas som MySQL, PostgreSQL eller MongoDB.
          </p>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex p-4 border rounded-lg items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Databasstorlek</p>
                <p className="text-sm text-muted-foreground">
                  {(
                    (localStorage.getItem("inventory_products")?.length || 0) +
                    (localStorage.getItem("inventory_alerts")?.length || 0)
                  ) / 1024
                  } KB
                </p>
              </div>
            </div>
            
            <div className="flex p-4 border rounded-lg items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Tabeller</p>
                <p className="text-sm text-muted-foreground">{tables.length} tabeller</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {tables.map((table) => (
        <Card key={table.name}>
          <CardHeader>
            <CardTitle className="text-lg">{table.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{table.description}</p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fält</TableHead>
                  <TableHead>Typ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.fields.map((field) => (
                  <TableRow key={field.name}>
                    <TableCell className="font-medium">{field.name}</TableCell>
                    <TableCell>{field.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DatabaseInfo;
