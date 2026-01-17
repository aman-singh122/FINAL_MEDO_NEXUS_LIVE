import API from "@/lib/axios";

/* ============================
   HOSPITAL OPD DOCTORS
   ============================ */
export const getDoctorsByHospital = (hospitalId: string) => {
  return API.get(`/doctor/hospital/${hospitalId}`);
};

/* ============================
   ONLINE CONSULT DOCTORS
   ============================ */
export const getOnlineDoctors = (city?: string) => {
  return API.get("/doctor/online", {
    params: city ? { city } : {}
  });
};
