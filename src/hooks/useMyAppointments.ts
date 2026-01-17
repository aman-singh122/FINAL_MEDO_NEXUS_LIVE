import { useEffect, useState } from "react";
import { getMyAppointments } from "@/api/opd.api";

export interface Appointment {
  _id: string;
  appointmentId: string;
  appointmentType?: "online";
  hospital?: { hospitalName?: string };
  doctor?: { doctorName?: string };
  schedule: { date: string; timeSlot: string };
  token?: { tokenNumber?: number };
  status: string;
}

export const useMyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const res = await getMyAppointments();
        setAppointments(res.data.appointments || []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  return { appointments, loading };
};
