import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

// Try multiple possible paths
const DATA_PATHS = ["sensors", "data", "readings", ""];

export interface SensorData {
  temperature?: number;
  humidity?: number;
  ldr?: number;
  irSensor?: boolean;
  uvLevel?: string;
  riskScore?: number;
  aiConfidence?: number;
  aiSummary?: string;
  location?: string;
  lastUpdated?: number;
  [key: string]: any; // Allow any other fields
}

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dbPath, setDbPath] = useState<string>("");

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Try each path until we find data
    const tryPath = async (pathIndex: number) => {
      if (pathIndex >= DATA_PATHS.length) {
        setLoading(false);
        return;
      }

      const path = DATA_PATHS[pathIndex];
      const dbRef = ref(database, path);
      
      unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          const val = snapshot.val();
          console.log(`Firebase data from /${path}:`, val);
          
          if (val) {
            setData(val as SensorData);
            setDbPath(path);
            setLoading(false);
          } else {
            // Try next path
            tryPath(pathIndex + 1);
          }
        },
        (err) => {
          console.error(`Firebase error on /${path}:`, err);
          // Try next path on error
          tryPath(pathIndex + 1);
        }
      );
    };

    tryPath(0);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { data, loading, error, dbPath };
}

export function useRiskAnalysis() {
  const { data, loading, error } = useSensorData();

  // Calculate risk level based on sensor data
  const getRiskLevel = (score?: number): "low" | "moderate" | "high" | "severe" => {
    if (!score) return "low";
    if (score < 30) return "low";
    if (score < 60) return "moderate";
    if (score < 80) return "high";
    return "severe";
  };

  return {
    riskScore: data?.riskScore ?? 0,
    aiConfidence: data?.aiConfidence ?? 0,
    riskLevel: getRiskLevel(data?.riskScore),
    aiSummary: data?.aiSummary ?? "No data available",
    loading,
    error,
  };
}