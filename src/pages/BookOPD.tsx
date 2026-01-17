import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { bookOpd } from "@/api/opd.api";
import { getAllHospitals } from "@/api/hospital.api";
import { getDoctorsByHospital } from "@/api/doctor.api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { socket } from "@/socket";
import { format, addDays, isSameDay } from "date-fns";

import {
  Building2,
  Stethoscope,
  User,
  Clock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  IndianRupee,
  CalendarCheck,
  Sparkles,
  Calendar as CalendarIcon,
  Sun,
  Sunset,
  Moon,
  Receipt,
  ShieldCheck,
  Printer,
  AlertCircle,
  Info,
  XCircle,
  ChevronRight,
  Star,
  Zap,
  Users,
} from "lucide-react";

/* ================= TYPES ================= */
interface Hospital {
  _id: string;
  name: string;
  type: "govt" | "private";
  address?: { city?: string };
  departments: string[];
}

interface Doctor {
  _id: string;
  name: string;
  qualification: string;
  departments: string[];
  opdSchedule?: { shift: "morning" | "evening" };
  consultationFee: number;
  crowdLevel?: "low" | "medium" | "high";
  currentWaitTime?: number;
}

const steps = [
  { number: 1, title: "Hospital", icon: Building2 },
  { number: 2, title: "Specialty", icon: Stethoscope },
  { number: 3, title: "Doctor", icon: User },
  { number: 4, title: "Schedule", icon: Clock },
  { number: 5, title: "Confirm", icon: CheckCircle2 },
];

