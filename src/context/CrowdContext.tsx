import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/socket";

/* ---------------- TYPES ---------------- */

export type CrowdData = {
  level: "LOW" | "MEDIUM" | "HIGH";
  color: "green" | "yellow" | "red";
  waitTime: string;
};

export type CrowdMap = {
  [hospitalId: string]: CrowdData;
};

type CrowdContextType = {
  crowdByHospital: CrowdMap;
};

/* ---------------- CONTEXT ---------------- */

const CrowdContext = createContext<CrowdContextType | undefined>(undefined);

/* ---------------- PROVIDER ---------------- */

export const CrowdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [crowdByHospital, setCrowdByHospital] = useState<CrowdMap>({});

  useEffect(() => {
    const handleCrowdUpdate = (data: any) => {
      // 🔑 VERY IMPORTANT: hospitalId must be STRING
      const hospitalId = data.hospitalId?.toString();

      if (!hospitalId) return;

      console.log("🔥 LIVE CROWD UPDATE:", hospitalId, data);

      setCrowdByHospital((prev) => ({
        ...prev,
        [hospitalId]: {
          level: data.level,
          color: data.color,
          waitTime: data.waitTime,
        },
      }));
    };

    socket.on("crowd-update", handleCrowdUpdate);

    return () => {
      socket.off("crowd-update", handleCrowdUpdate);
    };
  }, []);

  return (
    <CrowdContext.Provider value={{ crowdByHospital }}>
      {children}
    </CrowdContext.Provider>
  );
};

/* ---------------- HOOK ---------------- */

export const useCrowd = () => {
  const context = useContext(CrowdContext);
  if (!context) {
    throw new Error("useCrowd must be used within CrowdProvider");
  }
  return context;
};
