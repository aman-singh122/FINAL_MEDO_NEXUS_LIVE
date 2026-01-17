import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAppointmentById, cancelOpd } from "@/api/opd.api";
import {
  Calendar,
  Clock,
  Building2,
  User,
  Printer,
  ArrowLeft,
  Phone,
  MapPin,
  AlertTriangle,
  Video,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  PartyPopper,
  Download,
  Share2,
  Info,
  Copy,
  Check,
  CreditCard,
  Receipt,
  History,
  AlertCircle,
  HelpCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/**
 * AppointmentDetail Component
 * An exhaustive view for medical appointments including OPD and Tele-consultation.
 */
const AppointmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // State Management
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Success detection
  const isConfirmedNow =
    location.state?.newBooking ||
    new URLSearchParams(location.search).get("success") === "true";

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await getAppointmentById(id);
      setAppointment(res.data.appointment);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Critical error: Unable to sync with health records.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Logic Helpers
  const isOnline =
    appointment?.bookingType === "online" ||
    appointment?.appointmentType === "online";
  const status = appointment?.status?.toLowerCase();

  const isJoinAllowed = () => {
    return true;
    // if (!appointment?.schedule) return false;
    // const [hours, minutes] = appointment.schedule.timeSlot.split(':');
    // const appointmentTime = new Date(appointment.schedule.date);
    // appointmentTime.setHours(parseInt(hours), parseInt(minutes));

    // const now = new Date();
    // const diff = (appointmentTime.getTime() - now.getTime()) / (1000 * 60);
    // return diff <= 10 && diff >= -45; // 10 mins before to 45 mins after
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Reference ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    toast.info("Preparing document for print...");
    setTimeout(() => window.print(), 500);
  };

  const handleCancelOpd = async () => {
    if (!appointment?._id) return;
    if (cancelReason.length < 5) {
      return toast.error("Please provide a valid reason for cancellation.");
    }
    try {
      setCancelLoading(true);
      await cancelOpd(appointment._id, cancelReason);
      toast.success("Appointment successfully retracted.");
      setShowCancelModal(false);
      fetchDetails(); // Refresh state
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Server rejected cancellation request."
      );
    } finally {
      setCancelLoading(false);
    }
  };

  // UI Components: Loading Skeleton
  if (loading)
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto p-10 animate-pulse space-y-8">
          <div className="h-12 w-48 bg-slate-200 rounded-full mb-10" />
          <div className="h-64 bg-slate-200 rounded-[2.5rem]" />
          <div className="grid grid-cols-2 gap-6">
            <div className="h-40 bg-slate-200 rounded-3xl" />
            <div className="h-40 bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </DashboardLayout>
    );

  // UI Components: Error State
  if (!appointment)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Card className="max-w-md border-none shadow-2xl text-center p-10 rounded-[3rem]">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Record Missing
            </h2>
            <p className="text-slate-500 mb-8">
              This appointment link is expired or the record has been
              permanently archived.
            </p>
            <Button
              onClick={() => navigate("/appointments")}
              className="w-full rounded-2xl py-6"
            >
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#f8fafc] pb-20">
        {/* SUCCESS BANNER */}
        {isConfirmedNow && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-14 px-6 relative overflow-hidden">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
              <div className="bg-white/20 p-4 rounded-full mb-6 animate-bounce">
                <PartyPopper size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Booking Secured!
              </h1>
              <p className="text-emerald-50 text-xl opacity-90 max-w-2xl">
                Your consultation with{" "}
                <span className="font-bold underline">
                  Dr. {appointment.doctor?.doctorName}
                </span>{" "}
                is confirmed. Reference:{" "}
                <span className="font-mono bg-black/20 px-2 rounded">
                  {appointment.appointmentId}
                </span>
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button
                  onClick={handlePrint}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 rounded-full px-8 h-12 font-bold shadow-xl"
                >
                  <Printer className="mr-2" size={18} /> Download Slip
                </Button>
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10 rounded-full px-8 h-12"
                  onClick={() => navigate("/appointments")}
                >
                  Manage All Bookings
                </Button>
              </div>
            </div>
            {/* Abstract shapes */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />
          </div>
        )}

        <div className="max-w-5xl mx-auto px-6">
          {/* NAVIGATION & ACTIONS */}
          <div className="flex flex-wrap justify-between items-center py-8 gap-4 print:hidden">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="rounded-full bg-white shadow-sm border border-slate-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
            </Button>

            <div className="flex gap-3">
              {isOnline && ["booked", "confirmed"].includes(status) && (
                <Button
                  onClick={() =>
                 window.open(`http://localhost:8080/room/${appointment._id}`, "_blank")
                  }
                  className="rounded-full px-8 shadow-lg bg-blue-600 hover:bg-blue-700 animate-pulse"
                >
                  <Video className="mr-2" size={18} />
                  Enter Consultation
                </Button>
              )}

              <Button
                variant="outline"
                className="rounded-full bg-white"
                onClick={handlePrint}
              >
                <Printer size={18} className="mr-2" /> Print Receipt
              </Button>

              {status !== "cancelled" && (
                <Button
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 rounded-full"
                  onClick={() => setShowCancelModal(true)}
                >
                  Cancel Visit
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: MAIN RECEIPT */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl bg-white">
                {/* Hospital Branding */}
                <div className="bg-slate-900 p-10 text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-6">
                      <div className="bg-blue-500 p-4 rounded-2xl shadow-lg h-fit">
                        {isOnline ? (
                          <Video size={36} />
                        ) : (
                          <Building2 size={36} />
                        )}
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight mb-2">
                          {isOnline
                            ? "Global Virtual Clinic"
                            : appointment.hospital?.hospitalName}
                        </h2>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-500/20 text-blue-300 border-none px-3">
                            {appointment.department}
                          </Badge>
                          <span className="text-slate-500">|</span>
                          <span className="text-slate-400 text-sm font-medium">
                            OPD Services
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <Badge
                        className={`uppercase px-4 py-1 rounded-full mb-3 ${
                          status === "confirmed"
                            ? "bg-emerald-500"
                            : status === "cancelled"
                            ? "bg-red-500"
                            : "bg-amber-500"
                        }`}
                      >
                        {status}
                      </Badge>
                      <p className="text-[10px] text-slate-500 font-mono tracking-widest">
                        UID: {appointment.appointmentId}
                      </p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-10 space-y-12">
                  {/* Doctor & Schedule */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Medical Professional
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={32} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900">
                            Dr. {appointment.doctor?.doctorName}
                          </h4>
                          <p className="text-sm text-slate-500 font-bold">
                            {appointment.doctor?.qualification}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Slot Details
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 font-bold text-slate-700">
                          <Calendar size={18} className="text-blue-500" />
                          {new Date(
                            appointment.schedule.date
                          ).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-3 font-bold text-slate-700">
                          <Clock size={18} className="text-blue-500" />
                          {appointment.schedule.timeSlot}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Patient Info Section */}
                  <div className="pt-8 border-t border-slate-100">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
                      Patient Identification
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Name</p>
                        <p className="font-bold text-slate-900">
                          Registered User
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">
                          Booking Type
                        </p>
                        <p className="font-bold capitalize">
                          {appointment.bookingType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Queue No.</p>
                        <p className="text-2xl font-black text-blue-600">
                          #{appointment.token?.tokenNumber || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Ref ID</p>
                        <button
                          onClick={() =>
                            copyToClipboard(appointment.appointmentId)
                          }
                          className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="font-mono text-sm">
                            {appointment.appointmentId.slice(0, 8)}...
                          </span>
                          {copied ? (
                            <Check size={14} className="text-emerald-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div className="bg-slate-900/5 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Receipt className="text-slate-400" size={20} />
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tighter">
                        Billing Summary
                      </h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Consultation Fee</span>
                        <span className="font-bold text-slate-900">
                          ₹{appointment.fees?.consultationFee}.00
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Service & Tech Charges
                        </span>
                        <span className="font-bold text-slate-900">₹50.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <span className="font-black text-slate-900 uppercase">
                          Total Paid
                        </span>
                        <div className="text-right">
                          <p className="text-2xl font-black text-blue-600">
                            ₹{appointment.fees?.consultationFee + 50}.00
                          </p>
                          <Badge
                            variant="outline"
                            className="border-emerald-500 text-emerald-600 text-[10px]"
                          >
                            TRANSACTION SUCCESSFUL
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Footer Signature */}
                <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      End-to-End Encrypted Health Record
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    Timestamp: {new Date().toLocaleString()}
                  </p>
                </div>
              </Card>

              {/* HEALTH TIPS SECTION */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="rounded-3xl border-none shadow-lg bg-blue-600 text-white p-8">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                    <Info size={24} /> Pre-visit Checklist
                  </h4>
                  <ul className="space-y-3 opacity-90 text-sm">
                    <li className="flex items-start gap-2">
                      • Carry your previous medical reports and prescriptions
                    </li>
                    <li className="flex items-start gap-2">
                      • Reach the facility 20 mins prior for vitals check
                    </li>
                    <li className="flex items-start gap-2">
                      • Keep your valid Government ID card ready
                    </li>
                  </ul>
                </Card>
                <Card className="rounded-3xl border-none shadow-lg bg-emerald-500 text-white p-8">
                  <h4 className="text-xl font-black mb-4 flex items-center gap-2">
                    <History size={24} /> Reschedule Policy
                  </h4>
                  <p className="text-sm opacity-90 mb-4">
                    Need to change your time? You can reschedule your
                    appointment up to 4 hours before the slot.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl font-bold text-emerald-700"
                  >
                    Reschedule Now
                  </Button>
                </Card>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR */}
            <div className="space-y-6">
              <Card className="rounded-[2rem] border-none shadow-xl p-8 bg-white">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <MapPin className="text-red-500" /> Location Details
                  </CardTitle>
                </CardHeader>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-black mb-2">
                      Facility Address
                    </p>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed">
                      {appointment.hospital?.address ||
                        "Health Plaza, 4th Floor, Sector 12, Medical District, IN"}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button className="w-full rounded-2xl h-12 gap-2">
                      <ExternalLink size={16} /> Open in Google Maps
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-2xl h-12 gap-2"
                    >
                      <Phone size={16} /> Contact Reception
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="rounded-[2rem] border-none shadow-xl p-8 bg-slate-900 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="text-blue-400" />
                  <h4 className="font-black text-lg">Need Help?</h4>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-blue-300 mb-1">
                      Patient Support
                    </p>
                    <p className="text-sm font-black">+91 1800 200 4000</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-blue-300 mb-1">
                      Email Support
                    </p>
                    <p className="text-sm font-black">care@hospital.com</p>
                  </div>
                </div>
              </Card>

              {/* QUICK ACTIONS */}
              <div className="flex flex-col gap-3">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
                  Quick Links
                </h5>
                <Button
                  variant="ghost"
                  className="justify-start gap-4 h-14 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200"
                >
                  <FileText className="text-blue-500" /> View Medical History
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-4 h-14 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200"
                >
                  <CreditCard className="text-emerald-500" /> View All Invoices
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-4 h-14 rounded-2xl hover:bg-white border border-transparent hover:border-slate-200"
                >
                  <Share2 className="text-purple-500" /> Share with Family
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CANCELLATION OVERLAY */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
          <Card className="max-w-lg w-full rounded-[3rem] border-none shadow-2xl overflow-hidden">
            <div className="bg-red-500 p-10 text-white text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-3xl font-black">Confirm Revocation</h3>
              <p className="mt-2 opacity-80">
                You are about to cancel your medical slot.
              </p>
            </div>
            <CardContent className="p-10">
              <div className="space-y-6">
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <p className="text-red-700 text-sm font-bold leading-relaxed">
                    Note: As per our policy, cancellations within 24 hours of
                    the slot may result in a partial refund or service fee
                    deduction.
                  </p>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                    Why are you cancelling? (Required)
                  </label>
                  <textarea
                    placeholder="e.g. Health improved, Emergency, Wrong slot selected..."
                    className="w-full rounded-2xl border-2 border-slate-100 p-5 text-sm focus:ring-4 focus:ring-red-500/10 focus:border-red-500 outline-none transition-all min-h-[120px]"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="destructive"
                    className="h-16 rounded-2xl font-black text-lg shadow-xl shadow-red-200"
                    disabled={cancelLoading}
                    onClick={handleCancelOpd}
                  >
                    {cancelLoading
                      ? "Processing Withdrawal..."
                      : "Confirm Cancellation"}
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 rounded-2xl font-bold"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Keep My Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* PRINT-SPECIFIC CSS STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .max-w-5xl { max-width: 100% !important; padding: 0 !important; }
          .shadow-2xl, .shadow-xl, .shadow-lg { box-shadow: none !important; }
          .rounded-[2.5rem], .rounded-[2rem], .rounded-3xl { border-radius: 0 !important; }
          .bg-slate-900 { background-color: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-slate-50, .bg-slate-900/5 { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .lg\\:col-span-2 { width: 100% !important; }
          .lg\\:grid-cols-3 { display: block !important; }
          aside, .lg\\:col-span-1 { display: none !important; }
          @page { size: auto; margin: 15mm; }
        }
      `,
        }}
      />
    </DashboardLayout>
  );
};

export default AppointmentDetail;
