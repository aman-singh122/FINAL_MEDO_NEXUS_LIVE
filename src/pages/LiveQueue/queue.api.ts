import axios from "@/lib/axios";

export const initQueue = async (hospitalId: string, doctorId: string) => {
  const res = await axios.post("/queue/init", {
    hospitalId,
    doctorId,
  });
  return res.data;
};

export const updateTokenStatus = async (
  queueId: string,
  tokenNumber: number,
  status: "waiting" | "serving" | "completed"
) => {
  const res = await axios.patch("/queue/update", {
    queueId,
    tokenNumber,
    status,
  });
  return res.data;
};


