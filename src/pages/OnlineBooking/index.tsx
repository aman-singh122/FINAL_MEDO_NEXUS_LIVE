import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import API from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  ShieldCheck, 
  ChevronLeft,
  Info
} from "lucide-react";
import { toast } from "sonner";

const OnlineBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "02:00 PM", "02:30 PM", "03:00 PM"
  ];

useEffect(() => {
  const fetchDoctor = async () => {
    try {
      const res = await API.get(`/doctor/${doctorId}`);

      // 🔴 DEBUG LINE (IMPORTANT)
      console.log("DOCTOR FROM API 👉", res.data.doctor.name);

      setDoctor(res.data.doctor);
    } catch (err) {
      toast.error("Unable to load doctor profile");
      navigate("/consult");
    }
  };
  fetchDoctor();
}, [doctorId, navigate]);


  const handleConfirm = async () => {
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select both date and time");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/appointments/online", {
        doctorId,
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedSlot,
      });
      toast.success("Consultation booked successfully!");
      navigate("/appointments"); // ✅ corrected route
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!doctor) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // ✅ CLEAN NAME (removes ALL leading Dr.)
  const cleanDoctorName = doctor.name?.replace(/^(Dr\.?\s*)+/i, "");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2 text-slate-500 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Doctors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Book Video Consult
              </h1>
              <p className="text-slate-500">
                Select your preferred date and time for the online OPD.
              </p>
            </section>

            <Card>
              <div className="bg-slate-50 px-6 py-3 border-b flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">1. Select Date</span>
              </div>
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                />
              </CardContent>
            </Card>

            <Card>
              <div className="bg-slate-50 px-6 py-3 border-b flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">2. Available Time Slots</span>
              </div>
              <CardContent className="p-6 grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 rounded-xl text-sm font-medium border ${
                      selectedSlot === slot
                        ? "bg-primary text-white"
                        : "bg-white text-slate-600 hover:border-primary"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {cleanDoctorName?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Dr. {cleanDoctorName}
                    </h2>
                    <p className="text-xs text-slate-500 uppercase">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <Badge className="bg-blue-50 text-blue-700">
                      <Video className="w-3 h-3 mr-1" /> Online
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span className="font-bold">₹{doctor.onlineConsultation?.fee}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  disabled={!selectedSlot || isSubmitting}
                  onClick={handleConfirm}
                >
                  {isSubmitting ? "Processing..." : "Confirm & Pay"}
                </Button>

                <p className="text-[11px] text-center mt-3 text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Secure Healthcare Encryption Active
                </p>
              </CardContent>
            </Card>

            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-amber-600" />
              <p className="text-xs text-amber-800">
                Please ensure stable internet. Video link will be shared 10 mins before.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnlineBooking;
