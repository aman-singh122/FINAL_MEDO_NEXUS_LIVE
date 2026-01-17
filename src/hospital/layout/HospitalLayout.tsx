import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import HospitalNavbar from "../components/HospitalNavbar";
import HospitalSidebar from "../components/HospitalSidebar";
import { getMyHospital } from "../api/hospital.api";


/* ================= TYPES ================= */
type Hospital = {
  _id: string;
  name: string;
  logo?: string;
};

const HospitalLayout = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  /* ================= FETCH HOSPITAL PROFILE ================= */
  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const res = await getMyHospital();
        setHospital(res.data.hospital);
      } catch (error) {
        console.error("Failed to fetch hospital profile", error);
        setHospital(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, []);

  /* ================= AUTO-CLOSE MOBILE MENU ================= */
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* ================= SIDEBAR (DESKTOP) ================= */}
      <div className="hidden md:block">
        <HospitalSidebar />
      </div>

      {/* ================= SIDEBAR (MOBILE) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative h-full w-64 bg-slate-900 shadow-xl">
            <HospitalSidebar />
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Navbar */}
        <HospitalNavbar
          hospital={hospital}
          onSidebarToggle={() =>
            setIsMobileMenuOpen((prev) => !prev)
          }
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalLayout;
