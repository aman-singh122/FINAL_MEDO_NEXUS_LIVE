import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { queueSocket } from "./queue.socket";

/* ================= TYPES ================= */

interface QueueItem {
  tokenNumber: number;
  status: "waiting" | "serving" | "completed";
  urgency: "normal" | "moderate" | "critical";
}

interface QueuePayload {
  _id: string;
  queue: QueueItem[];
}

/* ================= COMPONENT ================= */

export default function PatientQueue() {
  const { queueId } = useParams();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [myToken, setMyToken] = useState<number | null>(null);
  const [alertMsg, setAlertMsg] = useState<string>("");

  /* ================= INIT ================= */

  useEffect(() => {
    if (!queueId) return;

    // TEMP: assume patient token (later from backend)
    const PATIENT_TOKEN = 5;
    setMyToken(PATIENT_TOKEN);

    queueSocket.connect();
    queueSocket.emit("join-queue", { queueId });

    const handleQueueUpdate = (data: QueuePayload) => {
      setQueue(data.queue);

      const servingIndex = data.queue.findIndex(
        (q) => q.status === "serving"
      );

      const myIndex = data.queue.findIndex(
        (q) => q.tokenNumber === PATIENT_TOKEN
      );

      if (myIndex !== -1 && myIndex - servingIndex <= 2) {
        setAlertMsg("🔔 Your turn is coming soon!");
      } else {
        setAlertMsg("");
      }
    };

    queueSocket.on("queue-update", handleQueueUpdate);

    return () => {
      queueSocket.off("queue-update", handleQueueUpdate);
      queueSocket.disconnect();
    };
  }, [queueId]);

  /* ================= HELPERS ================= */

  const getUrgencyColor = (urgency: string) => {
    if (urgency === "critical") return "text-red-600";
    if (urgency === "moderate") return "text-yellow-600";
    return "text-green-600";
  };

  const estimatedWaitTime = () => {
    if (myToken === null) return 0;
    const index = queue.findIndex((q) => q.tokenNumber === myToken);
    if (index === -1) return 0;
    return index * 5; // 5 min per patient
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Live OPD Queue Status
      </h1>

      {myToken && (
        <div className="mb-4 p-4 border rounded">
          <p className="font-medium">
            🎫 My Token: <span className="font-bold">{myToken}</span>
          </p>
          <p className="mt-1">
            ⏳ Estimated Wait Time:{" "}
            <span className="font-semibold">
              {estimatedWaitTime()} minutes
            </span>
          </p>
        </div>
      )}

      {alertMsg && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
          {alertMsg}
        </div>
      )}

      <h2 className="font-semibold mb-2">Queue Progress</h2>

      <div className="space-y-2">
        {queue.map((q) => (
          <div
            key={q.tokenNumber}
            className="flex justify-between border p-2 rounded"
          >
            <span>Token #{q.tokenNumber}</span>
            <span className={getUrgencyColor(q.urgency)}>
              {q.urgency}
            </span>
            <span>{q.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
