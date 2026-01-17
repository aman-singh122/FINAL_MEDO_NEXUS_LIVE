import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Bell, 
  Search, 
  LogOut, 
  Building2, 
  Menu, 
  ChevronDown,
  User 
} from "lucide-react";

/* ================= PROPS TYPE ================= */
type HospitalNavbarProps = {
  hospital: {
    name?: string;
    logo?: string; // Added optional logo prop for realism
  } | null;
  onSidebarToggle?: () => void; // Optional: to toggle a sidebar
};

const HospitalNavbar = ({ hospital, onSidebarToggle }: HospitalNavbarProps) => {
  const navigate = useNavigate();
  const { setUser, user } = useAuth(); // Assuming user object exists in context
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /* ================= HANDLERS ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ================= LEFT: BRANDING ================= */}
        <div className="flex items-center gap-4">
          {/* Mobile Sidebar Toggle (Visual only for this snippet) */}
          <button 
            onClick={onSidebarToggle}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-sm text-white">
              {/* Fallback icon if no image logo */}
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-tight">
                {hospital?.name || "MedCare Dashboard"}
              </h1>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        {/* ================= CENTER: SEARCH (Hidden on mobile) ================= */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, doctors, or records..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <div className="absolute right-2 top-2 hidden lg:flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: ACTIONS & PROFILE ================= */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Notification Bell */}
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          {/* Profile Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1 pl-2 pr-1 rounded-full border border-slate-200 hover:shadow-md transition-all bg-white"
            >
              <div className="hidden text-right sm:block">
                <p className="text-xs font-semibold text-slate-700">Administrator</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-600">
                <User className="h-4 w-4" />
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 mr-1 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu (Simple implementation) */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-slate-100 bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
                 <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">Signed in as</p>
                    <p className="text-xs text-slate-500 truncate">admin@hospital.com</p>
                 </div>
                 
                 <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Settings</a>
                 <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Support</a>
                 
                 <div className="border-t border-slate-100 mt-1 pt-1">
                   <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HospitalNavbar;