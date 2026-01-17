import API from "@/lib/axios";

/* ================= BOOK OPD ================= */

export interface BookOpdPayload {
  hospitalId: string;
  doctorId: string;
  department: string;

  schedule: {
    date: string;
    timeSlot: string;
  };

  patient: {
    name: string;
    age: number;
    gender: "male" | "female" | "other";
    phone?: string;
  };

  fees: {
    registrationFee: number;
    consultationFee: number;
    totalAmount: number;
  };

  source?: "web" | "mobile" | "kiosk";
}

/* 🔥 BOOK OPD */
export const bookOpd = (data: BookOpdPayload) =>
  API.post("/opd/book", data);

/* 🔥 MY APPOINTMENTS */
export const getMyAppointments = () =>
  API.get("/opd/my-appointments");

/* 🔥 SINGLE APPOINTMENT DETAIL */
export const getAppointmentById = (id: string) =>
  API.get(`/opd/appointments/${id}`);

/* 🔥 CANCEL OPD */
export const cancelOpd = (id: string, reason?: string) =>
  API.patch(`/opd/cancel/${id}`, { reason });
