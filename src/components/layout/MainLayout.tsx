
import { Link, Outlet } from "react-router-dom";
import { Database, PackageOpen, AlertTriangle, BarChart3 } from "lucide-react";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-primary">Lagersystem</h2>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Link
                to="/"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <BarChart3 className="w-5 h-5 mr-3 text-primary" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <PackageOpen className="w-5 h-5 mr-3 text-primary" />
                Produkter
              </Link>
            </li>
            <li>
              <Link
                to="/alerts"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <AlertTriangle className="w-5 h-5 mr-3 text-primary" />
                Varningar
              </Link>
            </li>
            <li>
              <Link
                to="/database"
                className="flex items-center p-3 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Database className="w-5 h-5 mr-3 text-primary" />
                Databas
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
