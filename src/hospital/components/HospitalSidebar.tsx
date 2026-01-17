import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarClock, 
  Users, 
  Stethoscope, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  Activity,
  CreditCard,
  Building2
} from "lucide-react";

/* ================= TYPES ================= */
type MenuItem = {
  label: string;
  path: string;
  icon: React.ElementType;
  badge?: string; // Optional notification badge
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

/* ================= DATA CONFIG ================= */
const sidebarGroups: MenuGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", path: "/hospital/dashboard", icon: LayoutDashboard },
      { label: "Appointments", path: "/hospital/appointments", icon: CalendarClock, badge: "5" },
    ],
  },
  {
    title: "Clinical",
    items: [
      { label: "Patients", path: "/hospital/patients", icon: Users },
      { label: "Doctors", path: "/hospital/doctors", icon: Stethoscope },
      { label: "Records", path: "/hospital/records", icon: FileText },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Departments", path: "/hospital/departments", icon: Building2 },
      { label: "Billing", path: "/hospital/billing", icon: CreditCard },
      { label: "Settings", path: "/hospital/settings", icon: Settings },
    ],
  },
];

const HospitalSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-slate-900 border-r border-slate-800 text-slate-300 font-sans shadow-xl">
      
      {/* ================= HEADER / BRAND ================= */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="flex items-center justify-center h-8 w-8 rounded bg-blue-600 text-white shadow-lg shadow-blue-500/30">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">HEALTH HUB</h2>
          <span className="text-[10px] font-medium text-slate-500 uppercase">Enterprise</span>
        </div>
      </div>

      {/* ================= SCROLLABLE NAV ================= */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
        {sidebarGroups.map((group) => (
          <div key={group.title}>
            <h3 className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {group.title}
            </h3>
            
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    group relative flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                        <span>{item.label}</span>
                      </div>
                      
                      {/* Optional Badge */}
                      {item.badge && (
                        <span className={`px-2 py-0.5 text-[10px] rounded-full ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ================= FOOTER / SUPPORT CARD ================= */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        
        {/* Help Widget */}
        <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-slate-700/50">
              <HelpCircle className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-white">Need Support?</p>
          </div>
          <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">
            Contact our 24/7 technical support team for assistance.
          </p>
          <button className="w-full py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded transition">
            Open Ticket
          </button>
        </div>

        {/* User Mini Profile (Optional if not in Navbar, useful here too) */}
        <div className="flex items-center gap-3 px-2">
           <button className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-red-400 transition-colors">
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
           </button>
           <span className="text-[10px] text-slate-600 ml-auto">v2.4.0</span>
        </div>
      </div>
    </aside>
  );
};

export default HospitalSidebar;