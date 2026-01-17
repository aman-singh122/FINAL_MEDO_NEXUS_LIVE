import { useEffect, useState, useCallback } from "react";
import { getHospitalDoctors } from "../api/hospital.api";
import { 
  User, 
  Stethoscope, 
  Briefcase, 
  Wallet, 
  RefreshCw, 
  Search,
  ChevronRight
} from "lucide-react"; // Note: Install lucide-react for icons

/* ================= TYPES ================= */
type Doctor = {
  _id: string;
  name: string;
  qualification?: string;
  specialization?: string;
  departments?: string[];
  experienceYears?: number;
  consultationFee?: number;
  status?: "active" | "inactive";
};

const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getHospitalDoctors();
      setDoctors(res.data.doctors || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to connect to medical records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= UI COMPONENTS ================= */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Syncing Medical Staff...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Medical Practitioners
          </h1>
          <p className="text-slate-500 mt-1">Manage and view all registered hospital specialists.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text"
                    placeholder="Search name or specialty..."
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={fetchDoctors}
                className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                title="Refresh List"
            >
                <RefreshCw className="w-5 h-5 text-slate-600" />
            </button>
        </div>
      </div>

      {error ? (
        <div className="p-4 flex items-center gap-3 text-red-700 bg-red-50 border border-red-100 rounded-2xl">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">!</div>
          <p className="font-medium">{error}</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No practitioners found</h3>
          <p className="text-slate-500">Try adjusting your search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div 
              key={doc._id} 
              className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Dr. {doc.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                      {doc.specialization || "General Physician"}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                    doc.status === "active" 
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                    : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                  {doc.status === "active" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {doc.status || "offline"}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center text-sm text-slate-600">
                  <Briefcase className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="font-medium">{doc.experienceYears ?? 0} Years Experience</span>
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <Wallet className="w-4 h-4 mr-3 text-slate-400" />
                  <span className="font-medium text-slate-900">₹{doc.consultationFee ?? "N/A"}</span>
                  <span className="ml-1 text-slate-400 text-xs">Consultation Fee</span>
                </div>
              </div>

              <button className="w-full mt-6 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-all">
                View Profile
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalDoctors;