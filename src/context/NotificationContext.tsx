import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/socket";
import {
  getMyNotifications,
  markNotificationAsRead,
} from "@/api/notifications.api";

/* ================= TYPES ================= */
export type NotificationType = {
  _id?: string;        // backend uses _id
  title: string;
  message: string;
  type: string;
  createdAt?: string;
  isRead?: boolean;
};

type NotificationContextType = {
  notifications: NotificationType[];
  addNotification: (n: NotificationType) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => Promise<void>;
};

const NotificationContext =
  createContext<NotificationContextType | null>(null);

/* ================= PROVIDER ================= */
export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  /* =====================================================
     🔁 FETCH EXISTING NOTIFICATIONS (FROM BACKEND)
     ===================================================== */
  const refreshNotifications = async () => {
    try {
      const res = await getMyNotifications();
      if (res?.notifications) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("❌ Failed to fetch notifications");
    }
  };

  /* =====================================================
     🔔 SOCKET LISTENER (REAL-TIME NOTIFICATIONS)
     ===================================================== */
  useEffect(() => {
    // 1️⃣ Load old notifications on page refresh
    refreshNotifications();

    // 2️⃣ Listen for real-time notifications
    socket.on("notification", (data: NotificationType) => {
      console.log("🔔 Notification received:", data);

      setNotifications((prev) => [
        {
          ...data,
          isRead: false,
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  /* ================= HELPERS ================= */
  const addNotification = (notification: NotificationType) => {
    setNotifications((prev) => [notification, ...prev]);
  };

  const markAllAsRead = async () => {
    try {
      // backend sync (optional but safe)
      await Promise.all(
        notifications
          .filter((n) => !n.isRead && n._id)
          .map((n) => markNotificationAsRead(n._id!))
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    } catch (err) {
      console.error("❌ Failed to mark notifications as read");
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/* ================= HOOK ================= */
export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }
  return ctx;
};