const BookOPD = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLimitError, setBookingLimitError] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on(
      "crowdUpdate",
      (data: { doctorId: string; crowdLevel: string; waitTime: number }) => {
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id === data.doctorId
              ? {
                  ...doc,
                  crowdLevel: data.crowdLevel as any,
                  currentWaitTime: data.waitTime,
                }
              : doc
          )
        );
      }
    );
    return () => {
      socket.off("crowdUpdate");
    };
  }, []);

  useEffect(() => {
    getAllHospitals().then((res) => setHospitals(res.data.hospitals));
  }, []);

  useEffect(() => {
    if (selectedHospital) {
      const h = hospitals.find((h) => h._id === selectedHospital);
      setDepartments(h?.departments || []);
      setSelectedDepartment(null);
      setSelectedDoctor(null);
    }
  }, [selectedHospital, hospitals]);

  useEffect(() => {
    if (selectedHospital && selectedDepartment) {
      getDoctorsByHospital(selectedHospital).then((res) => {
        const filtered = res.data.doctors.filter((d: Doctor) =>
          d.departments.includes(selectedDepartment)
        );
        setDoctors(filtered);
      });
    }
  }, [selectedHospital, selectedDepartment]);

  const dateStrip = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => addDays(new Date(), i));
  }, []);

  const timeSlots = useMemo(
    () => ({
      morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
      afternoon: ["12:00", "13:00", "14:00", "15:00", "16:00"],
      evening: ["17:00", "17:30", "18:00", "18:30", "19:00"],
    }),
    []
  );

  const handleNext = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const handleBack = () => {
    setBookingLimitError(false);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const getCrowdStyles = (level?: string) => {
    const styles = {
      low: "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 border-emerald-200",
      medium: "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 border-amber-200",
      high: "bg-gradient-to-r from-rose-50 to-red-50 text-rose-600 border-rose-200",
    };
    return level
      ? styles[level as keyof typeof styles]
      : "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-400 border-slate-200";
  };

  const getWaitTimeText = (waitTime?: number) => {
    if (!waitTime) return "Live update";
    if (waitTime < 15) return "Less than 15 min";
    if (waitTime < 30) return "15-30 min";
    return "30+ min";
  };

  const handleConfirm = async () => {
    setLoading(true);
    setBookingLimitError(false);

    const doctor = doctors.find((d) => d._id === selectedDoctor);
    const hospital = hospitals.find((h) => h._id === selectedHospital);

    if (!doctor || !hospital || !selectedDepartment || !selectedSlot) {
      alert("Please complete all steps before booking");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        hospitalId: hospital._id,
        doctorId: doctor._id,
        department: selectedDepartment,

        schedule: {
          date: selectedDate.toISOString(),
          timeSlot: selectedSlot,
        },

        patient: {
          name: user.name,
          age: 25,
          gender: "male",
          phone: user.phone,
        },

        fees: {
          registrationFee: 20,
          consultationFee: doctor.consultationFee,
          totalAmount: 20 + doctor.consultationFee,
        },

        source: "web",
      };

      const res = await bookOpd(payload);

      setAppointmentData(res.data.appointment);
      setBookingSuccess(true);
    } catch (err: any) {
      if (
        err.response?.status === 400 &&
        err.response?.data?.message?.includes("2 OPD")
      ) {
        setBookingLimitError(true);
      } else {
        console.error("Booking error:", err);
        alert(err.response?.data?.message || "Booking failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUCCESS STATE ================= */
  if (bookingSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1">
                    Booking Confirmed
                  </div>
                  <h1 className="text-5xl font-black text-slate-900 leading-tight">
                    Your Appointment <br />
                    is <span className="text-emerald-600">Confirmed</span>
                  </h1>
                </div>
              </div>
              
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                Your registration is complete and your token has been generated. 
                Please arrive 15 minutes before your scheduled time.
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Estimated Wait Time</p>
                    <p className="text-xs text-slate-500">Based on current crowd levels</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  className="h-14 px-8 rounded-xl font-bold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-lg"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-3 w-5 h-5" /> Print Token & Receipt
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-50"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>

            {/* Right Card - Token */}
            <div className="relative group mx-auto w-full max-w-[420px]">
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <Card className="relative bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* Token Header */}
                <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
                          Digital OPD Token
                        </p>
                        {appointmentData?.token?.tokenNumber ? (
                          <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black tracking-tighter">
                              #{appointmentData.token.tokenNumber}
                            </span>
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                              ACTIVE
                            </Badge>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-300 font-semibold">
                            Token will be assigned at hospital
                          </p>
                        )}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <CalendarIcon size={20} className="text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                      <CalendarIcon size={16} />
                      <span>{format(new Date(appointmentData?.schedule.date), "EEEE, MMMM do, yyyy")}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                      <Clock size={16} />
                      <span>{appointmentData?.schedule.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Dashed Line */}
                <div className="relative h-8 bg-white">
                  <div className="absolute top-0 left-0 w-full h-px border-t-2 border-dashed border-slate-200"></div>
                  <div className="absolute -left-4 -top-4 w-8 h-8 bg-slate-100 rounded-full"></div>
                  <div className="absolute -right-4 -top-4 w-8 h-8 bg-slate-100 rounded-full"></div>
                </div>

                {/* Token Details */}
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                        Patient Details
                      </label>
                      <p className="font-bold text-lg text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        OPD Registration
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">
                        Department
                      </label>
                      <p className="font-bold text-lg text-slate-900">
                        {appointmentData?.department}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        Walk-in
                      </Badge>
                    </div>
                  </div>

                  {/* Doctor Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                      <Stethoscope size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-lg">
                        Dr. {appointmentData?.doctor.doctorName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs font-medium text-slate-600">
                          {appointmentData?.doctor.qualification}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-slate-700">4.8</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 font-medium">
                        Please carry your original ID and this token for verification. 
                        Arrive 15 minutes before your scheduled time.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ================= MAIN RENDER ================= */
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Book OPD Appointment</h1>
              <p className="text-slate-500 mt-2">Complete your registration in 5 simple steps</p>
            </div>
            <Badge variant="outline" className="font-bold">
              Step {currentStep} of 5
            </Badge>
          </div>

          {/* Enhanced Stepper */}
          <div className="relative mb-12">
            <div className="flex justify-between max-w-3xl mx-auto relative">
              {steps.map((s) => (
                <div key={s.number} className="z-10 flex flex-col items-center">
                  <div className="relative">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 shadow-lg",
                        currentStep === s.number
                          ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-900 text-white scale-110"
                          : currentStep > s.number
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500 border-emerald-500 text-white"
                          : "bg-white border-slate-200 text-slate-400"
                      )}
                    >
                      <s.icon size={22} />
                      {currentStep > s.number && (
                        <CheckCircle2 className="absolute -top-1 -right-1 h-6 w-6 text-white bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-4 font-bold uppercase tracking-wider transition-colors",
                      currentStep >= s.number
                        ? "text-slate-900"
                        : "text-slate-400"
                    )}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
            {/* Progress Bar */}
            <div className="absolute top-7 left-0 right-0 h-2 bg-slate-100 -z-10 max-w-3xl mx-auto" />
            <div
              className="absolute top-7 left-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 -z-10 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                maxWidth: "calc(100% - 56px)",
                marginLeft: "28px"
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[500px] bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          {/* STEP 1: Hospital Selection */}
          {currentStep === 1 && (
            <div className="animate-in fade-in-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Hospital</h2>
                  <p className="text-slate-500">Choose your preferred medical facility</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {hospitals.map((h) => (
                  <Card
                    key={h._id}
                    onClick={() => setSelectedHospital(h._id)}
                    className={cn(
                      "p-6 cursor-pointer border-2 transition-all hover:shadow-lg hover:-translate-y-1 rounded-2xl",
                      selectedHospital === h._id
                        ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-start gap-5">
                      <div className="relative">
                        <div
                          className={cn(
                            "w-16 h-16 rounded-xl flex items-center justify-center transition-all",
                            selectedHospital === h._id
                              ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                              : "bg-slate-100 text-slate-400"
                          )}
                        >
                          <Building2 size={28} />
                        </div>
                        {h.type === "private" && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 text-xs">
                              PREMIUM
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-lg text-slate-900">{h.name}</h3>
                          <Badge
                            variant={h.type === "govt" ? "secondary" : "outline"}
                            className={cn(
                              "text-xs font-bold uppercase",
                              h.type === "govt" 
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {h.type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-slate-500 font-medium mb-4">
                          <MapPin size={16} className="mr-2" /> {h.address?.city || "City not specified"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {h.departments.slice(0, 3).map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                          {h.departments.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{h.departments.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Department Selection */}
          {currentStep === 2 && (
            <div className="animate-in fade-in-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Specialty</h2>
                  <p className="text-slate-500">Choose the department for your consultation</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {departments.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDepartment(d)}
                    className={cn(
                      "p-8 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center gap-5 hover:shadow-lg hover:-translate-y-1",
                      selectedDepartment === d
                        ? "bg-gradient-to-br from-purple-600 to-pink-600 border-purple-600 text-white shadow-xl scale-105"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                        selectedDepartment === d 
                          ? "bg-white/20" 
                          : "bg-slate-50"
                      )}
                    >
                      <Sparkles
                        size={24}
                        className={selectedDepartment === d ? "text-white" : "text-slate-400"}
                      />
                    </div>
                    <span className="font-bold text-sm capitalize tracking-tight">
                      {d}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Doctor Selection */}
          {currentStep === 3 && (
            <div className="animate-in fade-in-50">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
                  <User className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Select Doctor</h2>
                  <p className="text-slate-500">Choose from available specialists</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {doctors.map((d) => (
                  <Card
                    key={d._id}
                    onClick={() => setSelectedDoctor(d._id)}
                    className={cn(
                      "p-6 cursor-pointer border-2 transition-all hover:shadow-lg hover:-translate-y-1 rounded-2xl",
                      selectedDoctor === d._id
                        ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50"
                        : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div
                            className={cn(
                              "w-16 h-16 rounded-xl flex items-center justify-center",
                              selectedDoctor === d._id
                                ? "bg-gradient-to-br from-emerald-600 to-teal-600 text-white"
                                : "bg-slate-100 text-slate-400"
                            )}
                          >
                            <User size={28} />
                          </div>
                          <div className="absolute -bottom-2 -right-2">
                            <Badge
                              className={cn(
                                "text-[9px] font-black border uppercase tracking-widest",
                                getCrowdStyles(d.crowdLevel)
                              )}
                            >
                              {d.crowdLevel || "Live"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{d.name}</h3>
                          <p className="text-sm text-slate-600 font-medium mb-2">{d.qualification}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Users size={12} />
                              <span>{getWaitTimeText(d.currentWaitTime)}</span>
                            </div>
                            {d.crowdLevel && (
                              <div className="h-1.5 w-1.5 rounded-full bg-slate-300"></div>
                            )}
                            <div className="flex items-center gap-1 text-xs font-medium">
                              <Zap size={12} className="text-amber-500" />
                              <span>Available Today</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 flex items-baseline justify-end">
                          <IndianRupee size={18} className="mr-1" />
                          {d.consultationFee}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                          Consultation Fee
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Schedule Selection */}
          {currentStep === 4 && (
            <div className="space-y-10 animate-in slide-in-from-right-10 duration-300">
              {/* Date Selection */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                    <CalendarIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Select Date & Time</h2>
                    <p className="text-slate-500">Choose your preferred appointment slot</p>
                  </div>
                </div>
                
                {/* Date Strip */}
                <div className="flex gap-3 overflow-x-auto pb-6 -mx-1 px-1">
                  {dateStrip.map((date) => (
                    <button
                      key={date.toString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        "flex flex-col items-center min-w-[85px] p-5 rounded-2xl border-2 transition-all shrink-0 hover:shadow-md",
                        isSameDay(date, selectedDate)
                          ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-900 text-white shadow-lg scale-105"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-wider mb-2">
                        {format(date, "EEE")}
                      </span>
                      <span className="text-2xl font-black mb-1">
                        {format(date, "d")}
                      </span>
                      <span className="text-xs font-medium opacity-70">
                        {format(date, "MMM")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-600" />
                    <span className="font-bold text-slate-900">Available Time Slots</span>
                  </div>
                  <Badge variant="outline" className="font-medium">
                    {format(selectedDate, "EEEE, MMMM do")}
                  </Badge>
                </div>

                {[
                  { label: "Morning", icon: Sun, slots: timeSlots.morning, color: "text-blue-600" },
                  { label: "Afternoon", icon: Sunset, slots: timeSlots.afternoon, color: "text-amber-600" },
                  { label: "Evening", icon: Moon, slots: timeSlots.evening, color: "text-purple-600" },
                ].map((section) => (
                  <div key={section.label} className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <section.icon className={cn("h-5 w-5", section.color)} />
                      <span>{section.label} Session</span>
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {section.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "py-4 rounded-xl text-sm font-bold transition-all border-2 hover:shadow-md",
                            selectedSlot === slot
                              ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-900 text-white shadow-lg"
                              : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {currentStep === 5 && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-10 duration-500">
              {bookingLimitError ? (
                /* Limit Reached UI */
                <Card className="border-none shadow-2xl overflow-hidden rounded-3xl bg-gradient-to-br from-white to-slate-50">
                  <div className="p-12 text-center space-y-8">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-red-100 rounded-full flex items-center justify-center animate-pulse">
                          <XCircle className="h-12 w-12 text-rose-600" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-4 border-rose-200 animate-ping opacity-70"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                        Daily Limit Reached
                      </h2>
                      <p className="text-slate-600 font-medium max-w-lg mx-auto leading-relaxed text-lg">
                        To ensure fair access for all patients, we only allow{" "}
                        <span className="font-bold text-slate-900">2 OPD bookings per day</span>.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 max-w-lg mx-auto">
                      <div className="flex items-start gap-4">
                        <Info className="text-blue-600 shrink-0 mt-1" size={24} />
                        <div className="text-left">
                          <p className="text-sm text-blue-800 leading-relaxed font-medium">
                            Your previous bookings are already confirmed. You can view them in your 
                            appointments dashboard or try booking for a different date.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-4 max-w-sm mx-auto">
                      <Button
                        onClick={() => (window.location.href = "/dashboard")}
                        className="h-14 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 font-bold text-lg hover:shadow-lg"
                      >
                        View My Appointments
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setBookingLimitError(false);
                          setCurrentStep(4);
                        }}
                        className="font-bold text-slate-600 hover:text-slate-900"
                      >
                        ← Change Booking Date
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                /* Regular Confirmation Panel */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Summary Card */}
                  <Card className="lg:col-span-2 border-slate-200 rounded-2xl shadow-sm">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
                          <Receipt className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Appointment Summary</h2>
                          <p className="text-slate-500">Review your booking details</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Hospital */}
                        <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl border border-blue-100">
                          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-blue-600 border border-blue-200">
                            <Building2 size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Medical Facility
                            </p>
                            <p className="font-bold text-xl text-slate-900 mb-1">
                              {hospitals.find((h) => h._id === selectedHospital)?.name}
                            </p>
                            <p className="text-slate-600 font-medium">
                              General OPD Department
                            </p>
                          </div>
                        </div>

                        {/* Schedule */}
                        <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl border border-amber-100">
                          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-amber-600 border border-amber-200">
                            <CalendarCheck size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Schedule Details
                            </p>
                            <div className="flex items-center gap-6">
                              <div>
                                <p className="font-bold text-xl text-slate-900">
                                  {format(selectedDate, "EEEE, MMMM do")}
                                </p>
                                <p className="text-slate-600 font-medium mt-1">
                                  Arrive by {selectedSlot}
                                </p>
                              </div>
                              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                {selectedSlot?.endsWith("AM") ? "Morning" : "Afternoon"} Session
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Doctor */}
                        <div className="flex items-start gap-5 p-5 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl border border-emerald-100">
                          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-emerald-600 border border-emerald-200">
                            <User size={24} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                              Consulting Doctor
                            </p>
                            <p className="font-bold text-xl text-slate-900 mb-1">
                              Dr. {doctors.find((d) => d._id === selectedDoctor)?.name}
                            </p>
                            <p className="text-slate-600 font-medium">
                              {doctors.find((d) => d._id === selectedDoctor)?.qualification}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <Badge variant="outline" className="bg-white">
                                {selectedDepartment}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                <span className="text-sm font-bold">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                          <div className="flex items-start gap-4">
                            <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={24} />
                            <div>
                              <p className="font-bold text-blue-900 mb-2">Important Instructions</p>
                              <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2"></div>
                                  <span>Carry your original ID card for verification</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2"></div>
                                  <span>Arrive 15 minutes before your scheduled time</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2"></div>
                                  <span>Payment to be made at the hospital counter</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Billing Card */}
                  <Card className="border-slate-200 rounded-2xl shadow-sm">
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                          <IndianRupee className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-900">Billing Summary</h2>
                          <p className="text-slate-500">Payment at counter</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Consultation Fee</span>
                            <span className="font-bold text-slate-900">
                              ₹{doctors.find((d) => d._id === selectedDoctor)?.consultationFee}.00
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 font-medium">Registration Fee</span>
                            <span className="font-bold text-slate-900">₹20.00</span>
                          </div>
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                              Total Amount
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-black text-slate-900">
                                ₹{(doctors.find((d) => d._id === selectedDoctor)?.consultationFee || 0) + 20}
                              </span>
                              <span className="text-sm font-bold text-slate-400">.00</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Inclusive of all taxes
                          </p>
                        </div>

                        <div className="pt-6">
                          <Button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="w-full h-14 rounded-xl font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-800 hover:shadow-xl hover:from-slate-800 hover:to-slate-700 transition-all"
                          >
                            {loading ? (
                              <span className="flex items-center gap-2">
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Processing...
                              </span>
                            ) : (
                              "Confirm & Book"
                            )}
                          </Button>
                          <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                            You can cancel or reschedule up to 2 hours before the appointment
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-10 pt-8 border-t border-slate-200">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="rounded-xl h-12 px-8 font-bold border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400"
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Previous Step
            </Button>

            <div className="flex items-center gap-6">
              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 && !selectedHospital) ||
                    (currentStep === 2 && !selectedDepartment) ||
                    (currentStep === 3 && !selectedDoctor) ||
                    (currentStep === 4 && !selectedSlot)
                  }
                  className="rounded-xl h-12 px-10 font-bold bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-lg hover:shadow-xl transition-all"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                !bookingLimitError && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium mb-2">
                      Review your details before confirming
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookOPD;