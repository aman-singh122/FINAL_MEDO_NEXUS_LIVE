import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Building,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ConfirmAndPay = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Data usually comes from the navigation state (e.g., from the Chatbot or Doctor List)
  const appointmentData = location.state?.appointmentDetails || {
    doctorName: "Dr. Sandeep Sharma",
    specialty: "Cardiologist",
    hospitalName: "City Medical Center",
    date: "2025-10-25",
    time: "10:30 AM",
    consultationFee: 500,
    type: "OPD Visit"
  };

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);

  const serviceFee = 45;
  const totalAmount = appointmentData.consultationFee + serviceFee;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful! Appointment confirmed.");
      navigate("/appointments", { state: { success: true } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 md:px-8 sticky top-0 z-20">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-slate-600 font-bold rounded-full">
          <ArrowLeft size={18} /> Back
        </Button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-black text-slate-800 uppercase tracking-tight">Checkout</h1>
        </div>
        <div className="w-20"></div> {/* Spacer for symmetry */}
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Appointment Summary */}
        <div className="lg:col-span-7 space-y-6">
          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Confirm Details</h2>
            
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/5 p-6 border-b border-primary/10 flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <User size={30} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{appointmentData.doctorName}</h3>
                    <p className="text-sm font-bold text-primary">{appointmentData.specialty}</p>
                    <div className="flex items-center gap-2 mt-2 text-slate-500 font-medium text-xs">
                      <Building size={14} /> {appointmentData.hospitalName}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Appointment Date</p>
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(appointmentData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Preferred Slot</p>
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      <Clock size={16} className="text-slate-400" />
                      {appointmentData.time}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest px-1">Select Payment Method</h2>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: "upi", title: "UPI (PhonePe, Google Pay, BHIM)", icon: <Smartphone className="text-blue-500" /> },
                { id: "card", title: "Credit / Debit Card", icon: <CreditCard className="text-emerald-500" /> },
                { id: "wallet", title: "Wallets", icon: <Wallet className="text-orange-500" /> }
              ].map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                    paymentMethod === method.id 
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                    : "border-white bg-white hover:border-slate-200 shadow-sm"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center bg-slate-50`}>
                    {method.icon}
                  </div>
                  <span className="flex-1 font-bold text-slate-700">{method.title}</span>
                  {paymentMethod === method.id && <CheckCircle2 className="text-primary" size={20} />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Billing & Action */}
        <div className="lg:col-span-5">
          <Card className="border-none shadow-xl rounded-[2.5rem] sticky top-24 overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-8">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <ShieldCheck className="text-primary" /> Order Summary
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-4">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Consultation Fee</span>
                <span className="text-slate-800 font-bold">₹{appointmentData.consultationFee}.00</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Digital Booking Fee</span>
                <span className="text-slate-800 font-bold">₹{serviceFee}.00</span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-slate-900 uppercase">Total Payable</span>
                <span className="text-3xl font-black text-primary">₹{totalAmount}.00</span>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl flex items-start gap-3 mt-6">
                <AlertCircle className="text-emerald-600 mt-0.5" size={16} />
                <p className="text-[11px] text-emerald-800 leading-relaxed font-bold">
                  Free cancellation available up to 4 hours before the appointment.
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-8 pt-0 flex flex-col gap-4">
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-black shadow-lg shadow-primary/20 transition-all active:scale-95 gap-3"
              >
                {isProcessing ? (
                  <>Securely Processing...</>
                ) : (
                  <>
                    <Lock size={20} /> PAY NOW
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center gap-2 opacity-50">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant Gateway</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};


export default ConfirmAndPay;