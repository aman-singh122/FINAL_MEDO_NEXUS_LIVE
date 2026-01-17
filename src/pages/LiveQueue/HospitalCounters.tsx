import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { queueSocket } from "./queue.socket";

/* ================= TYPES ================= */

interface Counter {
  counterId: string;
  name: string;
  department: string;
  queueId: string;
  totalPatients: number;
}

interface QueuePayload {
  _id: string;
  queue: any[];
}

/* ================= COMPONENT ================= */

export default function HospitalCounters() {
  const navigate = useNavigate();
  const [counters, setCounters] = useState<Counter[]>([]);

  /* ================= INIT ================= */

  useEffect(() => {
    // TEMP DATA (later comes from backend)
    setCounters([
      {
        counterId: "1",
        name: "Counter 1",
        department: "General Medicine",
        queueId: "QUEUE_1",
        totalPatients: 8,
      },
      {
        counterId: "2",
        name: "Counter 2",
        department: "Orthopedics",
        queueId: "QUEUE_2",
        totalPatients: 18,
      },
      {
        counterId: "3",
        name: "Counter 3",
        department: "Emergency",
        queueId: "QUEUE_3",
        totalPatients: 5,
      },
    ]);

    // Connect socket
    queueSocket.connect();

    // Listen for live queue updates
    queueSocket.on("queue-update", (queue: QueuePayload) => {
      setCounters((prev) =>
        prev.map((counter) =>
          counter.queueId === queue._id
            ? {
                ...counter,
                totalPatients: queue.queue.length,
              }
            : counter
        )
      );
    });

    return () => {
      queueSocket.disconnect();
    };
  }, []);

  /* ================= HELPERS ================= */

  const getBorderColor = (count: number) => {
    if (count <= 10) return "border-green-500";
    if (count <= 25) return "border-yellow-500";
    return "border-red-500";
  };

  const getStatusText = (count: number) => {
    if (count <= 10) return "Low Crowd";
    if (count <= 25) return "Medium Crowd";
    return "Heavy Crowd";
  };

  /* ================= UI ================= */

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Hospital OPD – Live Counters
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {counters.map((counter) => (
          <div
            key={counter.counterId}
            className={`cursor-pointer border-2 rounded-lg p-4 transition hover:shadow-lg ${getBorderColor(
              counter.totalPatients
            )}`}
            onClick={() =>
              navigate(`/live-queue/${counter.queueId}`)
            }
          >
            <h2 className="text-lg font-semibold mb-1">
              {counter.name}
            </h2>

            <p className="text-sm text-gray-600 mb-2">
              {counter.department}
            </p>

            <p className="font-medium">
              👥 {counter.totalPatients} patients
            </p>

            <p className="text-sm mt-1">
              Status:{" "}
              <span className="font-semibold">
                {getStatusText(counter.totalPatients)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
