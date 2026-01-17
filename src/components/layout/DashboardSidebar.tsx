import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  CalendarPlus,
  Video,
  FileText,
  MessageCircle,
  LogOut,
  Heart,
  User,
  Clock,
  Building2,
  Stethoscope,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: LayoutDashboard,
      color: "from-blue-500 to-blue-600",
      hoverColor: "group-hover:from-blue-400 group-hover:to-blue-500"
    },
    { 
      name: "Book OPD", 
      path: "/book-opd", 
      icon: CalendarPlus,
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "group-hover:from-emerald-400 group-hover:to-emerald-500"
    },
    { 
      name: "Consult Online", 
      path: "/consult", 
      icon: Video,
      color: "from-purple-500 to-purple-600",
      hoverColor: "group-hover:from-purple-400 group-hover:to-purple-500"
    },
    { 
      name: "My Appointments", 
      path: "/appointments", 
      icon: Clock,
      color: "from-amber-500 to-amber-600",
      hoverColor: "group-hover:from-amber-400 group-hover:to-amber-500"
    },
    { 
      name: "Hospitals", 
      path: "/hospitals", 
      icon: Building2,
      color: "from-cyan-500 to-cyan-600",
      hoverColor: "group-hover:from-cyan-400 group-hover:to-cyan-500"
    },
    { 
      name: "Doctors", 
      path: "/doctors", 
      icon: Stethoscope,
      color: "from-green-500 to-green-600",
      hoverColor: "group-hover:from-green-400 group-hover:to-green-500"
    },
    { 
      name: "Medical Records", 
      path: "/records", 
      icon: FileText,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "group-hover:from-indigo-400 group-hover:to-indigo-500"
    },
    { 
      name: "Billing", 
      path: "/medichat", 
      icon: MessageCircle,
      color: "from-pink-500 to-pink-600",
      hoverColor: "group-hover:from-pink-400 group-hover:to-pink-500"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 flex flex-col bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-800 shadow-2xl">
      {/* Logo with Glow Effect */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 group relative"
          onMouseEnter={() => setHoveredItem('logo')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className="relative">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 transform transition-all duration-300 ${
              hoveredItem === 'logo' ? 'rotate-12 scale-110' : ''
            }`}>
              <Heart className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 fill-yellow-300" />
            </div>
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg -z-10"></div>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white bg-clip-text text-transparent">
              Medo<span className="text-blue-600 dark:text-blue-400">Sphere</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Premium Healthcare
            </p>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white truncate text-sm">
              {user?.name || "Welcome User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              Patient Account
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                85%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                  : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
              }`}
              onMouseEnter={() => setHoveredItem(item.path)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Animated background glow */}
              {active && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 rounded-xl blur-md -z-10`}></div>
              )}
              
              {/* Icon Container */}
              <div className={`relative z-10 p-2 rounded-lg transition-all duration-300 ${
                active 
                  ? 'bg-white/20 backdrop-blur-sm' 
                  : `bg-gradient-to-br ${item.hoverColor} from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 group-hover:bg-gradient-to-br ${item.hoverColor}`
              }`}>
                <Icon className={`h-4 w-4 transition-all duration-300 ${
                  active 
                    ? 'text-white scale-110' 
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-white group-hover:scale-110'
                }`} />
              </div>
              
              {/* Menu Text */}
              <span className={`relative z-10 font-medium transition-all duration-300 ${
                active 
                  ? 'text-white' 
                  : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white'
              }`}>
                {item.name}
              </span>
              
              {/* Active Indicator */}
              {active && (
                <div className="ml-auto h-2 w-2 rounded-full bg-white shadow-lg animate-pulse"></div>
              )}
              
              {/* Hover Arrow */}
              {!active && (
                <ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
              )}
              
              {/* Hover Glow Effect */}
              {hoveredItem === item.path && !active && (
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-5 rounded-xl -z-10`}></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gradient-to-t from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <button
          onClick={handleLogout}
          className="group relative flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-300 overflow-hidden"
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
          <div className="absolute inset-0 bg-red-50 dark:bg-red-900/20 group-hover:opacity-0 transition-all duration-300 -z-10"></div>
          
          {/* Icon */}
          <div className="relative p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 group-hover:from-red-500 group-hover:to-red-600 transition-all duration-300">
            <LogOut className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-white group-hover:rotate-180 transition-all duration-300" />
          </div>
          
          {/* Text */}
          <span className="font-medium group-hover:text-white transition-all duration-300">
            Logout
          </span>
          
          {/* Arrow */}
          <ChevronRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
          
          {/* Glow Effect on Hover */}
          {hoveredItem === 'logout' && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-10 rounded-xl blur-lg -z-10 animate-pulse"></div>
          )}
        </button>
        
        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure • Encrypted • HIPAA Compliant
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            v2.1.4 • Last active: Just now
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;