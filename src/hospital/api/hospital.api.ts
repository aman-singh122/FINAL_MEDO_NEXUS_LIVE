import API from "@/lib/axios";

export const getMyHospital = async () => {
  return API.get("/hospitals/me");
};

export const getHospitalAppointments = async (hospitalId?: string) => {
  const url = hospitalId
    ? `/appointments/hospital?hospitalId=${hospitalId}`
    : `/appointments/hospital`;

  return API.get(url);
};

export const getHospitalPatients = async () => {
  return API.get("/hospitals/patients");
};

export const getHospitalDoctors = async () => {
  return API.get("/hospitals/doctors");
};
