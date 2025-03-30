
import { useState, useEffect } from "react";
import { checkStockLevels } from "../../services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, PlayCircle, StopCircle } from "lucide-react";

const INTERVAL_MS = 5 * 60 * 1000; // 5 minuter i millisekunder
const DEMO_INTERVAL_MS = 30 * 1000; // 30 sekunder för demo

// För testning, vi kan skala ner tiden med denna faktor
const TIME_SCALE_FACTOR = 60; // 1 minut blir 1 sekund i demo

const JobScheduler = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [nextRun, setNextRun] = useState<Date | null>(null);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  
  // Funktion för att köra jobbet
  const runJob = () => {
    const now = new Date();
    checkStockLevels();
    setLastRun(now);
    setProgress(0);
    
    // Om schemaläggaren körs, beräkna nästa körning
    if (isRunning) {
      const next = new Date(now.getTime() + DEMO_INTERVAL_MS / TIME_SCALE_FACTOR);
      setNextRun(next);
    }
  };
  
  // Starta/stoppa schemaläggaren
  const toggleScheduler = () => {
    if (!isRunning) {
      setIsRunning(true);
      const now = new Date();
      const next = new Date(now.getTime() + DEMO_INTERVAL_MS / TIME_SCALE_FACTOR);
      setNextRun(next);
      runJob(); // Kör jobbet direkt när vi startar
    } else {
      setIsRunning(false);
      setNextRun(null);
    }
  };
  
  // Använd useEffect för att skapa en timer som uppdaterar progress
  useEffect(() => {
    if (!isRunning || !nextRun) return;
    
    const intervalId = setInterval(() => {
      const now = new Date();
      const end = nextRun.getTime();
      const total = DEMO_INTERVAL_MS / TIME_SCALE_FACTOR;
      const elapsed = now.getTime() - (end - total);
      
      // Beräkna procent
      const percent = Math.min(Math.floor((elapsed / total) * 100), 100);
      setProgress(percent);
      
      // Beräkna återstående tid i sekunder
      const secondsLeft = Math.max(0, Math.floor((end - now.getTime()) / 1000));
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      
      // Om det är dags att köra jobbet
      if (now >= nextRun) {
        runJob();
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [isRunning, nextRun]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Schemalagd lagerkontroll
        </CardTitle>
        <CardDescription>
          Kontrollerar produktlager automatiskt var {DEMO_INTERVAL_MS / 1000} sekund i demo. 
          (Simulering av 5-minutersintervall).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Förlopp till nästa körning</span>
              <span className="text-sm text-muted-foreground">{timeLeft}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {isRunning ? "Igång" : "Stoppad"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Senaste körning</p>
              <p className="text-sm text-muted-foreground">
                {lastRun 
                  ? `${lastRun.toLocaleDateString()} ${lastRun.toLocaleTimeString()}`
                  : "Aldrig"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={toggleScheduler} 
          variant={isRunning ? "destructive" : "default"}
          className="w-full"
        >
          {isRunning ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" /> Stoppa schemaläggaren
            </>
          ) : (
            <>
              <PlayCircle className="mr-2 h-4 w-4" /> Starta schemaläggaren
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobScheduler;
