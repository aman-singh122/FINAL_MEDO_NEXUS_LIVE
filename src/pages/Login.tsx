import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Zap
} from "lucide-react";

import { loginUser } from "@/api/auth.api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Login = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await loginUser(formData);
      const token = res.data.token;
      if (!token) throw new Error("Authentication failed");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      await refetchUser();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-50">
      {/* --- AMBIENT BACKGROUND ELEMENTS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px]" />
      
      {/* --- BACK NAVIGATION --- */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          to="/"
          className="group flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 group-hover:border-primary/20">
            <ArrowLeft className="h-4 w-4" />
          </div>
          Back to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        {/* --- LOGIN CARD --- */}
        <div className="backdrop-blur-xl bg-white/70 border border-white shadow-[0_8px_32px_0_rgba(148,163,184,0.1)] rounded-[2.5rem] p-8 md:p-12">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-4">
              <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/20" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                <Heart className="h-8 w-8 text-white fill-white/20" />
              </div>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Medo<span className="text-primary">sphere</span>
            </h2>
            <p className="mt-2 text-slate-500 font-medium">Safe access to your health portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm animate-in fade-in slide-in-from-top-2">
                <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                <p className="font-semibold">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Medical Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@hospital.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-14 pl-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link to="/forgot" className="text-xs font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-14 pl-12 pr-12 rounded-2xl border-slate-200 bg-white/50 focus:bg-white transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full h-14 rounded-2xl text-base font-bold transition-all duration-300",
                "bg-slate-900 hover:bg-primary shadow-xl shadow-slate-200 hover:shadow-primary/30",
                "flex items-center justify-center gap-2"
              )}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                <>
                  Sign In <Zap className="h-4 w-4 fill-current" />
                </>
              )}
            </Button>
          </form>

          {/* --- FOOTER --- */}
          <div className="mt-10 pt-8 border-t border-slate-200/60">
            <div className="flex flex-col items-center gap-4">
              <p className="text-slate-500 font-medium">
                New to Medosphere?{" "}
                <Link to="/register" className="text-primary font-black hover:underline">
                  Create account
                </Link>
              </p>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-700">
                  HIPAA Compliant & End-to-End Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;