import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ChevronRight,
} from "lucide-react";

import { registerUser, loginUser } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      const res = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.token);
      await refetchUser();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* --- LEFT SIDE: ARTISTIC SHOWCASE (40%) --- */}
      <div className="hidden lg:flex lg:w-[40%] relative bg-[#0F172A] p-12 flex-col justify-between overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Logo Section */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/30">
            <Heart className="h-5 w-5 text-white fill-white/20" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Medo<span className="text-blue-400">sphere</span>
          </span>
        </div>

        {/* Content Section */}
        <div className="relative z-10">
          <h2 className="text-4xl font-semibold text-white leading-tight mb-6">
            The next generation of <br />
            <span className="text-blue-400">patient care.</span>
          </h2>
          
          <div className="space-y-4 mb-12">
             {[
              { icon: <Activity className="w-5 h-5" />, title: "Live Queueing", color: "text-blue-400" },
              { icon: <ShieldCheck className="w-5 h-5" />, title: "HIPAA Compliant", color: "text-emerald-400" },
              { icon: <CheckCircle2 className="w-5 h-5" />, title: "Instant Tokens", color: "text-purple-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-xl w-fit pr-8">
                <span className={item.color}>{item.icon}</span>
                <span className="text-sm font-medium">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote/Testimonial */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-slate-400 text-sm italic italic mb-4">
            "Medosphere has completely transformed how our family manages appointments. No more long wait times in cold hallways."
          </p>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-700 border border-white/20" />
            <div>
              <p className="text-white text-xs font-bold">Dr. Sarah Jenkins</p>
              <p className="text-slate-500 text-[10px]">Chief Medical Officer</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: CLEAN FORM (60%) --- */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 relative">
        
        {/* Back Link */}
        <Link
          to="/"
          className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Portal
        </Link>

        <div className="max-w-[440px] w-full">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
            <p className="text-slate-500 text-sm">Join the network and start managing your health journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-semibold rounded-xl flex items-center gap-2">
                <ShieldCheck size={14} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                  <Input name="name" placeholder="John Doe" onChange={handleChange} className="pl-11 h-12 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" required />
                </div>
              </div>

              {/* Email and Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input name="email" type="email" placeholder="name@example.com" onChange={handleChange} className="pl-11 h-12 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input name="phone" placeholder="+1 (555) 000" onChange={handleChange} className="pl-11 h-12 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" required />
                  </div>
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      onChange={handleChange} 
                      className="pl-11 h-12 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-slate-700 ml-1">Confirm</label>
                  <div className="relative group">
                    <Input 
                      name="confirmPassword" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      onChange={handleChange} 
                      className="pl-4 pr-11 h-12 rounded-xl border-slate-200 bg-white focus:ring-4 focus:ring-blue-500/5 transition-all" 
                      required 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all duration-300 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Get Started <ChevronRight size={16} />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors">
              Log In
            </Link>
          </p>

          <div className="mt-12 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
              Secure 256-bit SSL Encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;