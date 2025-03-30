
import DatabaseInfo from "../components/database/DatabaseInfo";

const Database = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Databas</h1>
        <p className="text-muted-foreground mt-2">
          Information om systemets databaslagring
        </p>
      </div>
      
      <DatabaseInfo />
    </div>
  );
};

export default Database;
