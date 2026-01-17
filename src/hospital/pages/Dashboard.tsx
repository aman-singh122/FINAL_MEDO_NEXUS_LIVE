import { useEffect, useState } from "react";
import {
  Users,
  CalendarClock,
  Stethoscope,
  Clock,
  Activity,
  AlertCircle,
  Building2,
  MapPin,
  RefreshCw,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Star,
  Shield,
  Thermometer,
  Pill,
  Ambulance,
  Calendar,
  Phone,
  Mail,
  Globe,
  FileText,
  UserPlus,
  ClipboardList,
} from "lucide-react";

import {
  getMyHospital,
  getHospitalPatients,
  getHospitalAppointments,
  getHospitalDoctors,
} from "../api/hospital.api";

/* ================= TYPES ================= */
type Hospital = {
  name: string;
  type?: string;
  address?: {
    city?: string;
    district?: string;
    state?: string;
    full?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  opd?: {
    maxTokensPerDay?: number;
    currentTokens?: number;
  };
  rating?: number;
  established?: string;
};

type Appointment = {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  type: string;
};

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  patientsToday: number;
  status: "available" | "busy" | "off";
};

/* ================= COMPONENTS ================= */
const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  bgColor,
  trend,
}: {
  title: string;
  value: number | string;
  change?: string;
  icon: any;
  color: string;
  bgColor: string;
  trend?: "up" | "down";
}) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-slate-100">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {change && (
            <span
              className={`flex items-center text-sm font-medium mb-1 ${
                trend === "up"
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {change}
            </span>
          )}
        </div>
      </div>
      <div
        className={`h-14 w-14 rounded-xl ${bgColor} flex items-center justify-center transition-transform group-hover:scale-110`}
      >
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center text-xs text-slate-500">
        <span className="flex-1">View details</span>
        <ChevronRight className="h-4 w-4" />
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    available: "bg-emerald-100 text-emerald-700 border-emerald-200",
    busy: "bg-amber-100 text-amber-700 border-amber-200",
    off: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        styles[status as keyof typeof styles] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};

const HospitalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [activeDoctors, setActiveDoctors] = useState(0);

  /* ================= FETCH DASHBOARD ================= */
  const fetchDashboard = async () => {
    try {
      setRefreshing(true);
      
      const [
        hospitalRes,
        patientsRes,
        appointmentsRes,
        doctorsRes,
      ] = await Promise.all([
        getMyHospital(),
        getHospitalPatients(),
        getHospitalAppointments(),
        getHospitalDoctors(),
      ]);

      setHospital(hospitalRes.data.hospital);
      setTotalPatients(patientsRes.data.patients?.length || 0);
      
      const today = new Date().toISOString().split("T")[0];
      const todayAppointments = appointmentsRes.data.appointments?.filter(
        (a: any) => a.schedule?.date === today
      ) || [];
      
      setAppointmentsToday(todayAppointments.length);
      setAppointments(todayAppointments.slice(0, 4));
      setActiveDoctors(doctorsRes.data.doctors?.length || 0);
      setDoctors(doctorsRes.data.doctors?.slice(0, 3) || []);
      
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-pulse"></div>
            <div className="h-4 w-96 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
        <div className="relative">
          <AlertCircle className="h-20 w-20 text-red-400 mb-6" />
          <div className="absolute inset-0 bg-red-400/10 blur-xl"></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Hospital Data Not Found
        </h2>
        <p className="text-slate-600 mb-6 max-w-md text-center">
          We couldn't retrieve your hospital information. Please check your connection or contact support.
        </p>
        <button
          onClick={fetchDashboard}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const maxTokens = hospital.opd?.maxTokensPerDay || 0;
  const currentTokens = hospital.opd?.currentTokens || 0;
  const utilizationPercentage = Math.min((currentTokens / maxTokens) * 100, 100);
  const remainingTokens = maxTokens - currentTokens;

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
            <h1 className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              Hospital Dashboard
            </h1>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Welcome back, {hospital.name}
            </h2>
            <p className="text-slate-600 mt-2">
              Here's what's happening with your hospital today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hospital.rating && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-200">
              <Star className="h-4 w-4 text-amber-600 fill-amber-600" />
              <span className="font-bold text-amber-900">{hospital.rating}</span>
              <span className="text-sm text-amber-700">/5.0</span>
            </div>
          )}
          <button
            onClick={fetchDashboard}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50">
            <MoreVertical className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={totalPatients.toLocaleString()}
          change="+12%"
          trend="up"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatCard
          title="Today's Appointments"
          value={appointmentsToday}
          change="+5%"
          trend="up"
          icon={CalendarClock}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <StatCard
          title="Active Doctors"
          value={activeDoctors}
          change="+2"
          trend="up"
          icon={Stethoscope}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Avg. Wait Time"
          value="24 min"
          change="-3 min"
          trend="down"
          icon={Clock}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-2 space-y-8">
          {/* HOSPITAL PROFILE CARD */}
          <div className="rounded-2xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {hospital.name}
                  </h3>
                  <p className="text-slate-600">{hospital.type || "Multi-specialty Hospital"}</p>
                </div>
              </div>
              {hospital.established && (
                <div className="px-3 py-1 bg-slate-100 rounded-full">
                  <span className="text-sm font-medium text-slate-700">
                    Est. {hospital.established}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Address</p>
                    <p className="text-slate-800 mt-1">
                      {hospital.address?.full || 
                       `${hospital.address?.district || ""}, ${hospital.address?.city || ""}, ${hospital.address?.state || ""}`}
                    </p>
                  </div>
                </div>
                
                {hospital.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Phone</p>
                      <p className="text-slate-800">{hospital.contact.phone}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {hospital.contact?.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Email</p>
                      <p className="text-slate-800">{hospital.contact.email}</p>
                    </div>
                  </div>
                )}
                
                {hospital.contact?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-500">Website</p>
                      <a 
                        href={hospital.contact.website}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        {hospital.contact.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS & UPCOMING APPOINTMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QUICK ACTIONS */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-slate-900">Register Patient</p>
                    <p className="text-sm text-slate-600">Add new patient to system</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                </button>
                
                <button className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Stethoscope className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-slate-900">Add Doctor</p>
                    <p className="text-sm text-slate-600">Onboard new medical staff</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                </button>
                
                <button className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-500 hover:bg-purple-50 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-slate-900">Schedule OPD</p>
                    <p className="text-sm text-slate-600">Manage daily OPD schedule</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600" />
                </button>
              </div>
            </div>

            {/* UPCOMING APPOINTMENTS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Upcoming Appointments
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-3">
                {appointments.length > 0 ? (
                  appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900">
                          {appointment.patientName}
                        </span>
                        <StatusBadge status={appointment.status} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="text-slate-600">{appointment.doctorName}</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Clock className="h-3 w-3" />
                            {appointment.time}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs">
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center border border-dashed border-slate-300 rounded-xl">
                    <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="space-y-8">
          {/* OPD STATUS CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  OPD Status
                </h3>
                <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium">Live</span>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                  <h2 className="text-5xl font-bold">{currentTokens}</h2>
                  <span className="text-blue-200 text-lg">/ {maxTokens}</span>
                </div>
                <p className="text-blue-100">Tokens Issued Today</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-blue-100">Utilization</span>
                    <span className="font-bold">{utilizationPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-blue-900/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full transition-all duration-1000"
                      style={{ width: `${utilizationPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500/30">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{remainingTokens}</div>
                    <div className="text-sm text-blue-200">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{maxTokens}</div>
                    <div className="text-sm text-blue-200">Capacity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE DOCTORS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              Active Doctors
            </h3>
            
            <div className="space-y-4">
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <span className="font-bold text-emerald-700">
                          {doctor.name.charAt(0)}
                        </span>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                        doctor.status === 'available' ? 'bg-emerald-500' :
                        doctor.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{doctor.name}</p>
                      <p className="text-sm text-slate-600">{doctor.specialization}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{doctor.patientsToday}</p>
                      <p className="text-xs text-slate-500">Today</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <Stethoscope className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No active doctors found</p>
                </div>
              )}
            </div>
            
            <button className="w-full mt-6 py-3 text-center text-blue-600 font-medium border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors">
              View All Doctors
            </button>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-bold text-lg text-red-900 mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Ambulance className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Emergency Ambulance</span>
                </div>
                <Phone className="h-4 w-4 text-red-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Thermometer className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">ICU Emergency</span>
                </div>
                <Phone className="h-4 w-4 text-red-600" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-red-200 hover:border-red-300 hover:bg-red-100 transition-colors">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">Pharmacy</span>
                </div>
                <Phone className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;