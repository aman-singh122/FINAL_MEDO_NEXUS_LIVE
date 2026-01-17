import API from "@/lib/axios";

// Pagination, Search aur City filters ke liye params update kiye hain
export const getAllHospitals = (params?: { 
  state?: string; 
  district?: string; 
  search?: string; 
  city?: string 
}) => {
  return API.get("/hospitals", { params });
};

export const getHospitalById = (id: string) => {
  return API.get(`/hospitals/${id}`);
};

/* ===============================
   🔥 HOSPITAL SELF PROFILE (FIX)
   =============================== */
export const getMyHospitalProfile = () => {
  return API.get("/hospitals/me"); // ✅ API instance use
};
