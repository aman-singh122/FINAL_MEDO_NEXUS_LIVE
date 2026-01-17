import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "@/api/auth.api";
import { socket } from "@/socket";

/* ================= TYPES ================= */

export interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  refetchUser: () => Promise<void>;
  logout: () => void;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType | null>(null);

/* ================= PROVIDER ================= */

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ---------- FETCH CURRENT USER ---------- */
  const fetchMe = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- INITIAL AUTH CHECK ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, []);

  /* ---------- SOCKET JOIN ---------- */
  useEffect(() => {
    if (user?._id) {
      socket.emit("join-user", user._id);
      console.log("👤 Joined socket room:", user._id);
    }
  }, [user]);

  /* ---------- LOGOUT (🔥 IMPORTANT) ---------- */
  const logout = () => {
    console.log("🚪 Logout");

    // clear auth
    localStorage.removeItem("token");
    setUser(null);

    // clear socket
    try {
      socket.disconnect();
    } catch (e) {
      console.warn("Socket disconnect failed");
    }

    // 🔥 hard reload to clear SPA memory
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        refetchUser: fetchMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
