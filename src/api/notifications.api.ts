// src/api/notifications.api.ts
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

/* ================================
   🔔 GET MY NOTIFICATIONS
================================ */
export const getMyNotifications = async () => {
  const res = await API.get("/api/notifications/my");
  return res.data;
};

/* ================================
   ✅ MARK NOTIFICATION AS READ
================================ */
export const markNotificationAsRead = async (
  notificationId: string
) => {
  const res = await API.patch(
    `/api/notifications/read/${notificationId}`
  );
  return res.data;
};
