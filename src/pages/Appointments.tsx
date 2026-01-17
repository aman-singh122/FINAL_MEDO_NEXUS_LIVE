import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useMyAppointments } from "@/hooks/useMyAppointments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Building2,
  User,
  Hash,
  Video,
  Stethoscope,
  MapPin,
  ArrowRight,
  CalendarDays,
  Filter,
  Plus,
  CalendarPlus,
  AlertCircle,
} from "lucide-react";

/* ---------------- COMPONENT ---------------- */
const Appointments = () => {
  const { appointments, loading } = useMyAppointments();
  const navigate = useNavigate();

  // Group appointments by status
  const upcomingAppointments = appointments.filter(
    (a) => a.status === "confirmed" || a.status === "booked"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border-emerald-200";
      case "booked":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200";
      case "cancelled":
        return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200";
      case "completed":
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border-slate-200";
      default:
        return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅";
      case "cancelled":
        return "❌";
      case "completed":
        return "✓";
      default:
        return "📅";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">My Appointments</h1>
              <p className="text-slate-600">
                Manage and track all your medical appointments in one place
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="h-12 rounded-xl border-slate-300 font-medium"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => navigate("/book-opd")}
                className="h-12 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 font-medium shadow-sm"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <Card className="border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      {appointments.length}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Total Appointments</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      {upcomingAppointments.length}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      {pastAppointments.filter(a => a.status === "completed").length}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">
                      {pastAppointments.filter(a => a.status === "cancelled").length}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">Cancelled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-8">
          {/* Upcoming Appointments Section */}
          {upcomingAppointments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Upcoming Appointments</h2>
                <Badge variant="outline" className="font-medium">
                  {upcomingAppointments.length} scheduled
                </Badge>
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((a) => (
                  <AppointmentCard key={a._id} appointment={a} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {/* Past Appointments Section */}
          {pastAppointments.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Past Appointments</h2>
                <Badge variant="outline" className="font-medium">
                  {pastAppointments.length} total
                </Badge>
              </div>
              <div className="space-y-4">
                {pastAppointments.map((a) => (
                  <AppointmentCard key={a._id} appointment={a} navigate={navigate} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {appointments.length === 0 && (
            <Card className="border-slate-200 rounded-2xl shadow-sm">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">No Appointments Yet</h3>
                <p className="text-slate-600 max-w-sm mx-auto mb-8">
                  You haven't booked any appointments yet. Schedule your first consultation today.
                </p>
                <Button
                  onClick={() => navigate("/book-opd")}
                  className="h-12 px-8 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 font-medium"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

/* ---------------- APPOINTMENT CARD COMPONENT ---------------- */
const AppointmentCard = ({ appointment, navigate }: any) => {
  const isOnlineConsult = appointment.appointmentType === "online";
  const appointmentDate = new Date(appointment.schedule.date);
  const isToday = appointmentDate.toDateString() === new Date().toDateString();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border-emerald-200";
      case "booked":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border-blue-200";
      case "cancelled":
        return "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200";
      case "completed":
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-600 border-slate-200";
      default:
        return "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200";
    }
  };

  return (
    <Card
      onClick={() => navigate(`/appointments/${appointment._id}`)}
      className="border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Left Section - Details */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isOnlineConsult
                      ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                      : "bg-gradient-to-br from-blue-500 to-indigo-500 text-white"
                  )}>
                    {isOnlineConsult ? (
                      <Video className="h-6 w-6" />
                    ) : (
                      <Stethoscope className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {isOnlineConsult ? "Online Consultation" : appointment.hospital?.hospitalName || "Hospital"}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-700 font-medium">
                        Dr. {appointment.doctor?.doctorName || "Doctor"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">
                      {appointmentDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {isToday && (
                        <Badge className="ml-2 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 text-xs">
                          Today
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{appointment.schedule.timeSlot}</span>
                  </div>
                  {!isOnlineConsult && appointment.hospital?.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">{appointment.hospital.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <Badge className={cn(
                "px-4 py-1.5 rounded-full font-medium border capitalize",
                getStatusColor(appointment.status)
              )}>
                {appointment.status}
              </Badge>
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
              {appointment.department && (
                <Badge variant="outline" className="text-xs font-medium">
                  {appointment.department}
                </Badge>
              )}
              {!isOnlineConsult && appointment.token?.tokenNumber && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    Token #{appointment.token.tokenNumber}
                  </span>
                </div>
              )}
              <div className="text-xs text-slate-500 font-medium">
                ID: {appointment.appointmentId}
              </div>
            </div>
          </div>

          {/* Right Section - Action */}
          <div className="lg:w-48 lg:border-l lg:border-slate-100 lg:pl-6 flex-shrink-0">
            <div className="flex lg:flex-col items-center lg:items-end justify-between h-full">
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">
                  {appointmentDate.getDate()}
                </div>
                <div className="text-sm text-slate-500 font-medium">
                  {appointmentDate.toLocaleDateString('en-US', { month: 'short' })}
                  {' '}
                  {appointmentDate.getFullYear()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/appointments/${appointment._id}`);
                }}
              >
                View Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Appointments;