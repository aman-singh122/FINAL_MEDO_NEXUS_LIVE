import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  UploadCloud, 
  MoreHorizontal,
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  CalendarDays,
  UserPlus,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Printer,
  Mail,
  MessageSquare
} from "lucide-react";
import { getHospitalAppointments } from "../api/hospital.api";

/* ================= TYPES ================= */
type Appointment = {
  _id: string;
  patient: { name: string; _id: string; age?: number; gender?: string };
  doctor: { doctorName: string; _id: string; department?: string };
  schedule: { date: string; timeSlot: string };
  status: "scheduled" | "completed" | "cancelled" | "pending" | "no-show";
  consultationType?: "new" | "follow-up" | "emergency";
  paymentStatus?: "paid" | "pending" | "unpaid";
};

type StatusFilter = "all" | Appointment["status"];

const HospitalAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"date" | "patient" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  /* ================= DATA FETCHING ================= */
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getHospitalAppointments();
      setAppointments(res.data.appointments);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to fetch appointments");
      console.error("Appointment fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  /* ================= FILTERING & SORTING ================= */
  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments;
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(appt => 
        appt.patient.name.toLowerCase().includes(term) ||
        appt.doctor.doctorName.toLowerCase().includes(term) ||
        appt._id.toLowerCase().includes(term) ||
        appt.schedule.date.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case "date":
          aVal = new Date(a.schedule.date).getTime();
          bVal = new Date(b.schedule.date).getTime();
          break;
        case "patient":
          aVal = a.patient.name.toLowerCase();
          bVal = b.patient.name.toLowerCase();
          break;
        case "status":
          const statusOrder = { scheduled: 0, pending: 1, completed: 2, cancelled: 3, "no-show": 4 };
          aVal = statusOrder[a.status] || 5;
          bVal = statusOrder[b.status] || 5;
          break;
        default:
          return 0;
      }
      
      return sortOrder === "asc" 
        ? (aVal > bVal ? 1 : -1)
        : (aVal > bVal ? -1 : 1);
    });
    
    return filtered;
  }, [appointments, searchTerm, statusFilter, sortBy, sortOrder]);

  /* ================= STATS CALCULATION ================= */
  const appointmentStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: appointments.length,
      today: appointments.filter(a => a.schedule.date === today).length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      pending: appointments.filter(a => a.status === 'pending').length,
    };
  }, [appointments]);

  /* ================= STATUS BADGE COMPONENT ================= */
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      scheduled: {
        bg: "bg-blue-50 border-blue-200",
        text: "text-blue-700",
        icon: <CalendarDays className="h-3 w-3" />
      },
      completed: {
        bg: "bg-emerald-50 border-emerald-200",
        text: "text-emerald-700",
        icon: <CheckCircle className="h-3 w-3" />
      },
      cancelled: {
        bg: "bg-red-50 border-red-200",
        text: "text-red-700",
        icon: <XCircle className="h-3 w-3" />
      },
      pending: {
        bg: "bg-amber-50 border-amber-200",
        text: "text-amber-700",
        icon: <Clock className="h-3 w-3" />
      },
      "no-show": {
        bg: "bg-gray-50 border-gray-200",
        text: "text-gray-700",
        icon: <AlertCircle className="h-3 w-3" />
      }
    };
    
    const config = statusConfig[status] || {
      bg: "bg-gray-50 border-gray-200",
      text: "text-gray-700",
      icon: null
    };
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${config.bg} ${config.text}`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  /* ================= ACTION HANDLERS ================= */
  const handleSelectAll = () => {
    if (selectedAppointments.length === filteredAndSortedAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAndSortedAppointments.map(a => a._id));
    }
  };

  const handleSelectAppointment = (id: string) => {
    setSelectedAppointments(prev =>
      prev.includes(id)
        ? prev.filter(apptId => apptId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action: "complete" | "cancel" | "export") => {
    if (selectedAppointments.length === 0) return;
    alert(`${action} ${selectedAppointments.length} appointment(s)`);
    // Implement actual bulk actions here
  };

  /* ================= RENDER ================= */
  if (error) {
    return (
      <div className="p-6 text-center rounded-xl border border-red-200 bg-red-50">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium mb-2">Error Loading Appointments</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button 
          onClick={fetchAppointments}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Appointments</h1>
          <p className="text-slate-600 mt-2">Manage patient schedules, consultations, and medical reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          
          <button
            onClick={() => navigate("/hospital/appointments/new")}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg font-medium"
          >
            <Calendar className="h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* ================= STATS OVERVIEW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total", value: appointmentStats.total, color: "bg-blue-500", icon: Calendar },
          { label: "Today", value: appointmentStats.today, color: "bg-emerald-500", icon: Clock },
          { label: "Scheduled", value: appointmentStats.scheduled, color: "bg-blue-500", icon: CalendarDays },
          { label: "Completed", value: appointmentStats.completed, color: "bg-emerald-500", icon: CheckCircle },
          { label: "Pending", value: appointmentStats.pending, color: "bg-amber-500", icon: Clock },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= FILTERS & SEARCH BAR ================= */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, doctor, appointment ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            
            {/* Bulk Actions */}
            {selectedAppointments.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction("complete")}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium"
                >
                  Mark Complete ({selectedAppointments.length})
                </button>
                <button
                  onClick={() => setSelectedAppointments([])}
                  className="px-3 py-2 text-slate-600 hover:text-slate-900"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                  >
                    <option value="date">Date</option>
                    <option value="patient">Patient Name</option>
                    <option value="status">Status</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="px-3 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    {sortOrder === "asc" ? "A→Z" : "Z→A"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= APPOINTMENTS TABLE ================= */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          // Loading Skeleton
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-slate-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredAndSortedAppointments.length === 0 ? (
          // Empty State
          <div className="p-12 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "No matching appointments" : "No appointments found"}
            </h3>
            <p className="text-slate-600 max-w-sm mx-auto mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by creating a new appointment for your patients"}
            </p>
            <button
              onClick={() => navigate("/hospital/appointments/new")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <UserPlus className="h-4 w-4" />
              Create New Appointment
            </button>
          </div>
        ) : (
          // Table
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAppointments.length === filteredAndSortedAppointments.length && filteredAndSortedAppointments.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAndSortedAppointments.map((appt) => (
                  <tr 
                    key={appt._id}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    {/* Patient Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.includes(appt._id)}
                          onChange={() => handleSelectAppointment(appt._id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{appt.patient.name}</p>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            {appt.patient.age && <span>Age: {appt.patient.age}</span>}
                            {appt.patient.gender && <span>• {appt.patient.gender}</span>}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Doctor Column */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">Dr. {appt.doctor.doctorName}</p>
                        {appt.doctor.department && (
                          <p className="text-sm text-slate-500">{appt.doctor.department}</p>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {new Date(appt.schedule.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{appt.schedule.timeSlot}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {appt.consultationType || "Follow-up"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(appt.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/hospital/appointments/${appt._id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => navigate(`/hospital/upload-report/${appt._id}`)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          Report
                        </button>
                        
                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {!loading && filteredAndSortedAppointments.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredAndSortedAppointments.length}</span> appointments
              {searchTerm && (
                <span className="ml-2">matching "<span className="font-semibold">{searchTerm}</span>"</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-3 py-1.5 text-sm font-medium text-slate-700">1</span>
              <button className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-100">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= QUICK ACTIONS PANEL ================= */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <Printer className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Print Schedule</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <Download className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Export Data</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <Mail className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Send Reminders</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
            <MessageSquare className="h-6 w-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium">Bulk SMS</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalAppointments;