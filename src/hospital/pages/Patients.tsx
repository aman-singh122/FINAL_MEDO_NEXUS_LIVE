import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getHospitalPatients } from "../api/hospital.api";
import { 
  Phone, 
  MapPin, 
  Users, 
  Loader2, 
  AlertCircle, 
  ChevronRight,
  User,
  Droplets,
  Search,
  Filter,
  Calendar,
  Activity,
  Shield,
  FileText,
  Eye,
  Edit,
  MessageSquare,
  Mail,
  Download,
  RefreshCw,
  Plus,
  MoreVertical,
  Tag,
  Clock,
  Stethoscope,
  AlertTriangle
} from "lucide-react";

/* ================= TYPES ================= */
type Patient = {
  _id: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  bloodGroup?: string;
  address?: {
    city?: string;
    district?: string;
    state?: string;
  };
  lastVisit?: string;
  nextAppointment?: string;
  status?: "active" | "inactive" | "critical";
  medicalHistory?: {
    allergies?: string[];
    chronicConditions?: string[];
    lastCheckup?: string;
  };
};

const HospitalPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  /* ================= FETCH PATIENTS ================= */
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await getHospitalPatients();
      setPatients(res.data.patients || []);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch patients");
      console.error("Patient fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  /* ================= FILTERED & SORTED PATIENTS ================= */
  const filteredPatients = useMemo(() => {
    let filtered = [...patients];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(patient =>
        patient.name.toLowerCase().includes(term) ||
        patient.phone?.includes(term) ||
        patient.bloodGroup?.toLowerCase().includes(term) ||
        patient.address?.city?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(patient => patient.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "age":
          return (a.age || 0) - (b.age || 0);
        case "lastVisit":
          return new Date(b.lastVisit || 0).getTime() - new Date(a.lastVisit || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [patients, searchTerm, statusFilter, sortBy]);

  /* ================= STATISTICS ================= */
  const patientStats = useMemo(() => {
    const stats = {
      total: patients.length,
      active: patients.filter(p => p.status === "active").length,
      critical: patients.filter(p => p.status === "critical").length,
      pendingVisits: patients.filter(p => p.nextAppointment).length,
      todayVisits: patients.filter(p => {
        if (!p.nextAppointment) return false;
        const today = new Date().toISOString().split('T')[0];
        return p.nextAppointment.startsWith(today);
      }).length
    };
    return stats;
  }, [patients]);

  /* ================= STATUS BADGE COMPONENT ================= */
  const getStatusBadge = (status?: string) => {
    const config = {
      active: { bg: "bg-emerald-50", text: "text-emerald-700", icon: "●" },
      inactive: { bg: "bg-slate-100", text: "text-slate-600", icon: "○" },
      critical: { bg: "bg-red-50", text: "text-red-700", icon: "⚠" },
    }[status || "inactive"] || { bg: "bg-slate-100", text: "text-slate-600", icon: "○" };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <span className="text-xs">{config.icon}</span>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Inactive"}
      </span>
    );
  };

  /* ================= LOADING STATE ================= */
  if (loading && patients.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-96 bg-slate-200 rounded mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-12 bg-slate-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-20 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= ERROR STATE ================= */
  if (error && patients.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Unable to Load Patients</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchPatients}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Patient Management</h1>
            <p className="text-slate-600 mt-2">Comprehensive patient records and health monitoring</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPatients}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            
            <Link
              to="/hospital/patients/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Patient
            </Link>
          </div>
        </div>

        {/* ================= STATS DASHBOARD ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { 
              label: "Total Patients", 
              value: patientStats.total, 
              icon: Users, 
              color: "bg-blue-500", 
              change: "+12%"
            },
            { 
              label: "Active Patients", 
              value: patientStats.active, 
              icon: Activity, 
              color: "bg-emerald-500",
              change: "+8%"
            },
            { 
              label: "Critical Cases", 
              value: patientStats.critical, 
              icon: AlertTriangle, 
              color: "bg-red-500",
              change: "+3"
            },
            { 
              label: "Scheduled Today", 
              value: patientStats.todayVisits, 
              icon: Calendar, 
              color: "bg-purple-500",
              change: "Now"
            },
            { 
              label: "Pending Visits", 
              value: patientStats.pendingVisits, 
              icon: Clock, 
              color: "bg-amber-500",
              change: "+5"
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= FILTERS & SEARCH ================= */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients by name, phone, ID, or location..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3">
              <select
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="critical">Critical</option>
              </select>

              <select
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
                <option value="lastVisit">Sort by Last Visit</option>
              </select>

              <button className="p-2.5 border border-slate-300 rounded-lg hover:bg-slate-50">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{filteredPatients.length}</span> patients
                {searchTerm && (
                  <span className="ml-2">
                    matching "<span className="font-semibold">{searchTerm}</span>"
                  </span>
                )}
              </p>
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                <Download className="w-4 h-4" />
                Export List
              </button>
            </div>
          </div>
        </div>

        {/* ================= PATIENTS GRID/TABLE ================= */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm ? "No matching patients found" : "No patients in database"}
            </h3>
            <p className="text-slate-600 max-w-sm mx-auto mb-6">
              {searchTerm 
                ? "Try adjusting your search criteria or add a new patient"
                : "Start by adding your first patient to the system"}
            </p>
            <Link
              to="/hospital/patients/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Add First Patient
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                {/* Patient Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {patient.name?.charAt(0).toUpperCase() || "P"}
                        </div>
                        {patient.status === "critical" && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <AlertTriangle className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {patient.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          {getStatusBadge(patient.status)}
                          <span className="text-sm text-slate-500">ID: {patient._id?.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="p-6 space-y-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Age / Gender</p>
                      <p className="font-medium text-slate-900">
                        {patient.age ? `${patient.age} yrs` : "N/A"} • {patient.gender || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500">Blood Group</p>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-red-500" />
                        <span className="font-bold text-red-600">{patient.bloodGroup || "Unknown"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">{patient.phone || "No phone"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">
                        {patient.address?.city || "Unknown location"}
                        {patient.address?.district && `, ${patient.address.district}`}
                      </span>
                    </div>
                  </div>

                  {/* Medical Info */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "Never"}
                        </span>
                      </div>
                      {patient.nextAppointment && (
                        <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3 mr-1" />
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-colors">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-white rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                    <Link
                      to={`/hospital/patients/${patient._id}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Profile
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= QUICK ACTIONS ================= */}
        {filteredPatients.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Send Reminders</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
                <Download className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Export Records</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Assign Doctor</span>
              </button>
              <button className="flex items-center gap-3 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Access Logs</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= FOOTER STATS ================= */}
        <div className="text-center py-4 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{patients.length}</span> total patients in database • 
            <span className="font-semibold text-emerald-600 mx-2">{patientStats.active}</span> active • 
            <span className="font-semibold text-red-600 mx-2">{patientStats.critical}</span> critical cases
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalPatients;