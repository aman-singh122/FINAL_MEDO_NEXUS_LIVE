import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Star, CheckCircle2, MapPin, Clock } from "lucide-react";

interface DoctorCardProps {
  doctor: any;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 ease-in-out relative overflow-hidden">
      
      {/* Top Section: Profile & Info */}
      <div className="flex gap-5">
        {/* Avatar with Status Indicator */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-primary font-bold text-2xl border border-slate-100">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="h-full w-full object-cover rounded-2xl" />
            ) : (
              doctor.name?.charAt(0)
            )}
          </div>
          {/* Status Dot (e.g., Online/Available) */}
          <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 border-4 border-white rounded-full"></span>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-xl text-slate-900 leading-tight tracking-tight">
              + {doctor.name}
            </h3>
            <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
          </div>
          
          <p className="text-sm font-medium text-slate-600 mb-1">
            {doctor.qualification}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 px-2 py-0 text-xs font-semibold">
              {doctor.specialization}
            </Badge>
            {doctor.experienceYears && (
              <span className="text-xs text-slate-500 font-medium">
                • {doctor.experienceYears} Years Exp.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Details Grid */}
      <div className="mt-5 grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-md">
            <MapPin className="w-4 h-4 text-slate-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Location</p>
            <p className="text-sm text-slate-700 truncate font-medium">
              {doctor.clinic?.city || "Remote"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-100 rounded-md">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Rating</p>
            <p className="text-sm text-slate-700 font-medium">4.8 (120+ Reviews)</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Pricing & Action */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <p className="text-xs text-slate-500 font-medium">Consultation Fee</p>
          <p className="text-2xl font-bold text-slate-900">
            ₹{doctor.onlineConsultation?.fee}
          </p>
        </div>

        <Button
          className="rounded-xl px-6 h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95"
          onClick={() => navigate(`/consult/book/${doctor._id}`)}
        >
          Book Appointment
        </Button>
      </div>

      {/* Optional: Next Available Slot indicator */}
      <div className="mt-4 flex items-center gap-2 text-[13px] text-emerald-600 font-medium bg-emerald-50/50 p-2 rounded-lg">
        <Clock className="w-4 h-4" />
        <span>Available Today</span>
      </div>
    </div>
  );
};

export default DoctorCard;