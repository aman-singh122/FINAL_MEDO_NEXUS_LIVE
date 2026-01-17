import API from "@/lib/axios";

export const getMyMedicalRecords = () => {
  return API.get("/records/my-records");
};
