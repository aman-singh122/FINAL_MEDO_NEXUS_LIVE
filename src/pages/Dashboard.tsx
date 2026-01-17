import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useState, useEffect, useRef } from "react";
import { useMyAppointments } from "@/hooks/useMyAppointments";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  CalendarPlus,
  Video,
  FileText,
  MessageCircle,
  Clock,
  Stethoscope,
  Bell,
  TrendingUp,
  ArrowRight,
  ChevronRight,
  MapPin,
  Sparkles,
  Activity,
  Shield,
  Heart,
  Calendar,
  User,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/* =====================================================
   DASHBOARD COMPONENT
===================================================== */
const Dashboard = () => {
  /* ---------------- AUTH ---------------- */
  const { user, loading: authLoading } = useAuth();

  /* ---------------- APPOINTMENTS ---------------- */
  const {
    appointments,
    loading: appointmentsLoading,
  } = useMyAppointments();

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "booked" || a.status === "confirmed"
  );

  /* ---------------- NOTIFICATIONS ---------------- */
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  /* ---------------- NAVIGATION ---------------- */
  const navigate = useNavigate();

  /* ---------------- CLOSE NOTIFICATION ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- QUICK ACTIONS ---------------- */
  const quickActions = [
    {
      title: "Book OPD",
      description: "Schedule an outpatient appointment",
      icon: CalendarPlus,
      path: "/book-opd",
      gradient: "from-blue-600 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50",
      borderColor: "border-blue-100",
    },
    {
      title: "Online Consultation",
      description: "Consult with a doctor virtually",
      icon: Video,
      path: "/consult",
      gradient: "from-purple-600 to-pink-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-100",
    },
    {
      title: "Medical Records",
      description: "View your health history",
      icon: FileText,
      path: "/records",
      gradient: "from-emerald-600 to-teal-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
      borderColor: "border-emerald-100",
    },
    {
      title: "MediChat",
      description: "AI-powered health assistant",
      icon: MessageCircle,
      path: "/medichat",
      gradient: "from-amber-600 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
      borderColor: "border-amber-100",
      new: true,
    },
  ];

  /* ---------------- HEALTH TIPS ---------------- */
  const healthTips = [
    {
      id: 1,
      text: "Stay hydrated - drink at least 8 glasses of water daily",
      icon: "💧",
      category: "Hydration",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: 2,
      text: "Take a 30-minute walk every day for better heart health",
      icon: "🚶",
      category: "Exercise",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      id: 3,
      text: "Get 7-8 hours of quality sleep each night",
      icon: "😴",
      category: "Sleep",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      id: 4,
      text: "Practice 10 minutes of meditation daily for mental wellness",
      icon: "🧘",
      category: "Mental Health",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  /* ---------------- LOADING ---------------- */
  if (authLoading || appointmentsLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ---------------- USER GUARD ---------------- */
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">User not found</h2>
          <p className="text-gray-500">Please sign in to access your dashboard</p>
          <Button className="mt-6" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-10">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            
            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              {/* USER INFO */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {user.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 border-4 border-white flex items-center justify-center shadow-lg">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, <span className="text-white/90">{user.name?.split(" ")[0]}!</span>
                  </h1>
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Dhanbad</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    <span className="text-white/70">
                      Good{" "}
                      {new Date().getHours() < 12
                        ? "Morning"
                        : new Date().getHours() < 18
                        ? "Afternoon"
                        : "Evening"}
                      , ready to take care of your health?
                    </span>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-4">
                {/* NOTIFICATIONS */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications((prev) => !prev)}
                    className="relative p-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-5 duration-200">
                      <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white font-semibold flex justify-between items-center">
                        <span className="text-gray-800">Notifications</span>
                        <Badge variant="outline" className="font-mono">
                          {notifications.length}
                        </Badge>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-10 text-center text-gray-500 space-y-3">
                            <Bell className="h-12 w-12 mx-auto text-gray-300" />
                            <p className="font-medium text-gray-400">No notifications yet</p>
                            <p className="text-sm text-gray-400">Updates will appear here</p>
                          </div>
                        ) : (
                          notifications.map((n, i) => (
                            <div
                              key={i}
                              className={cn(
                                "p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-150",
                                !n.isRead && "bg-blue-50 border-l-4 border-l-blue-500"
                              )}
                              onClick={() => setShowNotifications(false)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                  !n.isRead ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                                )}>
                                  <Bell className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {n.title}
                                  </div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    {n.message}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-2">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* BOOK BUTTON */}
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  <Link to="/book-opd">
                    <CalendarPlus className="h-5 w-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <span className="text-sm text-gray-500">Get started in seconds</span>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                  action.bgColor,
                  action.borderColor
                )}
              >
                {action.new && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full animate-pulse">
                      NEW
                    </Badge>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className={cn(
                    "h-16 w-16 rounded-xl flex items-center justify-center text-white shadow-lg",
                    `bg-gradient-to-br ${action.gradient}`
                  )}>
                    <action.icon className="h-7 w-7" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-sm font-medium">
                    <span className={cn(
                      "group-hover:underline",
                      action.gradient.includes("blue") && "text-blue-600",
                      action.gradient.includes("purple") && "text-purple-600",
                      action.gradient.includes("emerald") && "text-emerald-600",
                      action.gradient.includes("amber") && "text-amber-600"
                    )}>
                      Get Started
                    </span>
                    <ChevronRight className={cn(
                      "h-4 w-4 ml-1 transition-transform group-hover:translate-x-1",
                      action.gradient.includes("blue") && "text-blue-600",
                      action.gradient.includes("purple") && "text-purple-600",
                      action.gradient.includes("emerald") && "text-emerald-600",
                      action.gradient.includes("amber") && "text-amber-600"
                    )} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= MAIN GRID ================= */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* UPCOMING APPOINTMENTS */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-gray-900">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Upcoming Appointments</h3>
                      <p className="text-sm text-gray-500 font-normal">
                        {upcomingAppointments.length} scheduled
                      </p>
                    </div>
                  </span>
                  <Link
                    to="/appointments"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-1">No upcoming appointments</h4>
                      <p className="text-sm text-gray-500">Schedule your next appointment today</p>
                    </div>
                    <Button asChild variant="outline" className="mt-4">
                      <Link to="/book-opd">Book Now</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appt) => {
                      const isOnline = appt.appointmentType === "online";
                      const appointmentDate = new Date(appt.schedule.date);
                      const isToday = appointmentDate.toDateString() === new Date().toDateString();

                      return (
                        <div
                          key={appt._id}
                          onClick={() => navigate(`/appointments/${appt._id}`)}
                          className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md cursor-pointer transition-all duration-200 bg-white"
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-md",
                              isOnline
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : "bg-gradient-to-br from-emerald-500 to-teal-500"
                            )}>
                              {isOnline ? (
                                <Video className="h-6 w-6" />
                              ) : (
                                <Stethoscope className="h-6 w-6" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  Dr. {appt.doctor?.doctorName || "Doctor"}
                                </h4>
                                <div className="flex items-center gap-2">
                                  {isToday && (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                      Today
                                    </Badge>
                                  )}
                                  <Badge variant={appt.status === "confirmed" ? "default" : "secondary"} 
                                    className={cn(
                                      appt.status === "confirmed" && "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
                                      appt.status === "booked" && "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                                    )}>
                                    {appt.status}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="font-medium">
                                    {isOnline ? "Online Consultation" : appt.hospital?.hospitalName}
                                  </span>
                                </p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4" />
                                    {appointmentDate.toLocaleDateString('en-US', { 
                                      weekday: 'short', 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    {appt.schedule.timeSlot}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* HEALTH TIPS */}
          <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Daily Health Tips</h3>
                    <p className="text-sm text-gray-500 font-normal">
                      Your wellness guide
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {healthTips.map((tip) => (
                    <div
                      key={tip.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
                        tip.bgColor,
                        "border-transparent"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0",
                          tip.bgColor.replace("bg-", "bg-").replace("-50", "-100")
                        )}>
                          {tip.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs font-medium",
                                tip.iconColor,
                                tip.bgColor.replace("bg-", "bg-").replace("-50", "-100") + "/50"
                              )}
                            >
                              {tip.category}
                            </Badge>
                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                          </div>
                          <p className="text-sm text-gray-700 font-medium leading-relaxed">
                            {tip.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-3">
                      Small steps lead to big changes in health
                    </p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/wellness">
                        <Activity className="h-4 w-4 mr-2" />
                        View Wellness Plan
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="text-center text-gray-500 text-sm">
            <p className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Your health journey matters. Stay proactive with regular check-ups.
              <Sparkles className="h-4 w-4 text-blue-500" />
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;